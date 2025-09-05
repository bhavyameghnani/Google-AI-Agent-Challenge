import React from 'react';
import { Card, Progress, BarChart, GoogleColors } from './components';

const Outlook = ({ progressData, mosaicScoreData, maProbabilityData }) => {
  return (
    <Card>
      <h2 className="font-semibold text-gray-900">Outlook</h2>
      <p className="text-sm text-gray-500 mb-4">Proprietary data to analyze the performance and trajectory of the company. <a href="#" className="text-blue-500 hover:underline">Read our methodology</a></p>
      <div className="space-y-4">
        <h3 className="font-semibold text-sm">Commercial Maturity</h3>
        {progressData.map(item => (
          <Progress key={item.label} value={item.value} color={item.color} label={item.label} />
        ))}
      </div>
      <div className="mt-6 flex flex-col gap-4">
        <div>
          <h3 className="font-semibold text-sm">Mosaic Score Probability</h3>
          <p className="text-xs text-gray-500">Based on company's fundamentals, market traction, and business health.</p>
          <div className="h-32 mt-2">
            <BarChart data={mosaicScoreData} color={GoogleColors.blue} />
          </div>
          <p className="text-xs text-green-600 text-center mt-1">In the top 1% of Mosaic health scores</p>
        </div>
        <div>
          <h3 className="font-semibold text-sm">M&A Probability</h3>
          <div className="space-y-2 mt-2">
            {maProbabilityData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-sm font-semibold flex-1">{item.value}%</span>
                <span className="text-sm text-gray-500 flex-1">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Outlook;