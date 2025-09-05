import React from 'react';
import { GoogleColors } from './components'; // Assuming GoogleColors is in the same directory as other components

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const navItems = ['Home', 'Chat', 'Markets', 'Competitors', 'Company Tracker', 'Research', 'More'];

  return (
    <div className={`sidebar h-screen flex flex-col py-6 px-4 transition-all duration-300 ${isSidebarOpen ? 'w-64 items-start' : 'w-16 items-center'}`}>
      <div className="flex items-center gap-2 mb-8 w-full justify-between">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 flex-shrink-0" viewBox="0 0 48 48">
            <g>
              <path fill="#4285F4" d="M24 16.5c-3.71 0-6.73 3.02-6.73 6.73h3.36c0-1.85 1.48-3.37 3.37-3.37s3.37 1.52 3.37 3.37c0 1.93-1.63 3.37-3.37 3.37-1.12 0-2.03-.64-2.58-1.54l-2.48 1.44c.94 1.76 2.82 2.89 5.06 2.89 3.71 0 6.73-3.02 6.73-6.73s-3.02-6.73-6.73-6.73z"></path>
              <path fill="#34A853" d="M37.89 27.68c-.62-.71-1.39-1.29-2.26-1.74-.87-.45-1.81-.8-2.8-.97-.99-.17-2.02-.2-3.04-.08-1.02.12-2.01.42-2.91.89-1.34.7-2.34 1.83-2.91 3.23-.29-.11-.59-.22-.9-.33-1.02-.34-2.12-.51-3.23-.52-1.11-.01-2.2.14-3.21.46-1.16.36-2.19.98-3.06 1.82-.87.84-1.57 1.81-2.09 2.89-.52 1.08-.85 2.21-1.01 3.37-.16 1.16-.18 2.34-.07 3.51.11 1.17.4 2.29.87 3.32.47 1.03 1.14 1.98 1.98 2.84.84.86 1.79 1.57 2.84 2.13.62.33 1.25.6 1.89.81.64.21 1.29.35 1.93.43-.63.15-1.27.27-1.92.35-1.28.16-2.58.12-3.87-.1-.99-.17-1.96-.46-2.88-.87-1.35-.61-2.43-1.57-3.26-2.84-.83-1.27-1.34-2.69-1.52-4.14-.18-1.45-.16-2.91-.01-4.35.15-1.44.47-2.83.97-4.14.5-1.31 1.19-2.53 2.08-3.6.89-1.07 1.94-2.01 3.12-2.77 1.18-.76 2.47-1.33 3.82-1.68 1.35-.35 2.74-.5 4.13-.45 1.4.05 2.78.33 4.1.84s2.61 1.24 3.63 2.14c1.19 1.06 2.11 2.31 2.72 3.67.61 1.36.91 2.83.89 4.31-.02 1.48-.3 2.92-.85 4.29-.55 1.37-1.37 2.62-2.46 3.75-1.09 1.13-2.31 2.05-3.65 2.75-1.34.7-2.76 1.18-4.22 1.42-1.46.24-2.94.27-4.41.09-1.47-.18-2.89-.57-4.21-1.16-1.32-.59-2.55-1.42-3.63-2.46-1.08-1.04-1.99-2.22-2.71-3.52-.72-1.3-.92-2.72-.6-4.16.32-1.44.97-2.8 1.94-4.04.97-1.24 2.22-2.28 3.63-3.05 1.41-.77 2.95-1.29 4.54-1.51 1.6-.22 3.2-.14 4.75.25.99.25 1.94.61 2.83 1.08.89.47 1.71 1.04 2.44 1.69-.17.15-.35.3-.53.45-1.03.88-2.23 1.54-3.51 1.97-1.28.43-2.63.6-4.01.49-1.38-.11-2.72-.51-3.95-1.18-1.23-.67-2.31-1.58-3.19-2.65-.88-1.07-1.56-2.32-2.03-3.65-.47-1.33-.74-2.74-.79-4.16-.05-1.42.06-2.84.34-4.25.28-1.41.74-2.77 1.39-4.06.65-1.29 1.5-2.5 2.51-3.6.49-.53.99-1.05 1.51-1.56.24-.24.47-.48.7-.72.06-.06.12-.12.18-.18 1.49-1.55 3.19-2.71 5.06-3.48 1.87-.77 3.86-1.13 5.86-1.06 2.0.07 3.96.53 5.83 1.37s3.52 2.03 4.88 3.51c.36.38.7.77 1.03 1.17.61.74 1.14 1.53 1.6 2.36.46.83.82 1.72 1.09 2.64.27.92.44 1.87.5 2.84.06.97-.02 1.95-.24 2.91z"></path>
            </g>
          </svg>
          {isSidebarOpen && <span className="text-lg font-bold">Google</span>}
        </div>
        <button onClick={toggleSidebar} className="p-1 rounded-full hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ transform: isSidebarOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <nav className="flex flex-col gap-4 w-full">
        {navItems.map(item => (
          <a key={item} href="#" className={`flex items-center gap-3 p-2 rounded-lg hover:bg-gray-200 transition-all duration-300 ${isSidebarOpen ? '' : 'justify-center'}`}>
            {/* Placeholder icon for demonstration */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            {isSidebarOpen && <span className="text-sm">{item}</span>}
          </a>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;