import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Sparkline, BarChart, GoogleColors } from './components/components';
import Deals from './components/Deals';
import News from './components/News';
import CustomerSentiment from './components/CustomerSentiment';
import AboutSection from './components/AboutSection';
import People from './components/People';
import Highlights from './components/Highlights';
import Outlook from './components/Outlook';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Use a custom hook to manage the dashboard state
const useDashboardState = () => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [data, setData] = useState(null); 
  
  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5005/api/data');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Could not fetch data:", error);
      }
    };

    fetchData();
  }, []);

  return { activeTab, setActiveTab, data, isSidebarOpen, toggleSidebar };
};

function App() {
  const { activeTab, setActiveTab, data, isSidebarOpen, toggleSidebar } = useDashboardState();

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-sans text-gray-800">
        <div className="text-xl font-semibold">Loading dashboard data...</div>
      </div>
    );
  }
  
  const progressData = data.progressData.map(item => ({
    ...item,
    color: GoogleColors[item.label.toLowerCase()] // Dynamically assign colors
  }));

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              <AboutSection data={data} /> 
              <Deals data={data} />
            </div>
            {/* Right Column */}
            <div className="lg:col-span-1 space-y-6">
              <Highlights data={data} mockHeadcountData={data.mockHeadcountData} />
              <Outlook progressData={progressData} mosaicScoreData={data.mosaicScoreData} maProbabilityData={data.maProbabilityData} />
            </div>
          </div>
        );
      case 'Deals':
        return <Deals data={data} />;
      case 'Customer Sentiment':
        return <CustomerSentiment data={data} />;
      case 'News':
        return <News data={data} />;
      case 'People':
        return <People data={data} mockHeadcountData={data.mockHeadcountData} managementStrengthData={data.managementStrengthData} />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      <style>{`
        .sidebar {
          background-color: ${GoogleColors.gray};
          color: ${GoogleColors.darkGray};
          box-shadow: 2px 0 5px rgba(0,0,0,0.1);
        }
        .main-content {
          background-color: white;
        }
        .news-table th, .news-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
        }
        .news-table th {
          text-align: left;
          font-weight: 600;
          color: ${GoogleColors.darkGray};
        }
      `}</style>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
          {renderTabContent()}
        </div>
      </div>
      <script src="https://cdn.tailwindcss.com"></script>
    </div>
  );
}

export default App;
