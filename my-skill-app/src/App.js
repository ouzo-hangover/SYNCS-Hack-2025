import React, { useState, useEffect } from "react";
import SkillCard from "./components/SkillCard";
import SkillsMap from "./components/SkillsMap";
import UserMenu from "./components/UserMenu";
import AccountSettings from "./components/AccountSettings";

// Mock geocoding function to simulate backend processing
const geocodeCity = async (city) => {
  console.log(`Geocoding ${city}...`);
  // In a real application, you would use a geocoding service.
  // For this example, we'll use a mock lookup with a few Australian cities.
  const cityLocations = {
    "brisbane": { lat: -27.4705, lng: 153.0260 },
    "sydney": { lat: -33.8688, lng: 151.2093 },
    "melbourne": { lat: -37.8136, lng: 144.9631 },
    "perth": { lat: -31.9505, lng: 115.8605 },
    "adelaide": { lat: -34.9285, lng: 138.6007 },
    "hobart": { lat: -42.8821, lng: 147.3272 },
    "darwin": { lat: -12.4634, lng: 130.8456 },
  };

  const cityKey = city.toLowerCase();
  if (cityLocations[cityKey]) {
    return cityLocations[cityKey];
  }

  // Fallback for unknown cities
  console.warn(`Could not find coordinates for ${city}. Using default.`);
  return { lat: -27.48, lng: 153.01 }; // Default to Brisbane
};

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
    // Check for a logged-in user in session storage to persist login state
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/data.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let skillIdCounter = 1000; // Start from a higher number to avoid collision with any potential local data
        const loadedSkills = data.users.flatMap(user => {
          // Skills are what the user can teach
          const teachingSkills = (user.skills || []).map(skill => ({
            id: skillIdCounter++,
            userId: user.id,
            createdAt: new Date(),
            title: skill.name,
            description: `An offer to teach ${skill.name} by ${user.name}.`,
            type: 'teach',
            location: { lat: user.location.lat, lng: user.location.long } // Map long to lng
          }));

          // Interests are what the user wants to learn.
          const learningInterests = (user.interests || []).map(interest => ({
            id: skillIdCounter++,
            userId: user.id,
            createdAt: new Date(),
            title: interest.name,
            description: `${user.name} is looking to learn about ${interest.name}.`,
            type: 'learn',
            // Learning skills don't need a location on the map.
          }));

          return [...teachingSkills, ...learningInterests];
        });

        setSkills(loadedSkills);
      } catch (error) {
        console.error("Could not load user data from data.json:", error);
      }
    };

    fetchData();

    setTimeout(() => setContentVisible(true), 100);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === "") {
      // If search is empty, show all skills
      setSearchResults(skills);
    } else {
      // Otherwise, filter as before
      const results = skills.filter(
        (skill) =>
          skill.title.toLowerCase().includes(trimmedQuery) ||
          skill.description.toLowerCase().includes(trimmedQuery)
      );
      setSearchResults(results);
    }
    setView("results");
  };

  const handleBackToHome = () => {
    setSearchQuery("");
    setView("home");
  };

  const handleRegister = async (newUser) => {
    console.log("Registering new user:", newUser);

    const standardizedData = { ...newUser };
    // Standardize skills and interests from string to array of objects
    if (typeof standardizedData.skills === 'string') {
        standardizedData.skills = standardizedData.skills.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name }));
    }
    if (typeof standardizedData.interests === 'string') {
        standardizedData.interests = standardizedData.interests.split(',').map(i => i.trim()).filter(Boolean).map(name => ({ name }));
    }

    let userToSave;
    if (standardizedData.city) {
      const location = await geocodeCity(standardizedData.city);
      userToSave = { ...standardizedData, location };
    } else {
      userToSave = standardizedData;
    }
    setCurrentUser(userToSave);
    sessionStorage.setItem('currentUser', JSON.stringify(userToSave));
    setView("home");
    alert("Account created successfully!");
  };

  const handleUpdateProfile = async (updatedUser) => {
    console.log("Updating profile:", updatedUser);

    const standardizedData = { ...updatedUser };
    // Standardize skills and interests from string to array of objects
    if (typeof standardizedData.skills === 'string') {
        standardizedData.skills = standardizedData.skills.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name }));
    }
    if (typeof standardizedData.interests === 'string') {
        standardizedData.interests = standardizedData.interests.split(',').map(i => i.trim()).filter(Boolean).map(name => ({ name }));
    }

    let userToSave;
    if (standardizedData.city && standardizedData.city !== currentUser?.city) {
      const location = await geocodeCity(standardizedData.city);
      userToSave = { ...currentUser, ...standardizedData, location };
    } else {
      userToSave = { ...currentUser, ...standardizedData };
    }
    setCurrentUser(userToSave);
    sessionStorage.setItem('currentUser', JSON.stringify(userToSave));
    setView("home");
    alert("Profile updated successfully!");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('currentUser');
    setView("home");
  };
  
  const skillsToTeach = skills.filter((skill) => skill.type === "teach");
  const skillsToLearn = skills.filter((skill) => skill.type === "learn");

  // --- PAGE RENDER FUNCTIONS ---
  
  // --- MODIFIED: renderHomePage with new logo color and restored sections ---
  const renderHomePage = () => (
    <>
      <div className="flex flex-col items-center justify-center min-h-[90vh] text-center">
        {/* Header Section */}
        <header className="mb-10">
          <h1 className="text-8xl font-bold text-white mb-2">
            h<span className="text-purple-400">a</span>i
          </h1>
          <p className="text-xl text-gray-400">
            Learn something with someone
          </p>
        </header>
    
        {/* Search Bar Section */}
        <div className="w-full max-w-xl mx-auto my-8">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What skills do you want to learn?"
              className="w-full rounded-full border-2 border-slate-700 bg-slate-800 text-white shadow-lg focus:border-purple-500 focus:ring-purple-500 p-4 pl-6 text-lg transition-all duration-300 ease-in-out"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold py-2.5 px-8 rounded-full shadow-md hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-300 ease-in-out"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Map Section */}
      <div className="bg-slate-800 rounded-xl shadow-lg p-4 md:p-8 mt-24 mb-12">
        <h2 className="text-3xl font-bold text-purple-200 mb-4 text-center">
          Who's Teaching Near You?
        </h2>
        <SkillsMap skillsToTeach={skillsToTeach} />
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-200">
            Total Skills
          </h4>
          <p className="text-4xl font-bold text-blue-400 mt-2">
            {skills.length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-200">To Teach</h4>
          <p className="text-4xl font-bold text-green-400 mt-2">
            {skillsToTeach.length}
          </p>
        </div>
        <div className="bg-slate-800 rounded-xl shadow-md p-6 text-center">
          <h4 className="text-lg font-semibold text-purple-200">To Learn</h4>
          <p className="text-4xl font-bold text-purple-400 mt-2">
            {skillsToLearn.length}
          </p>
        </div>
      </div>
    </>
  );

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
    <div className="min-h-screen bg-[#0D0B1F] p-4 md:p-8 text-gray-200">
      <div
        className={`max-w-7xl mx-auto transition-opacity duration-700 ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative">
          <div className="absolute top-0 right-0 z-10">
            <UserMenu
              currentUser={currentUser}
              isLoggedIn={!!currentUser}
              onNavigateToAccount={() => setView("account")}
              onLogout={handleLogout}
            />
          </div>
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