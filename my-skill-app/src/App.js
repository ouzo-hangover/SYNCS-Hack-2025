import React, { useState, useEffect } from "react";
import SkillCard from "./components/SkillCard";
import SkillsMap from "./components/SkillsMap";
import UserMenu from "./components/UserMenu";
import AccountSettings from "./components/AccountSettings";

const App = () => {
  // --- STATE MANAGEMENT ---
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("home");
  const [searchResults, setSearchResults] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // --- INITIAL DATA & FUNCTIONS ---
  useEffect(() => {
    const exampleSkills = [
      {
        id: 1,
        userId: "localuser",
        createdAt: new Date(),
        title: "Python for Beginners",
        description: "A basic introduction to Python programming.",
        type: "teach",
        location: { lat: -27.47, lng: 153.023 },
      },
      {
        id: 2,
        userId: "localuser",
        createdAt: new Date(),
        title: "React Component Basics",
        description: "Learn how to build your first React component.",
        type: "teach",
        location: { lat: -27.5, lng: 153.03 },
      },
      {
        id: 3,
        userId: "localuser",
        createdAt: new Date(),
        title: "Digital Marketing",
        description: "Looking to learn about SEO and content strategy.",
        type: "learn",
      },
      {
        id: 4,
        userId: "localuser",
        createdAt: new Date(),
        title: "Spanish Conversation",
        description: "Need a partner to practice speaking Spanish.",
        type: "learn",
      },
      {
        id: 5,
        userId: "localuser",
        createdAt: new Date(),
        title: "Data Structures",
        description: "I can help with linked lists and trees.",
        type: "teach",
        location: { lat: -27.46, lng: 153.015 },
      },
      {
        id: 6,
        userId: "localuser",
        createdAt: new Date(),
        title: "Web Design Principles",
        description: "Looking for tips on responsive design.",
        type: "learn",
      },
    ];
    setSkills(exampleSkills);

    const mockUser = {
      id: 101,
      name: "Alex Rivera",
      email: "alex.r@example.com",
      interests: "Hiking, JavaScript, Coffee",
      skills: ["React", "Python"],
      location: { lat: -27.48, lng: 153.01 },
    };
    setCurrentUser(mockUser);

    setTimeout(() => setContentVisible(true), 100);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const results = skills.filter(
      (skill) =>
        skill.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
    setView("results");
  };

  const handleBackToHome = () => {
    setSearchQuery("");
    setView("home");
  };

  const handleRegister = (newUser) => {
    console.log("Registering new user:", newUser);
    setCurrentUser(newUser);
    setView("home");
    alert("Account created successfully!");
  };

  const handleUpdateProfile = (updatedUser) => {
    console.log("Updating profile:", updatedUser);
    setCurrentUser(updatedUser);
    setView("home");
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView("home");
  };

  const skillsToTeach = skills.filter((skill) => skill.type === "teach");
  const skillsToLearn = skills.filter((skill) => skill.type === "learn");

  // --- PAGE RENDER FUNCTIONS ---
  // --- FIX: Restored content for renderHomePage ---
  const renderHomePage = () => (
    <>
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center min-h-[85vh]">
        <header className="mb-10">
          <h1 className="text-6xl md:text-7xl font-extrabold text-purple-300 mb-2 tracking-wider">
            hai
          </h1>
          <blockquote className="mt-4 text-xl italic text-gray-400">
            "Learn something with someone"
          </blockquote>
          <button 
            onClick={() => setView('why')} 
            className="mt-4 bg-transparent border border-purple-400 text-purple-300 font-bold py-2 px-6 rounded-lg hover:bg-purple-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-300 ease-in-out animate-fadeInUp-600"
          >
            Why?
          </button>
        </header>

        {/* Search Bar */}
        <div className="bg-slate-800 rounded-xl shadow-lg p-8 w-full max-w-3xl animate-fadeInUp">
          <h2 className="text-3xl font-bold text-purple-200 mb-4">
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
      </div>

      {/* Map Section */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-4 md:p-8 mt-24 mb-12 animate-fadeInUp-200">
        <h2 className="text-3xl font-bold text-purple-200 mb-4 text-center">
          Who's Teaching Near You?
        </h2>
        <SkillsMap skillsToTeach={skillsToTeach} />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center animate-fadeInUp-400">
          <h4 className="text-lg font-semibold text-purple-200">
            Total Skills
          </h4>
          <p className="text-4xl font-bold text-blue-400 mt-2">
            {skills.length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center animate-fadeInUp-600">
          <h4 className="text-lg font-semibold text-purple-200">To Teach</h4>
          <p className="text-4xl font-bold text-green-400 mt-2">
            {skillsToTeach.length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center animate-fadeInUp-600">
          <h4 className="text-lg font-semibold text-purple-200">To Learn</h4>
          <p className="text-4xl font-bold text-purple-400 mt-2">
            {skillsToLearn.length}
          </p>
        </div>
      </div>
    </>
  );

  // --- FIX: Restored content for renderResultsPage ---
  const renderResultsPage = () => {
    const resultsToTeachOnMap = searchResults.filter(
      (skill) => skill.type === "teach" && skill.location
    );
    return (
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
        {resultsToTeachOnMap.length > 0 && (
          <div className="bg-slate-800 rounded-xl shadow-lg p-4 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-purple-200 mb-4 text-center">
              Results on the Map
            </h2>
            <SkillsMap skillsToTeach={resultsToTeachOnMap} />
          </div>
        )}
        <div className="flex flex-wrap justify-center -m-4">
          {searchResults.length > 0 ? (
            searchResults.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))
          ) : (
            <div className="text-center py-20 w-full animate-fadeIn">
              <p className="text-lg text-gray-500">
                No matching skills found. Try a different search.
              </p>
            </div>
          )}
        </div>
      </>
    );
  };

  // --- FIX: Restored content for renderWhyPage ---
  const renderWhyPage = () => (
    <div className="bg-slate-800 rounded-xl shadow-lg p-8 md:p-12 animate-fadeInUp text-left max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-purple-300 mb-4">
        The world is changing... so we need to move with it.
      </h2>
      <p className="text-lg text-gray-300 mb-8 leading-relaxed">
        Cities are no longer just places to live; they are the epicentres of
        culture, innovation, and human connection. But as they grow, they face
        urgent challenges in sustainability and the evolving nature of work.
      </p>
      <h3 className="text-2xl font-semibold text-purple-200 mb-3">
        Our Mission: Powering the Future of Work
      </h3>
      <p className="text-gray-400 mb-8 leading-relaxed">
        In a future where remote work and the gig economy are the norm,
        continuous learning is key. The most valuable resource in our cities is
        shared human potential. Skill Share is our answer to the question of how
        we support a diverse, independent workforce.
      </p>
      <p className="text-gray-300 font-semibold text-lg leading-relaxed">
        By creating a peer-to-peer network for learning and teaching, we empower
        citizens to adapt, upskill, and thrive. We're not just building an app;
        we're building a more resilient, interconnected, and knowledgeable
        community—one skill at a time.
      </p>
      <div className="text-center mt-12">
        <button
          onClick={handleBackToHome}
          className="bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
        >
          &larr; Back to Home
        </button>
      </div>
    </div>
  );

  const renderAccountPage = () => (
    <AccountSettings
      currentUser={currentUser}
      onRegister={handleRegister}
      onUpdate={handleUpdateProfile}
      onBack={handleBackToHome}
    />
  );

  // --- MAIN RETURN ---
  return (
    <div className="min-h-screen bg-slate-900 font-sans p-4 md:p-8 text-gray-200">
      <div
        className={`max-w-7xl mx-auto transition-opacity duration-700 ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative">
          <div className="absolute top-0 right-0 z-10">
            <UserMenu
              isLoggedIn={!!currentUser}
              onNavigateToAccount={() => setView("account")}
              onLogout={handleLogout}
            />
          </div>
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-extrabold text-purple-300 mb-2">
              Skill Share
            </h1>
            <p className="text-lg md:text-xl text-purple-100">
              Learn and teach new skills with your peers!
            </p>
            {view === "home" && (
              <button
                onClick={() => setView("why")}
                className="mt-4 bg-transparent border border-purple-400 text-purple-300 font-bold py-2 px-6 rounded-lg hover:bg-purple-400 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition duration-300 ease-in-out animate-fadeInUp-600"
              >
                Why?
              </button>
            )}
          </header>
        </div>

        {view === "home" && renderHomePage()}
        {view === "results" && renderResultsPage()}
        {view === "why" && renderWhyPage()}
        {view === "account" && renderAccountPage()}
      </div>
    </div>
  );
};

export default App;
