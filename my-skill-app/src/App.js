import React, { useState, useEffect } from 'react';
import SkillCard from './components/SkillCard';

const App = () => {
  // --- STATE MANAGEMENT ---
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState('home'); // 'home' or 'results'
  const [searchResults, setSearchResults] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);

  // --- INITIAL DATA (Resets on refresh) ---
  useEffect(() => {
    const exampleSkills = [
      { id: 1, userId: 'localuser', createdAt: new Date(), title: "Python for Beginners", description: "A basic introduction to Python programming.", type: "teach" },
      { id: 2, userId: 'localuser', createdAt: new Date(), title: "React Component Basics", description: "Learn how to build your first React component.", type: "teach" },
      { id: 3, userId: 'localuser', createdAt: new Date(), title: "Digital Marketing", description: "Looking to learn about SEO and content strategy.", type: "learn" },
      { id: 4, userId: 'localuser', createdAt: new Date(), title: "Spanish Conversation", description: "Need a partner to practice speaking Spanish.", type: "learn" },
      { id: 5, userId: 'localuser', createdAt: new Date(), title: "Data Structures", description: "I can help with linked lists and trees.", type: "teach" },
      { id: 6, userId: 'localuser', createdAt: new Date(), title: "Web Design Principles", description: "Looking for tips on responsive design.", type: "learn" },
    ];
    setSkills(exampleSkills);
    setTimeout(() => setContentVisible(true), 100);
  }, []);

  // --- FUNCTIONS ---
  // This runs when the user submits the search form.
  const handleSearch = (e) => {
    e.preventDefault();
    const results = skills.filter(skill =>
      skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setView('results'); // Switch to the results page view
  };

  // This runs when the user clicks the 'Back' button on the results page.
  const handleBackToHome = () => {
    setSearchQuery(''); // Clear the search bar
    setView('home'); // Switch back to the home page view
  };

  // --- STATS CALCULATION ---
  const teachSkillsCount = skills.filter(skill => skill.type === 'teach').length;
  const learnSkillsCount = skills.filter(skill => skill.type === 'learn').length;

  // --- PAGE RENDER FUNCTIONS ---
  // This function returns the JSX for the Home Page.
  const renderHomePage = () => (
    <>
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-200">Total Skills</h4>
          <p className="text-4xl font-bold text-blue-400 mt-2">{skills.length}</p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-200">To Teach</h4>
          <p className="text-4xl font-bold text-green-400 mt-2">{teachSkillsCount}</p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-200">To Learn</h4>
          <p className="text-4xl font-bold text-purple-400 mt-2">{learnSkillsCount}</p>
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-purple-200 mb-4 text-center">
          What skills do you want to learn?
        </h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for skills and press Enter..."
            className="mt-1 block w-full rounded-md border-gray-600 bg-slate-700 text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-4 text-center text-lg transition-all duration-300 ease-in-out focus:ring-4 focus:ring-opacity-50"
          />
        </form>
      </div>
    </>
  );

  // This function returns the JSX for the Search Results Page.
  const renderResultsPage = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-purple-300">Search Results</h2>
        <button
          onClick={handleBackToHome}
          className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          &larr; Back to Home
        </button>
      </div>
      <div className="flex flex-wrap justify-center -m-4">
        {searchResults.length > 0 ? (
          searchResults.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))
        ) : (
          <div className="text-center py-20 w-full animate-fadeIn">
            <p className="text-lg text-gray-500">No matching skills found. Try a different search.</p>
          </div>
        )}
      </div>
    </>
  );

  // --- MAIN RETURN ---
  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 md:p-8 text-gray-200">
      <div className={`max-w-7xl mx-auto transition-opacity duration-700 ${contentVisible ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Header Section (always visible) */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-300 mb-2">
            Skill Share
          </h1>
          <p className="text-lg md:text-xl text-purple-100">
            Learn and teach new skills with your peers!
          </p>
        </header>
        
        {/* Conditionally render either the home page or the results page */}
        {view === 'home' ? renderHomePage() : renderResultsPage()}
        
      </div>
    </div>
  );
};

export default App;