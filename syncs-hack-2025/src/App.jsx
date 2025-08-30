import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// This is your mock data. In a real app, this would come from a database.
const users = [
  {
    name: 'Alex',
    hasSkill: 'Chinese',
    wantsSkill: 'Surfing',
    avatar: 'https://placehold.co/100x100/4F46E5/FFFFFF?text=A'
  },
  {
    name: 'Ben',
    hasSkill: 'Surfing',
    wantsSkill: 'Chinese',
    avatar: 'https://placehold.co/100x100/059669/FFFFFF?text=B'
  },
  {
    name: 'Casey',
    hasSkill: 'Graphic Design',
    wantsSkill: 'French',
    avatar: 'https://placehold.co/100x100/DC2626/FFFFFF?text=C'
  },
  {
    name: 'Drew',
    hasSkill: 'French',
    wantsSkill: 'Graphic Design',
    avatar: 'https://placehold.co/100x100/8B5CF6/FFFFFF?text=D'
  },
];

const App = () => {
  const [hasSkill, setHasSkill] = useState('');
  const [wantsSkill, setWantsSkill] = useState('');
  const [foundMatch, setFoundMatch] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFindMatch = () => {
    setError('');
    setLoading(true);
    setFoundMatch(null);

    // Simulate network delay for a more realistic feel
    setTimeout(() => {
      if (!hasSkill || !wantsSkill) {
        setError("Please enter both skills to find a match!");
        setLoading(false);
        return;
      }

      // The core matching logic
      const match = users.find(user => 
        user.hasSkill.toLowerCase() === wantsSkill.toLowerCase() &&
        user.wantsSkill.toLowerCase() === hasSkill.toLowerCase()
      );
      
      setFoundMatch(match);
      setLoading(false);
    }, 1500); // 1.5 second delay
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-gray-800 rounded-3xl shadow-2xl p-6 sm:p-10 w-full max-w-lg text-white">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-indigo-400 mb-2">Skill Swap City</h1>
          <p className="text-gray-400 text-lg">Find your perfect skill-swapping partner!</p>
        </div>

        {/* Input Form */}
        <div className="space-y-6 mb-8">
          <div>
            <label htmlFor="has-skill" className="block text-lg font-medium text-gray-300 mb-1">Skill I Have</label>
            <input
              type="text"
              id="has-skill"
              value={hasSkill}
              onChange={(e) => setHasSkill(e.target.value)}
              placeholder="e.g., Cooking"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="wants-skill" className="block text-lg font-medium text-gray-300 mb-1">Skill I Want</label>
            <input
              type="text"
              id="wants-skill"
              value={wantsSkill}
              onChange={(e) => setWantsSkill(e.target.value)}
              placeholder="e.g., Surfing"
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          onClick={handleFindMatch}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
            loading 
              ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg'
          }`}
        >
          {loading ? 'Finding Match...' : 'Find My Match'}
        </motion.button>
        
        {error && (
            <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-center mt-4">
                {error}
            </motion.p>
        )}

        {/* Match Result Section with Animation */}
        <AnimatePresence>
          {foundMatch && (
            <motion.div
              key="match-card"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="bg-gray-700 rounded-2xl p-6 mt-8 border-2 border-indigo-500 shadow-xl text-center"
            >
              <h2 className="text-3xl font-bold mb-4 text-green-400">It's a Match!</h2>
              <img 
                src={foundMatch.avatar} 
                alt={foundMatch.name} 
                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white shadow-md"
              />
              <h3 className="text-2xl font-bold mb-2">{foundMatch.name}</h3>
              <div className="space-y-2 text-gray-300">
                <p><strong>Has the skill you want:</strong> <span className="text-green-300">{foundMatch.hasSkill}</span></p>
                <p><strong>Wants the skill you have:</strong> <span className="text-green-300">{foundMatch.wantsSkill}</span></p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
