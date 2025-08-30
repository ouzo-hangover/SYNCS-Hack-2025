// src/components/UpdateProfileForm.js

import React, { useState, useEffect } from 'react';

// A simple list of skills for the dropdown. You could fetch this from an API later.
const availableSkills = ['Python', 'React', 'Gardening', 'Digital Marketing', 'Spanish', 'Web Design', 'Data Structures'];

const UpdateProfileForm = ({ currentUser, onUpdate, onBack }) => {
  const [name, setName] = useState('');
  const [interests, setInterests] = useState('');
  const [skills, setSkills] = useState([]);
  const [city, setCity] = useState('');

  // This effect pre-fills the form when a logged-in user's data is available
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setInterests(currentUser.interests || '');
      setSkills(currentUser.skills || []);
      setCity(currentUser.city || '');
    }
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedUser = { ...currentUser, name, interests, skills, city };
    onUpdate(updatedUser);
  };

  const handleSkillChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSkills(selectedOptions);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 animate-fadeInUp max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">Manage Your Account</h2>
      <form onSubmit={handleSubmit}>
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
        {/* City Input */}
        <div className="mb-6">
          <label className="block text-purple-200 mb-2" htmlFor="city">City</label>
          <input 
            type="text" 
            id="city" 
            value={city} 
            onChange={e => setCity(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" 
            placeholder="e.g., Brisbane" />
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-gray-400 hover:text-white transition">&larr; Back to Home</button>
          <button type="submit" className="bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-green-700">Update Profile</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfileForm;