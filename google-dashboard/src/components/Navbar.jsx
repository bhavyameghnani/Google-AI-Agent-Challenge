import React from 'react';
import { Button, GoogleColors } from './components';

const Navbar = ({ activeTab, setActiveTab }) => {
  const tabs = ['Overview', 'Outlook', 'Network', 'Deals', 'Markets', 'Research', 'Customer Sentiment', 'People', 'News'];

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">Sarvam AI</h1>
        <div className="flex items-center gap-4">
          <Button className="bg-blue-500 text-white hover:bg-blue-600">Run Scouting Report Agent</Button>
          <Button className="bg-gray-200 text-gray-700 hover:bg-gray-300">Add to watchlist</Button>
        </div>
      </div>

      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab}
            className={`tab-button px-4 py-2 text-sm font-medium transition-all duration-300 ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tailwind CSS class for active tab is defined here as it depends on GoogleColors */}
      <style>{`
        .tab-button.active {
          border-bottom: 2px solid ${GoogleColors.blue};
          color: ${GoogleColors.blue};
          font-weight: 500;
        }
      `}</style>
    </>
  );
};

export default Navbar;