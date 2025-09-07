import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, GoogleColors } from './components/components';
import Deals from './components/Deals';
import News from './components/News';
import CustomerSentiment from './components/CustomerSentiment';
import AboutSection from './components/AboutSection';
import People from './components/People';
import Highlights from './components/Highlights';
import Outlook from './components/Outlook';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar'; // Make sure this file contains the corrected Navbar code

function StartupPage() {
  const { startupId } = useParams(); // Get the startup ID from the route
  const [data, setData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('Overview'); // Navbar state

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  useEffect(() => {
    const fetchStartupData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5005/api/data/${startupId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Could not fetch startup data:", error);
      }
    };

    fetchStartupData();
  }, [startupId]);

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 font-sans text-gray-800">
        <div className="text-xl font-semibold">Loading startup data...</div>
      </div>
    );
  }

  // Define all the tabs for the Navbar
  const tabs = ['Overview', 'Outlook', 'Network', 'Deals', 'Markets', 'Research', 'Customer Sentiment', 'People', 'News'];

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
              <Outlook
                progressData={data.progressData.map(item => ({ ...item, color: GoogleColors[item.label.toLowerCase()] }))}
                mosaicScoreData={data.mosaicScoreData}
                maProbabilityData={data.maProbabilityData}
              />
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
        return <People
          data={data}
          mockHeadcountData={data.mockHeadcountData}
          managementStrengthData={data.managementStrengthData}
        />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen font-sans text-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Navbar with corrected props */}
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            tabs={tabs} // Pass the full list of tabs here
          />

          <h1 className="text-2xl font-bold mb-4">Startup: {startupId}</h1>

          {/* Render content based on active tab */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default StartupPage;