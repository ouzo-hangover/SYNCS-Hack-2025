import React, { useState, useEffect, useRef } from 'react';

// --- MODIFICATION 1: Accept props from App.js ---
const UserMenu = ({ isLoggedIn, onNavigateToAccount, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  // --- MODIFICATION 2: Create handlers that call the prop functions ---
  // These functions will execute the action (like logging out) AND close the menu.
  const handleAccountClick = () => {
    onNavigateToAccount();
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    onLogout();
    setIsOpen(false);
  };


  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Button (No changes here) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-purple-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        aria-label="User menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {/* Dropdown Panel */}
      <div
        className={`absolute right-0 mt-2 w-56 bg-slate-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ease-out ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{ transformOrigin: 'top right' }}
      >
        <div className="py-1">
          {/* --- MODIFICATION 3: Conditionally render menu items --- */}
          {isLoggedIn ? (
            // Show these options if the user IS logged in
            <>
              <button
                onClick={handleAccountClick}
                className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                Account Settings
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            // Show this option if the user IS NOT logged in
            <button
              onClick={handleAccountClick}
              className="w-full text-left block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white"
            >
              Login / Sign Up
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserMenu;