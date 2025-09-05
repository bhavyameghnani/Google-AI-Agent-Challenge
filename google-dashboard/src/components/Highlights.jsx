import React from 'react';
import { Card, Sparkline, GoogleColors } from './components';

const Highlights = ({ data, mockHeadcountData }) => {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900">Highlights</h2>
      <div className="grid grid-cols-2 gap-4 mt-2">
        <div>
          <h3 className="font-semibold text-sm">${data.raised}M</h3>
          <p className="text-xs text-gray-600">Total Raised</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">{data.headcount} <span className="text-green-600">(+0%)</span></h3>
          <p className="text-xs text-gray-600">Headcount (6-mo)</p>
          <div className="relative h-12 w-full mt-1">
            <Sparkline points={mockHeadcountData} color={GoogleColors.green} />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Highlights;