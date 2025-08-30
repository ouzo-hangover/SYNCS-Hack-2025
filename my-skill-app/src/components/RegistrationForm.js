// src/components/RegistrationForm.js

import React, { useState } from 'react';

const RegistrationForm = ({ onRegister, onBack }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [city, setCity] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // For a new user, skills, interests, and location can be empty initially
    const newUser = { id: Date.now(), name, email, city, skills: [], interests: [] };
    onRegister(newUser);
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 animate-fadeInUp max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-purple-300 mb-6 text-center">Create Your Account</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="mb-4">
          <label className="block text-purple-200 mb-2" htmlFor="password">Password</label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" required />
        </div>
        {/* City Input */}
        <div className="mb-6">
          <label className="block text-purple-200 mb-2" htmlFor="reg-city">City</label>
          <input 
            type="text" 
            id="reg-city" 
            value={city} 
            onChange={e => setCity(e.target.value)} className="w-full p-3 bg-slate-700 rounded-md focus:ring-2 focus:ring-indigo-500" 
            placeholder="e.g., Sydney" required />
        </div>
        <div className="flex items-center justify-between">
          <button type="button" onClick={onBack} className="text-gray-400 hover:text-white transition">&larr; Back to Home</button>          <button type="submit" className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700">Create Account</button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;