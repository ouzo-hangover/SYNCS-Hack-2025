// src/App.js
import React, { useState, useEffect } from "react";
import SkillCard from "./components/SkillCard";
import SkillsMap from "./components/SkillsMap";
import UserMenu from "./components/UserMenu";
import AccountSettings from "./components/AccountSettings";

const COLORS = {
  purple: "#8e2de2",
  blue: "#4a00e0",
  accent: "#2575fc",
  navy: "#0d0d1a",
  ink: "#1a1a2e",
  lightViolet: "#d2d2fe",
};

// --- Mock geocoding function ---
const geocodeCity = async (city) => {
  const cityLocations = {
    brisbane: { lat: -27.4705, lng: 153.026 },
    sydney: { lat: -33.8688, lng: 151.2093 },
    melbourne: { lat: -37.8136, lng: 144.9631 },
    perth: { lat: -31.9505, lng: 115.8605 },
    adelaide: { lat: -34.9285, lng: 138.6007 },
    hobart: { lat: -42.8821, lng: 147.3272 },
    darwin: { lat: -12.4634, lng: 130.8456 },
  };
  const cityKey = city.toLowerCase();
  return cityLocations[cityKey] || { lat: -27.48, lng: 153.01 };
};

const App = () => {
  const [skills, setSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState("home");
  const [searchResults, setSearchResults] = useState([]);
  const [contentVisible, setContentVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // --- Load data on mount ---
  useEffect(() => {
    const handleScroll = () => {
      // We only want the scroll-to-shrink effect on the homepage
      if (view === "home") {
        setIsScrolled(window.scrollY > 10);
      }
    };

    window.addEventListener("scroll", handleScroll);
    // When the view changes, set scroll state appropriately
    if (view !== "home") {
      setIsScrolled(true);
    } else {
      handleScroll(); // check scroll position on view change to home
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [view]);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("currentUser");
    if (storedUser) setCurrentUser(JSON.parse(storedUser));

    const fetchData = async () => {
      try {
        const response = await fetch("/data.json");
        const data = await response.json();
        let id = 1000;
        const loaded = data.users.flatMap((user) => {
          const teaching = (user.skills || []).map((s) => ({
            id: id++,
            userId: user.id,
            createdAt: new Date(),
            title: s.name,
            description: `An offer to teach ${s.name} by ${user.name}.`,
            type: "teach",
            location: { lat: user.location.lat, lng: user.location.long },
          }));
          const learning = (user.interests || []).map((i) => ({
            id: id++,
            userId: user.id,
            createdAt: new Date(),
            title: i.name,
            description: `${user.name} is looking to learn about ${i.name}.`,
            type: "learn",
          }));
          return [...teaching, ...learning];
        });
        setSkills(loaded);
      } catch (e) {
        console.error("Error loading data.json", e);
      }
    };

    fetchData();
    setTimeout(() => setContentVisible(true), 100);
  }, []);

  // --- Handlers ---
  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim().toLowerCase();
    const results =
      q === ""
        ? skills
        : skills.filter(
            (s) =>
              s.title.toLowerCase().includes(q) ||
              s.description.toLowerCase().includes(q)
          );
    setSearchResults(results);
    setView("results");
  };

  const handleBackToHome = () => {
    setSearchQuery("");
    setView("home");
  };

  const handleRegister = async (newUser) => {
    let userToSave = { ...newUser };
    if (typeof userToSave.skills === "string") {
      userToSave.skills = userToSave.skills
        .split(",")
        .map((s) => ({ name: s.trim() }));
    }
    if (typeof userToSave.interests === "string") {
      userToSave.interests = userToSave.interests
        .split(",")
        .map((i) => ({ name: i.trim() }));
    }
    if (userToSave.city) {
      userToSave.location = await geocodeCity(userToSave.city);
    }
    setCurrentUser(userToSave);
    sessionStorage.setItem("currentUser", JSON.stringify(userToSave));
    setView("home");
  };

  const handleUpdateProfile = async (updatedUser) => {
    let userToSave = { ...currentUser, ...updatedUser };
    if (typeof userToSave.skills === "string") {
      userToSave.skills = userToSave.skills
        .split(",")
        .map((s) => ({ name: s.trim() }));
    }
    if (typeof userToSave.interests === "string") {
      userToSave.interests = userToSave.interests
        .split(",")
        .map((i) => ({ name: i.trim() }));
    }
    if (userToSave.city && userToSave.city !== currentUser?.city) {
      userToSave.location = await geocodeCity(userToSave.city);
    }
    setCurrentUser(userToSave);
    sessionStorage.setItem("currentUser", JSON.stringify(userToSave));
    setView("home");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("currentUser");
    setView("home");
  };

  const skillsToTeach = skills.filter((s) => s.type === "teach");
  const skillsToLearn = skills.filter((s) => s.type === "learn");

  // --- Renders ---
  const renderHomePage = () => (
    <>
      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-8">
          <blockquote
            className="mt-4 text-2xl italic"
            style={{ color: COLORS.accent }}
          >
            Learn something with someone
          </blockquote>
          <button
            onClick={() => setView("why")}
            className="mt-4 border border-current/15 opacity-90 font-semibold text-lg py-2 px-6 rounded-lg
                       hover:bg-white/5 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-[#2575fc]
                       transform transition duration-200 hover:scale-105 active:scale-95"
          >
            Why?
          </button>
        </div>

        {/* Search */}
        <div className="rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-3xl bg-[#1a1a2e] border border-current/10">
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What skills do you want to learn?"
              className="w-full rounded-xl px-5 py-4 bg-[#0f1222] text-lg placeholder-current/50
                         border border-current/10 focus:border-[#2575fc] focus:ring-2 focus:ring-[#2575fc]
                         outline-none transition text-center"
            />
            <button
              type="submit"
              className="mx-auto px-8 py-3 rounded-xl font-semibold text-lg
                         bg-gradient-to-r from-[#8e2de2] to-[#4a00e0]
                         shadow-[0_10px_30px_rgba(74,0,224,0.35)]
                         hover:opacity-95 active:opacity-90
                         transform transition duration-200 hover:scale-105 active:scale-95"
            >
              Search
            </button>
          </form>
        </div>

        {/* Illustration row */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 place-items-center">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-indigo-900 via-fuchsia-900 to-sky-900 blur-lg opacity-70 group-hover:opacity-90 transition"></div>
            <img
              src="/assets/teach-guitar.webp"
              alt="Teach guitar"
              className="relative w-40 sm:w-48 rounded-2xl object-contain z-10
                         transform transition duration-200 hover:scale-105 active:scale-95"
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-900 via-purple-900 to-blue-900 blur-lg opacity-70 group-hover:opacity-90 transition"></div>
            <img
              src="/assets/surf-coach.webp"
              alt="Surf coaching"
              className="relative w-40 sm:w-48 rounded-2xl object-contain z-10
                         transform transition duration-200 hover:scale-105 active:scale-95"
            />
          </div>
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-900 via-blue-900 to-purple-900 blur-lg opacity-70 group-hover:opacity-90 transition"></div>
            <img
              src="/assets/walkingdog.webp"
              alt="Walking dog"
              className="relative w-40 sm:w-48 rounded-2xl object-contain z-10
                         transform transition duration-200 hover:scale-105 active:scale-95"
            />
          </div>
        </div>

        {/* Map */}
        <div className="w-full max-w-3xl mx-auto rounded-xl shadow-lg p-4 md:p-8 mt-24 mb-12 bg-[#1a1a2e] border border-current/10">
          <h2 className="text-3xl font-bold opacity-90 mb-4 text-center">
            Who’s Teaching Near You?
          </h2>
          <SkillsMap skillsToTeach={skillsToTeach} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="rounded-xl p-6 text-center bg-[#1a1a2e] border border-current/10
                          transform transition duration-200 hover:scale-105 active:scale-95">
            <h4 className="text-xl font-semibold opacity-80">Total Skills</h4>
            <p className="text-4xl font-bold" style={{ color: COLORS.accent }}>
              {skills.length}
            </p>
          </div>
          <div className="rounded-xl p-6 text-center bg-[#1a1a2e] border border-current/10
                          transform transition duration-200 hover:scale-105 active:scale-95">
            <h4 className="text-xl font-semibold opacity-80">To Teach</h4>
            <p className="text-4xl font-bold text-green-400">
              {skillsToTeach.length}
            </p>
          </div>
          <div className="rounded-xl p-6 text-center bg-[#1a1a2e] border border-current/10
                          transform transition duration-200 hover:scale-105 active:scale-95">
            <h4 className="text-xl font-semibold opacity-80">To Learn</h4>
            <p className="text-4xl font-bold text-purple-300">
              {skillsToLearn.length}
            </p>
          </div>
        </div>
      </div>
    </>
  );

  const renderResultsPage = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold opacity-90">Search Results</h2>
        <button
          onClick={handleBackToHome}
          className="px-4 py-2 rounded-lg font-semibold text-lg
                     bg-gradient-to-r from-[#8e2de2] to-[#4a00e0]
                     hover:opacity-95
                     transform transition duration-200 hover:scale-105 active:scale-95"
        >
          &larr; Back to Home
        </button>
      </div>
      <div className="flex flex-wrap justify-center -m-4">
        {searchResults.length > 0 ? (
          searchResults.map((s) => <SkillCard key={s.id} skill={s} />)
        ) : (
          <div className="text-center py-20 w-full">
            <p className="text-xl opacity-50">
              No matching skills found. Try a different search.
            </p>
          </div>
        )}
      </div>
    </>
  );

  const renderWhyPage = () => (
    <div className="rounded-xl shadow-lg p-8 md:p-12 bg-[#1a1a2e] border border-current/10 text-left max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold opacity-90 mb-4">
        The world is changing... so we need to move with it.
      </h2>
      <p className="text-xl opacity-70 mb-8 leading-relaxed">
        Cities are no longer just places to live; they are the epicentres of
        culture, innovation, and human connection.
      </p>
      <h3 className="text-2xl font-semibold opacity-85 mb-3">
        Our Mission: Powering the Future of Work
      </h3>
      <p className="text-xl opacity-70 mb-8 leading-relaxed">
        In a future where remote work and the gig economy are the norm,
        continuous learning is key.
      </p>
      <p className="text-xl opacity-80 font-semibold leading-relaxed">
        By creating a peer-to-peer network for learning and teaching, we empower
        citizens to adapt, upskill, and thrive.
      </p>
      <div className="text-center mt-12">
        <button
          onClick={handleBackToHome}
          className="px-6 py-3 rounded-lg font-semibold text-lg
                     bg-gradient-to-r from-[#8e2de2] to-[#4a00e0]
                     hover:opacity-95
                     transform transition duration-200 hover:scale-105 active:scale-95"
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

  const isHeaderShrunk = view !== "home" || isScrolled;

  // --- Main return ---
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: COLORS.navy, color: COLORS.lightViolet }}
    >
      {/* Animated Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-30 transition-all duration-500 ease-in-out ${
          isHeaderShrunk
            ? "bg-[#0d0d1a]/80 backdrop-blur-sm shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative">
          <div
            className={`flex items-center transition-all duration-500 ease-in-out ${
              isHeaderShrunk ? "h-24 justify-start" : "h-56 justify-center"
            }`}
          >
            <div
              className={`flex items-center gap-3 transition-all duration-500 ease-in-out ${
                !isHeaderShrunk && "flex-col"
              }`}
            >
              <img
                src="/assets/logo-hai.png"
                alt="hai logo"
                className="drop-shadow-[0_0_24px_rgba(142,45,226,0.35)] transition-all duration-500 ease-in-out w-20 md:w-24"
              />
              <h1
                className={`font-serif tracking-tight transition-all duration-500 ease-in-out text-5xl md:text-6xl ${
                  !isHeaderShrunk ? "mt-2" : ""
                }`}
              >
                hai
              </h1>
            </div>
          </div>
          <div className="absolute top-0 right-4 md:right-8 h-full flex items-center z-10">
            <UserMenu
              currentUser={currentUser}
              isLoggedIn={!!currentUser}
              onNavigateToAccount={() => setView("account")}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>

      <div
        className={`max-w-7xl mx-auto transition-opacity duration-700 px-4 md:px-8 ${
          contentVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <main className={`transition-all duration-500 ease-in-out ${isHeaderShrunk ? 'pt-28' : 'pt-56'}`}>
          {view === "home" && renderHomePage()}
          {view === "results" && renderResultsPage()}
          {view === "why" && renderWhyPage()}
          {view === "account" && renderAccountPage()}
        </main>
      </div>
    </div>
  );
};

export default App;
