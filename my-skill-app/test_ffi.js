const ffi = require("ffi-napi");
const ref = require("ref-napi");
const fs = require("fs");
const path = require("path");

const voidPtr = ref.refType(ref.types.void);
const charPtr = ref.refType(ref.types.char);

// Adjust the path and filename for your platform
const lib = ffi.Library(
  "../syncs-hack-2025/target/release/libsyncs_hack_2025",
  {
    set_data_path: ["int", ["string"]],
    last_error_message: [charPtr, []],

    skill_new: [voidPtr, ["string"]],
    skill_free: ["void", [voidPtr]],

    user_info_new_basic: [
      voidPtr,
      ["string", "string", "float", "float", "string"],
    ],
    user_info_free: ["void", [voidPtr]],

    user_info_add_skill: ["int", [voidPtr, voidPtr]],
    user_info_add_interest: ["int", [voidPtr, voidPtr]],

    user_add_to_store: ["int", [voidPtr]],
    user_add_skill_and_write: ["int", [voidPtr, voidPtr]],
    user_add_interest_and_write: ["int", [voidPtr, voidPtr]],
    user_remove_skill_and_write: ["int", [voidPtr, voidPtr]],
    user_remove_interest_and_write: ["int", [voidPtr, voidPtr]],
  }
);

function lastErr() {
  const p = lib.last_error_message();
  return p.isNull() ? "unknown error" : ref.readCString(p, 0);
}

// The Rust library likely defaults to writing 'data.json' in the project root.
// We'll explicitly set the path to 'public/data.json' to align with the React app.
const dataPath = path.resolve(__dirname, "public", "data.json");
if (lib.set_data_path(Buffer.from(dataPath + '\0'))) {
  throw new Error(`Failed to set data path: ${lastErr()}`);
}

const user = lib.user_info_new_basic("AHHB", "Sydney", 0.0, 0.0, "afilepath");
if (user.isNull()) throw new Error(lastErr());

const skillC = lib.skill_new("skillc");
const skillD = lib.skill_new("skilld");
const skillA = lib.skill_new("skilla");
const skillE = lib.skill_new("skilla");
const skillB = lib.skill_new("skillb");

if (lib.user_info_add_skill(user, skillA)) throw new Error(lastErr());
if (lib.user_info_add_interest(user, skillB)) throw new Error(lastErr());

if (lib.user_add_to_store(user)) throw new Error(lastErr());
if (lib.user_add_interest_and_write(user, skillC)) throw new Error(lastErr());
if (lib.user_add_skill_and_write(user, skillD)) throw new Error(lastErr());
if (lib.user_remove_skill_and_write(user, skillE)) throw new Error(lastErr());

// Read JSON
const jsonPtr = lib.read_all_users_json();
if (jsonPtr.isNull()) throw new Error(lastErr());
const json = ref.readCString(jsonPtr, 0);
lib.string_free(jsonPtr);
console.log(json);

// Free allocations
lib.skill_free(skillB);
lib.skill_free(skillC);
lib.skill_free(skillD);
lib.skill_free(skillE);
lib.user_info_free(user);
