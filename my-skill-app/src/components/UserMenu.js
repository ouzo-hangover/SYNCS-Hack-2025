import React, { useState, useEffect, useRef } from 'react';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // This effect closes the menu if you click outside of it
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

  const handleLinkClick = (e) => {
    e.preventDefault(); // Prevent the link from navigating
    setIsOpen(false); // Close the menu on click
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center text-purple-300 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors"
        aria-label="User menu"
      >
        {/* A simple user icon SVG */}
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
          <a href="#account" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">Account Management</a>
          <a href="#matches" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">Matches</a>
          <a href="#chat" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-300 hover:bg-slate-700 hover:text-white">Chat</a>
        </div>
      </div>
    </div>
  );
};

export default UserMenu;