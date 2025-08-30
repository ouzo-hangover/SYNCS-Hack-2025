import React, { useState, useEffect, useRef } from 'react';

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (action) => {
    action();
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center justify-center w-10 h-10 bg-slate-800 rounded-full hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-md shadow-lg py-1 z-20 ring-1 ring-black ring-opacity-5"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="user-menu-button"
        >
          {isLoggedIn ? (
            <>
              <a
                href={currentUser ? `/matches.html?userId=${currentUser.id}` : '/matches.html'}
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white" role="menuitem"
              >
                Matches
              </a>
              <button onClick={() => handleNavigation(onNavigateToAccount)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white" role="menuitem">
                Account
              </button>
              <button onClick={() => handleNavigation(onLogout)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white" role="menuitem">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => handleNavigation(onNavigateToAccount)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white" role="menuitem">
              Login / Register
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserMenu;