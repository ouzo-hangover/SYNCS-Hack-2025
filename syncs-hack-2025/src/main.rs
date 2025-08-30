// src/lib.rs
use std::{
    cell::RefCell,
    error::Error,
    ffi::{CStr, CString},
    fs,
    io::BufReader,
    os::raw::c_char,
    path::Path,
};

use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct Skill {
    name: String,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct Location {
    lat: f32,
    long: f32,
}

#[derive(Debug, Default, Clone, Serialize, Deserialize)]
struct UserInfo {
    name: String,
    location_name: String,
    location: Location,
    photo: String,
    skills: Vec<Skill>,
    interests: Vec<Skill>,
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
struct UserList {
    users: Vec<UserInfo>,
}

thread_local! {
    static LAST_ERROR: RefCell<Option<CString>> = RefCell::new(None);
}

fn set_last_error(msg: impl Into<String>) {
    let s = CString::new(msg.into())
        .unwrap_or_else(|_| CString::new("invalid utf-8 in error").unwrap());
    LAST_ERROR.with(|e| *e.borrow_mut() = Some(s));
}

/// Returns a pointer to a thread-local error message (valid until next FFI call).
#[no_mangle]
pub extern "C" fn last_error_message() -> *const c_char {
    LAST_ERROR.with(|e| {
        if let Some(s) = &*e.borrow() {
            s.as_ptr()
        } else {
            std::ptr::null()
        }
    })
}

fn cstr_to_string(ptr: *const c_char, field: &str) -> Result<String, String> {
    if ptr.is_null() {
        return Err(format!("{} is null", field));
    }
    unsafe { CStr::from_ptr(ptr) }
        .to_str()
        .map(|s| s.to_string())
        .map_err(|_| format!("{} is not valid UTF-8", field))
}

fn read_all_users_internal(path: &str) -> Result<UserList, Box<dyn Error>> {
    if !Path::new(path).exists() {
        return Ok(UserList::default());
    }
    let file = std::fs::File::open(path)?;
    let reader = BufReader::new(file);
    let all_users = serde_json::from_reader(reader)?;
    Ok(all_users)
}

fn write_all_users_internal(path: &str, users: &UserList) -> Result<(), Box<dyn Error>> {
    let json_str = serde_json::to_string_pretty(users)?;
    fs::write(path, json_str)?;
    Ok(())
}

// Data Path

static mut DATA_PATH_PTR: *mut c_char = std::ptr::null_mut();

fn data_path() -> &'static str {
    unsafe {
        if DATA_PATH_PTR.is_null() {
            "data.json"
        } else {
            // SAFETY: Set once and remains valid until set_data_path is called again.
            CStr::from_ptr(DATA_PATH_PTR)
                .to_str()
                .unwrap_or("data.json")
        }
    }
}
#[no_mangle]
pub extern "C" fn set_data_path(path: *const c_char) -> i32 {
    match cstr_to_string(path, "path") {
        Ok(s) => {
            let c = CString::new(s).unwrap();
            unsafe {
                if !DATA_PATH_PTR.is_null() {
                    let _ = CString::from_raw(DATA_PATH_PTR);
                }
                DATA_PATH_PTR = c.into_raw();
            }
            0
        }
        Err(e) => {
            set_last_error(e);
            1
        }
    }
}

// Allocate and free skills
#[no_mangle]
pub extern "C" fn skill_new(name: *const c_char) -> *mut Skill {
    let Ok(name) = cstr_to_string(name, "name") else {
        set_last_error("name is invalid");
        return std::ptr::null_mut();
    };
    Box::into_raw(Box::new(Skill { name }))
}
#[no_mangle]
pub extern "C" fn skill_free(ptr: *mut Skill) {
    if !ptr.is_null() {
        unsafe {
            let _ = Box::from_raw(ptr);
        }
    }
}

/// UserInfo with default values
#[no_mangle]
pub extern "C" fn user_info_new_basic(
    name: *const c_char,
    location_name: *const c_char,
    lat: f32,
    long: f32,
    photo: *const c_char,
) -> *mut UserInfo {
    let Ok(name) = cstr_to_string(name, "name") else {
        set_last_error("name is invalid");
        return std::ptr::null_mut();
    };
    let Ok(location_name) = cstr_to_string(location_name, "location_name") else {
        set_last_error("location_name is invalid");
        return std::ptr::null_mut();
    };
    let Ok(photo) = cstr_to_string(photo, "photo") else {
        set_last_error("photo is invalid");
        return std::ptr::null_mut();
    };

    let user = UserInfo {
        name,
        location_name,
        location: Location { lat, long },
        photo,
        skills: Vec::new(),
        interests: Vec::new(),
    };
    Box::into_raw(Box::new(user))
}

/// Free a UserInfo
#[no_mangle]
pub extern "C" fn user_info_free(ptr: *mut UserInfo) {
    if !ptr.is_null() {
        unsafe {
            let _ = Box::from_raw(ptr);
        }
    }
}

#[no_mangle]
pub extern "C" fn user_info_add_skill(user: *mut UserInfo, skill: *const Skill) -> i32 {
    if user.is_null() || skill.is_null() {
        set_last_error("user or skill is null");
        return 1;
    }
    let u = unsafe { &mut *user };
    let s = unsafe { &*skill };
    u.skills.push(s.clone());
    0
}

#[no_mangle]
pub extern "C" fn user_info_add_interest(user: *mut UserInfo, skill: *const Skill) -> i32 {
    if user.is_null() || skill.is_null() {
        set_last_error("user or skill is null");
        return 1;
    }
    let u = unsafe { &mut *user };
    let s = unsafe { &*skill };
    u.interests.push(s.clone());
    0
}

/* -------------------- File-backed operations -------------------- */

/// Add this user to the store if not exists (by name)
#[no_mangle]
pub extern "C" fn user_add_to_store(user: *const UserInfo) -> i32 {
    if user.is_null() {
        set_last_error("user is null");
        return 1;
    }
    let u = unsafe { &*user };
    match read_all_users_internal(data_path()) {
        Ok(mut list) => {
            let exists = list.users.iter().any(|x| x.name == u.name);
            if !exists {
                list.users.push(u.clone());
            }
            if let Err(e) = write_all_users_internal(data_path(), &list) {
                set_last_error(e.to_string());
                return 2;
            }
            0
        }
        Err(e) => {
            set_last_error(e.to_string());
            3
        }
    }
}

#[no_mangle]
pub extern "C" fn user_add_skill_and_write(user: *const UserInfo, skill: *const Skill) -> i32 {
    if user.is_null() || skill.is_null() {
        set_last_error("user or skill is null");
        return 1;
    }
    let u = unsafe { &*user };
    let s = unsafe { &*skill };
    match read_all_users_internal(data_path()) {
        Ok(mut list) => {
            if let Some(found) = list.users.iter_mut().find(|x| x.name == u.name) {
                found.skills.push(s.clone());
                if let Err(e) = write_all_users_internal(data_path(), &list) {
                    set_last_error(e.to_string());
                    return 2;
                }
                0
            } else {
                set_last_error("user not found");
                4
            }
        }
        Err(e) => {
            set_last_error(e.to_string());
            3
        }
    }
}

#[no_mangle]
pub extern "C" fn user_add_interest_and_write(
    user: *const UserInfo,
    interest: *const Skill,
) -> i32 {
    if user.is_null() || interest.is_null() {
        set_last_error("user or interest is null");
        return 1;
    }
    let u = unsafe { &*user };
    let s = unsafe { &*interest };
    match read_all_users_internal(data_path()) {
        Ok(mut list) => {
            if let Some(found) = list.users.iter_mut().find(|x| x.name == u.name) {
                found.interests.push(s.clone());
                if let Err(e) = write_all_users_internal(data_path(), &list) {
                    set_last_error(e.to_string());
                    return 2;
                }
                0
            } else {
                set_last_error("user not found");
                4
            }
        }
        Err(e) => {
            set_last_error(e.to_string());
            3
        }
    }
}

#[no_mangle]
pub extern "C" fn user_remove_skill_and_write(user: *const UserInfo, skill: *const Skill) -> i32 {
    if user.is_null() || skill.is_null() {
        set_last_error("user or skill is null");
        return 1;
    }
    let u = unsafe { &*user };
    let s = unsafe { &*skill };
    match read_all_users_internal(data_path()) {
        Ok(mut list) => {
            if let Some(found) = list.users.iter_mut().find(|x| x.name == u.name) {
                let before = found.skills.len();
                found.skills.retain(|x| x.name != s.name);
                if before == found.skills.len() {
                    // No-op if not present
                }
                if let Err(e) = write_all_users_internal(data_path(), &list) {
                    set_last_error(e.to_string());
                    return 2;
                }
                0
            } else {
                set_last_error("user not found");
                4
            }
        }
        Err(e) => {
            set_last_error(e.to_string());
            3
        }
    }
}

#[no_mangle]
pub extern "C" fn user_remove_interest_and_write(
    user: *const UserInfo,
    interest: *const Skill,
) -> i32 {
    if user.is_null() || interest.is_null() {
        set_last_error("user or interest is null");
        return 1;
    }
    let u = unsafe { &*user };
    let s = unsafe { &*interest };
    match read_all_users_internal(data_path()) {
        Ok(mut list) => {
            if let Some(found) = list.users.iter_mut().find(|x| x.name == u.name) {
                let before = found.interests.len();
                found.interests.retain(|x| x.name != s.name);
                if before == found.interests.len() {
                    // No-op if not present
                }
                if let Err(e) = write_all_users_internal(data_path(), &list) {
                    set_last_error(e.to_string());
                    return 2;
                }
                0
            } else {
                set_last_error("user not found");
                4
            }
        }
        Err(e) => {
            set_last_error(e.to_string());
            3
        }
    }
}

// JSON
#[no_mangle]
pub extern "C" fn read_all_users_json() -> *mut c_char {
    match read_all_users_internal(data_path()) {
        Ok(list) => match serde_json::to_string(&list) {
            Ok(s) => CString::new(s).unwrap().into_raw(),
            Err(e) => {
                set_last_error(e.to_string());
                std::ptr::null_mut()
            }
        },
        Err(e) => {
            set_last_error(e.to_string());
            std::ptr::null_mut()
        }
    }
}

#[no_mangle]
pub extern "C" fn string_free(ptr: *mut c_char) {
    if !ptr.is_null() {
        unsafe {
            let _ = CString::from_raw(ptr);
        }
    }
}

pub fn main() {}
