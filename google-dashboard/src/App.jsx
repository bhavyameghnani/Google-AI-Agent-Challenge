import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';

// You'll need to install react-icons: npm install react-icons
import { BiLoaderAlt, BiErrorCircle } from 'react-icons/bi';
import { HiOutlineLightBulb, HiChartBar, HiDocumentReport } from 'react-icons/hi'; // Added new icons

function App() {
  const [startupIds, setStartupIds] = useState([]);
  const [selectedStartupId, setSelectedStartupId] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchStartupIds = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('http://127.0.0.1:5005/api/ids');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const ids = await response.json();
        setStartupIds(ids);
      } catch (err) {
        console.error("Could not fetch startup IDs:", err);
        setError("Failed to load startup IDs. Please check the API server.");
      } finally {
        setLoading(false);
      }
    };
    fetchStartupIds();
  }, []);

  const handleSelection = (id) => {
    setSelectedStartupId(id);
    navigate(`/startup/${id}`); // Navigate to the StartupPage
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-800 transition-all duration-300">
      <div className="flex">
        {/* Sidebar with dynamic width */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content Area - Now full width relative to its parent flex container */}
        {/* Removed 'ml-64'/'ml-16' to allow main content to take remaining space */}
        <div className="flex-1 p-8 transition-all duration-300">
          {/* Hero Section */}
          <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl text-white p-12 mb-10 overflow-hidden">
            <div className="relative z-10 text-center">
              <h1 className="text-6xl font-extrabold tracking-tight mb-4 animate-fadeInUp">
                Genesis AI Evaluator ✨
              </h1>
              <p className="text-xl max-w-2xl mx-auto opacity-90 leading-relaxed animate-fadeIn delay-300">
                Unlock the potential of innovation. Dive into comprehensive evaluations and data-driven insights for top AI startups.
              </p>
            </div>
            {/* Background elements for visual flair */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full transform -translate-x-1/3 translate-y-1/3"></div>
          </div>

          {/* Startup Selection Cards (Choose + Add New) */}
<div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-10">
  {/* Choose a Startup Card */}
  <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200 transform transition-all hover:scale-105 duration-300">
    <div className="text-center mb-6">
      <HiOutlineLightBulb className="text-6xl text-purple-500 mx-auto mb-2 animate-bounce-slow" />
      <h2 className="text-3xl font-bold text-gray-900">Choose a Startup</h2>
      <p className="text-gray-500 mt-2">
        Select an ID to view detailed analytics and performance metrics.
      </p>
    </div>

    {loading && (
      <div className="flex items-center justify-center p-4 text-gray-500 animate-pulse">
        <BiLoaderAlt className="animate-spin text-3xl mr-3" />
        <span className="text-lg">Loading startups...</span>
      </div>
    )}

    {error && (
      <div className="flex items-center justify-center p-4 text-red-500 bg-red-50 rounded-lg border border-red-200">
        <BiErrorCircle className="text-2xl mr-3" />
        <span className="text-sm">{error}</span>
      </div>
    )}

    {!loading && !error && (
      <div className="relative">
        <select
          className="block w-full px-5 py-3 text-lg text-gray-700 bg-gray-50 border border-gray-300 rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
          value={selectedStartupId}
          onChange={e => handleSelection(e.target.value)}
        >
          <option value="" disabled>-- Select a Startup ID --</option>
          {startupIds.map(id => (
            <option key={id} value={id}>
              Startup ID: {id}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
          <svg
            className="fill-current h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
    )}

    {!loading && !error && (
      <p className="text-center text-sm text-gray-400 mt-4">
        Powered by advanced AI models.
      </p>
    )}
  </div>

  {/* Add a New Startup Card */}
  <div
    className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md border border-dashed border-gray-300 transform transition-all hover:scale-105 duration-300 cursor-pointer hover:bg-yellow-50"
    onClick={() => navigate('/add-startup')} // <-- You can change this route
  >
    <div className="text-center mb-6">
      <HiOutlineLightBulb className="text-6xl text-yellow-500 mx-auto mb-2 animate-pulse" />
      <h2 className="text-3xl font-bold text-gray-900">Add a New Startup</h2>
      <p className="text-gray-500 mt-2">
        Create and evaluate a brand new startup profile instantly.
      </p>
    </div>
    <div className="flex justify-center">
      <button
        className="px-6 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-full shadow hover:bg-yellow-500 transition-colors duration-200"
      >
        + Add Startup
      </button>
    </div>
    <p className="text-center text-sm text-gray-400 mt-4">
        Powered by advanced AI models.
      </p>
  </div>
</div>


          {/* New Section: About Genesis AI Evaluator */}
          <div className="bg-white rounded-2xl shadow-xl p-10 mt-10 border border-gray-200">
            <h2 className="text-4xl font-extrabold text-gray-900 mb-6 text-center">
              About Genesis: Your AI Startup Compass
            </h2>
            <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto text-center leading-relaxed">
              Genesis is an advanced platform designed to provide in-depth analysis and evaluation of AI startups. 
              Leveraging sophisticated algorithms and real-time data, we empower investors, analysts, and enthusiasts 
              to make informed decisions.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {/* Feature Card 1 */}
              <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <HiChartBar className="text-5xl text-blue-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Data-Driven Insights</h3>
                <p className="text-gray-600">
                  Access comprehensive metrics on funding rounds, growth trajectories, market positioning, and more.
                </p>
              </div>
              {/* Feature Card 2 */}
              <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <HiOutlineLightBulb className="text-5xl text-purple-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Predictive Analytics</h3>
                <p className="text-gray-600">
                  Utilize AI-powered predictions to forecast potential success and identify emerging trends in the AI landscape.
                </p>
              </div>
              {/* Feature Card 3 */}
              <div className="flex flex-col items-center text-center bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <HiDocumentReport className="text-5xl text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Reports</h3>
                <p className="text-gray-600">
                  Generate in-depth reports for any selected startup, covering technology stack, team strength, and competitive analysis.
                </p>
              </div>
            </div>

            <div className="text-center mt-12 pt-8 border-t border-gray-100">
              <p className="text-md text-gray-500">
                Explore the future of AI with Genesis. Your strategic advantage starts here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;