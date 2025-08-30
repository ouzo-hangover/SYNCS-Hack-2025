import React, { useState, useRef, useEffect } from "react";

// A simple user icon placeholder.
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-8" // Made icon bigger
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={1.5}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    />
  </svg>
);

const UserMenu = ({ currentUser, isLoggedIn, onNavigateToAccount, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Effect to handle clicks outside of the menu to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = (e) => {
    e.preventDefault();
    setIsOpen(false);
    onNavigateToAccount();
  };

  const handleLogoutClick = (e) => {
    e.preventDefault();
    setIsOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* The main button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-3 rounded-full text-white user-menu-gradient flex items-center justify-center
                   transform transition duration-200 hover:scale-110 active:scale-100
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d0d1a] focus:ring-[#be65ff]"
      >
        <span className="sr-only">Open user menu</span>
        <UserIcon />
      </button>

      {/* The dropdown menu */}
      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl
                     user-menu-gradient ring-1 ring-white/10 overflow-hidden"
        >
          <div className="py-2">
            {isLoggedIn ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-sm opacity-70">Signed in as</p>
                  <p className="text-md font-medium truncate">
                    {currentUser.name || currentUser.email}
                  </p>
                </div>
                <div className="border-t border-white/10 my-1"></div>
                <a
                  href="#"
                  onClick={handleNavigate}
                  className="block px-4 py-2 text-md hover:bg-white/10 transition-colors"
                >
                  Account Settings
                </a>
                <a
                  href="#"
                  onClick={handleLogoutClick}
                  className="block px-4 py-2 text-md hover:bg-white/10 transition-colors"
                >
                  Logout
                </a>
              </>
            ) : (
              <>
                <a href="#" onClick={handleNavigate} className="block px-4 py-3 text-md hover:bg-white/10 transition-colors">
                  Login
                </a>
                <a href="#" onClick={handleNavigate} className="block px-4 py-3 text-md hover:bg-white/10 transition-colors">
                  Register
                </a>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;