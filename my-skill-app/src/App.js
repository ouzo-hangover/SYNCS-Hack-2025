import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth, signInWithCustomToken, signInAnonymously } from 'firebase/auth';

// A utility function to convert a Firestore Timestamp to a formatted date string.
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = timestamp.toDate();
  return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
};

const SkillCard = ({ skill }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 m-4 w-full md:w-80 flex flex-col justify-between">
    <div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{skill.title}</h3>
      <p className="text-sm font-semibold text-gray-600 mb-1">
        {skill.type === 'teach' ? 'I can teach...' : 'I want to learn...'}
      </p>
      <p className="text-gray-700 text-sm mb-4">
        {skill.description}
      </p>
    </div>
    <div className="text-right text-xs text-gray-500 mt-auto">
      <span className="font-medium text-gray-900">Posted by:</span> {skill.userId.substring(0, 8)}...
      <p>
        <span className="font-medium text-gray-900">Posted on:</span> {formatTimestamp(skill.createdAt)}
      </p>
    </div>
  </div>
);

const App = () => {
  const [skills, setSkills] = useState([]);
  const [newSkillTitle, setNewSkillTitle] = useState('');
  const [newSkillDesc, setNewSkillDesc] = useState('');
  const [newSkillType, setNewSkillType] = useState('teach');
  const [db, setDb] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize Firebase and set up authentication
  useEffect(() => {
    try {
      // Replace with your actual Firebase configuration.
      const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
      };
      
      const app = initializeApp(firebaseConfig);
      const firestoreDb = getFirestore(app);
      const auth = getAuth(app);
      
      setDb(firestoreDb);

      const handleAuth = async () => {
        try {
          // This project uses anonymous auth, so a custom token is not needed.
          await signInAnonymously(auth);
          setUserId(auth.currentUser.uid);
        } catch (error) {
          console.error("Firebase auth error:", error);
          setUserId(crypto.randomUUID());
        } finally {
          setLoading(false);
        }
      };

      handleAuth();

      return () => {
        // Any cleanup if needed
      };
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      setLoading(false);
    }
  }, []);

  // Fetch data from Firestore in real-time
  useEffect(() => {
    if (db && userId) {
      // Use your actual project ID here
      const appId = 'your-hackathon-app-id';
      const skillsCollectionPath = `/artifacts/${appId}/public/data/skills`;
      const q = collection(db, skillsCollectionPath);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const skillsData = [];
        querySnapshot.forEach((doc) => {
          skillsData.push({ id: doc.id, ...doc.data() });
        });
        skillsData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
        setSkills(skillsData);
      }, (error) => {
        console.error("Error getting real-time updates:", error);
      });

      return () => unsubscribe();
    }
  }, [db, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSkillTitle.trim() || !newSkillDesc.trim() || !db || !userId) return;

    try {
      const appId = 'your-hackathon-app-id';
      const skillsCollectionPath = `/artifacts/${appId}/public/data/skills`;
      await addDoc(collection(db, skillsCollectionPath), {
        title: newSkillTitle,
        description: newSkillDesc,
        type: newSkillType,
        userId: userId,
        createdAt: new Date(),
      });
      setNewSkillTitle('');
      setNewSkillDesc('');
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };
  
  const totalSkills = skills.length;
  const teachSkillsCount = skills.filter(skill => skill.type === 'teach').length;
  const learnSkillsCount = skills.filter(skill => skill.type === 'learn').length;

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2">
            Skill Share
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Learn and teach new skills with your peers!
          </p>
        </header>

        {/* Stats Section */}
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-4 w-full md:w-1/3 text-center">
            <h4 className="text-lg font-semibold text-gray-800">Total Skills Posted</h4>
            <p className="text-3xl font-bold text-blue-600">{totalSkills}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 w-full md:w-1/3 text-center">
            <h4 className="text-lg font-semibold text-gray-800">Skills to Teach</h4>
            <p className="text-3xl font-bold text-green-600">{teachSkillsCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4 w-full md:w-1/3 text-center">
            <h4 className="text-lg font-semibold text-gray-800">Skills to Learn</h4>
            <p className="text-3xl font-bold text-purple-600">{learnSkillsCount}</p>
          </div>
        </div>

        {/* Skill Submission Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Add a Skill</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Skill Title</label>
              <input
                type="text"
                id="title"
                value={newSkillTitle}
                onChange={(e) => setNewSkillTitle(e.target.value)}
                placeholder="e.g., Python Basics"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                id="description"
                rows="3"
                value={newSkillDesc}
                onChange={(e) => setNewSkillDesc(e.target.value)}
                placeholder="Briefly describe the skill you are offering or looking for."
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              ></textarea>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Type</label>
              <select
                id="type"
                value={newSkillType}
                onChange={(e) => setNewSkillType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
              >
                <option value="teach">I can teach...</option>
                <option value="learn">I want to learn...</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-300 ease-in-out"
            >
              Add Skill
            </button>
          </form>
        </div>

        {/* Loading and User ID section */}
        <div className="text-center text-gray-500 mb-6">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <p>Your User ID: <span className="font-mono text-gray-700">{userId}</span></p>
          )}
          <p className="text-sm">Share this ID with others to collaborate!</p>
        </div>

        {/* Skills List */}
        <div className="flex flex-wrap justify-center">
          {skills.length > 0 ? (
            skills.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-lg text-gray-500">No skills posted yet. Be the first to add one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
