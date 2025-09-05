import React from 'react';
import { Card, BarChart, GoogleColors } from '../components/components'; // Assuming you create a components file for shared ones

const Deals = ({ data }) => {
  const growthMomentumData = [
    { label: 'Avg', value: 556 },
    { label: 'Sarvam AI', value: 944 },
  ];

  const financialStrengthData = [
    { label: 'Avg', value: 298 },
    { label: 'Sarvam AI', value: 837 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <h2 className="font-semibold text-gray-900">Deals</h2>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Total Equity Funding: Sarvam AI</p>
            <div className="h-48 flex items-end justify-center mt-4">
              <div className="w-24 bg-blue-500 rounded-lg shadow-md flex flex-col items-center justify-end h-full">
                <div className="text-white text-lg font-bold mb-2 p-2">${data.raised}M</div>
                <div className="bg-blue-600 w-full rounded-b-lg text-center text-sm text-white py-1">2023</div>
              </div>
            </div>
          </div>
          <a href="#" className="text-blue-500 text-sm hover:underline mt-4 inline-block">View More</a>
        </Card>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <h2 className="font-semibold">Growth momentum</h2>
          <p className="text-sm text-gray-500">How rapidly the company is growing compared to industry peers</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold">944 <span className="text-xs font-normal text-gray-500">/ 1000</span></p>
              <p className="text-sm text-gray-500">1y</p>
            </div>
            <div className="h-48">
              <BarChart data={growthMomentumData} color={GoogleColors.blue} />
            </div>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Financial strength</h2>
          <p className="text-sm text-gray-500">Financial stability and ability to sustain growth</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-semibold">837 <span className="text-xs font-normal text-gray-500">/ 1000</span></p>
              <p className="text-sm text-gray-500">1y</p>
            </div>
            <div className="h-48">
              <BarChart data={financialStrengthData} color={GoogleColors.blue} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Deals;