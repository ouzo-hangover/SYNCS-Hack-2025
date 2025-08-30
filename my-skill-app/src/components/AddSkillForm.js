import React, { useState } from 'react';

const AddSkillForm = ({ onAddSkill }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('teach');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    setSuccess('');

    // Create a new skill object.
    const newSkill = {
      id: Date.now(), // Use a timestamp as a simple unique ID
      userId: 'localuser', // A placeholder user ID
      createdAt: new Date(),
      title,
      description,
      type,
    };

    // Call the function from the parent component (App.js) to add the skill.
    onAddSkill(newSkill);

    // Reset form fields
    setTitle('');
    setDescription('');
    setType('teach');
    setSuccess('Skill added successfully!');
    setTimeout(() => setSuccess(''), 3000); // Message disappears after 3 seconds
  };

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-purple-200 mb-4">Share a Skill</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Input */}
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-300">Skill Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Python for Beginners"
            className="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          />
        </div>

        {/* Description Input */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A brief summary of what you can teach or want to learn."
            className="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          ></textarea>
        </div>

        {/* Type Selector (Teach/Learn) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-300">I want to...</label>
          <div className="mt-2 flex items-center gap-x-6">
            <div className="flex items-center">
              <input id="teach" name="skill-type" type="radio" value="teach" checked={type === 'teach'} onChange={() => setType('teach')} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              <label htmlFor="teach" className="ml-2 block text-sm font-medium leading-6 text-gray-200">Teach this skill</label>
            </div>
            <div className="flex items-center">
              <input id="learn" name="skill-type" type="radio" value="learn" checked={type === 'learn'} onChange={() => setType('learn')} className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600" />
              <label htmlFor="learn" className="ml-2 block text-sm font-medium leading-6 text-gray-200">Learn this skill</label>
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          Add Skill
        </button>

        {/* Feedback Messages */}
        {error && <p className="text-red-400 text-sm mt-2 text-center">{error}</p>}
        {success && <p className="text-green-400 text-sm mt-2 text-center">{success}</p>}
      </form>
    </div>
  );
};

export default AddSkillForm;