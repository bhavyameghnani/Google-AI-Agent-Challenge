import React from 'react';
import { Card, Button } from './components'; 
import { GoogleColors } from './components';

const AboutSection = ({ data }) => {
  // Check if data is available before rendering
  if (!data || !data.about || !data.keyThemes) {
    return null; // Or a loading spinner/placeholder
  }

  const { about, relationships, keyThemes } = data;

  return (
    <>
      <Card>
        <h2 className="text-xl font-semibold mb-2">About</h2>
        <p className="text-sm text-gray-600">
          {about.description}
        </p>
        <div className="mt-4 text-sm grid grid-cols-2 gap-2">
          <p><span className="font-medium">Website:</span> <a href={about.website} className="text-blue-500 hover:underline">{about.website}</a></p>
          <p><span className="font-medium">Status:</span> {about.status}</p>
          <p><span className="font-medium">Founded Year:</span> {about.foundedYear}</p>
          <p><span className="font-medium">Business Model:</span> {about.businessModel}</p>
          <p className="col-span-2"><span className="font-medium">Headquarters:</span> {about.headquarters}</p>
        </div>
      </Card>

      <Card className="flex items-start gap-4 p-4 bg-yellow-50 border-yellow-300">
        <div className="flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-800">Scouting Report Agent:</h3>
          <p className="text-sm text-yellow-700">Creates a scouting report on Sarvam AI's business model, market position, opportunities, and threats.</p>
        </div>
        <Button className="bg-white text-yellow-800 border border-yellow-300 shadow-sm hover:bg-gray-100">Run Agent</Button>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold">Business Relationships</h3>
          <p className="text-sm text-gray-500 mb-4">Only on CB Insights</p>
          <div className="mt-4">
            <h4 className="text-3xl font-bold">{relationships}</h4>
            <p className="text-sm text-gray-600">Partners, customers, and vendors</p>
          </div>
          <a href="#" className="text-blue-500 text-sm hover:underline mt-4 inline-block">View More</a>
        </Card>
        <Card>
          <h3 className="font-semibold">Key themes</h3>
          <p className="text-sm text-gray-500 mb-4">Only on CB Insights</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {keyThemes.map(theme => (
              <span key={theme} className="bg-gray-200 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{theme}</span>
            ))}
          </div>
          <a href="#" className="text-blue-500 text-sm hover:underline mt-4 inline-block">View More</a>
        </Card>
      </div>
    </>
  );
};

export default AboutSection;
