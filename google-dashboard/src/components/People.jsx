import React from 'react';
import { Card, Sparkline, BarChart, GoogleColors } from './components';

const People = ({ data, mockHeadcountData, managementStrengthData }) => {
  const headcountPercentage = data.headcount && data.headcountPreviousPeriod
    ? ((data.headcount / data.headcountPreviousPeriod) * 100).toFixed(0)
    : "100"; // Fallback to "100" if data is missing

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h2 className="font-semibold">Headcount</h2>
          <div className="mt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-lg font-semibold">
                  {data.headcount}
                  <span className="text-xs text-gray-500">({headcountPercentage}%)</span>
                </p>
                <p className="text-sm text-gray-600">Headcount (6-mo)</p>
              </div>
            </div>
            <div className="relative h-24">
              <Sparkline points={mockHeadcountData} color={GoogleColors.green} />
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Key People</h2>
          <div className="mt-4 space-y-4">
            {data.keyPeople && data.keyPeople.map((person, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                  {person.initials}
                </div>
                <div>
                  <p className="font-semibold">{person.name}</p>
                  <p className="text-sm text-gray-600">{person.title}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <h2 className="font-semibold">Hiring Insights</h2>
          <p className="text-sm text-gray-500">Only on CB Insights</p>
          <div className="mt-4">
            <a href="#" className="text-blue-500 text-sm hover:underline mt-4 inline-block">View More</a>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Management Strength</h2>
          <p className="text-sm text-gray-500">Analyzes leadership's experience, network, and education</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold">
                {data.managementStrengthData[1].value} <span className="text-xs font-normal text-gray-500">/ 1000</span>
              </p>
              <p className="text-sm text-gray-500">1y</p>
            </div>
            <div className="h-48">
              <BarChart data={managementStrengthData} color={GoogleColors.blue} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default People;