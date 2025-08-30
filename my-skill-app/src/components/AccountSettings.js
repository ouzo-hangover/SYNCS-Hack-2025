// src/components/AccountSettings.js

import React, { useState, useEffect } from 'react';

// A simple list of skills for the dropdown. You could fetch this from an API later.
const availableSkills = ['Python', 'React', 'Gardening', 'Digital Marketing', 'Spanish', 'Web Design', 'Data Structures'];

const AccountSettings = ({ currentUser, onRegister, onUpdate, onBack }) => {
  // State for form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState([]);
  // For this example, we'll just let the user type lat/lng. A real app would use a map picker.
  const [location, setLocation] = useState({ lat: '', lng: '' });

  // This effect pre-fills the form when a logged-in user's data is available
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setInterests(currentUser.interests || '');
      setSkills(currentUser.skills || []);
      setLocation(currentUser.location || { lat: '', lng: '' });
    }
  }, [currentUser]);

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const newUser = { id: Date.now(), name, email, skills, interests, location };
    onRegister(newUser); // Pass the new user data up to App.js
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, name, interests, skills, location };
    onUpdate(updatedUser); // Pass the updated data up to App.js
  };

  const handleSkillChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSkills(selectedOptions);
  };

  // --- Render Logic ---

  // RENDER THIS IF USER IS NOT LOGGED IN
  if (!currentUser) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 animate-fadeInUp max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">Create Your Account</h2>
        <form onSubmit={handleRegisterSubmit}>
          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-purple-200 mb-2" htmlFor="name">Full Name</label>
            <input type="text" id="name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" required />
          </div>
          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-purple-200 mb-2" htmlFor="email">Email Address</label>
            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" required />
          </div>
          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-purple-200 mb-2" htmlFor="password">Password</label>
            <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="flex items-center justify-between">
            <button type="button" onClick={onBack} className="text-gray-400 hover:text-white transition">&larr; Back to Home</button>
            <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700">Create Account</button>
          </div>
        </form>
      </div>
    );
  }

  // RENDER THIS IF USER IS LOGGED IN
  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 animate-fadeInUp max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">Manage Your Account</h2>
      <form onSubmit={handleUpdateSubmit}>
        {/* Name Input */}
        <div className="mb-4">
          <label className="block text-purple-200 mb-2" htmlFor="update-name">Full Name</label>
          <input type="text" id="update-name" value={name} onChange={e => setName(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" />
        </div>
        {/* Interests Input */}
        <div className="mb-4">
          <label className="block text-purple-200 mb-2" htmlFor="update-interests">Your Interests</label>
          <input type="text" id="update-interests" value={interests} onChange={e => setInterests(e.target.value)} placeholder="e.g., hiking, coding, music" className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" />
        </div>
        {/* Skills Dropdown */}
        <div className="mb-4">
          <label className="block text-purple-200 mb-2" htmlFor="update-skills">Your Skills (hold Ctrl/Cmd to select multiple)</label>
          <select id="update-skills" multiple value={skills} onChange={handleSkillChange} className="w-full p-3 bg-slate-700 rounded-md h-40 focus:ring-2 focus:ring-indigo-500">
            {availableSkills.map(skill => <option key={skill} value={skill}>{skill}</option>)}
          </select>
        </div>
        {/* Location Inputs */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-200 mb-2" htmlFor="lat">Latitude</label>
            <input type="number" step="any" id="lat" value={location.lat} onChange={e => setLocation({ ...location, lat: parseFloat(e.target.value) })} className="w-full p-3 bg-slate-700 rounded-md" placeholder="-27.470" />
          </div>
          <div>
            <label className="block text-purple-200 mb-2" htmlFor="lng">Longitude</label>
            <input type="number" step="any" id="lng" value={location.lng} onChange={e => setLocation({ ...location, lng: parseFloat(e.target.value) })} className="w-full p-3 bg-slate-700 rounded-md" placeholder="153.023" />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-gray-400 hover:text-white transition">&larr; Back to Home</button>
          <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default AccountSettings;