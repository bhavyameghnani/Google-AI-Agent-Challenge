import React from 'react';
import { Card, GoogleColors, Sparkline } from './components';

const News = ({ data }) => {
  return (
    <div className="space-y-6">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Sarvam AI News mentions</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Date range</span>
            <select className="bg-gray-100 rounded-md px-2 py-1">
              <option>YTD</option>
              <option>1Y</option>
              <option>2Y</option>
              <option>5Y</option>
              <option>MAX</option>
            </select>
          </div>
        </div>
        {/* Sparkline chart for news mentions */}
        <div className="relative h-48 w-full mt-4">
          <Sparkline points={data.newsMentionsData} color={GoogleColors.blue} />
          <div className="absolute top-0 left-0 right-0 bottom-0 text-xs text-gray-500">
            <div className="absolute left-0 bottom-0">Jan</div>
            <div className="absolute right-0 bottom-0">Jul</div>
          </div>
        </div>
        <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
          <span>Number of News Mentions</span>
          <span>{data.totalNewsMentions}</span>
        </div>
      </Card>
      <Card>
        <table className="news-table w-full border-collapse">
          <thead>
            <tr>
              <th className="w-1/12">Date</th>
              <th className="w-7/12">Article</th>
              <th className="w-4/12">Mentions</th>
            </tr>
          </thead>
          <tbody>
            {data.newsMentions.map((item, index) => (
              <tr key={index}>
                <td className="align-top text-sm">{item.date}</td>
                <td className="align-top text-sm">{item.article}</td>
                <td className="align-top text-sm">{item.mentions.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default News;