import React from 'react';
import { Card, BarChart, GoogleColors } from './components'; // Assuming shared components

const CustomerSentiment = ({ data }) => {
  if (!data) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading customer sentiment...</p>
      </div>
    );
  }

  const { customerSentiment = [], industryHealth = {} } = data;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Customer Sentiment Section */}
      <div className="lg:col-span-2">
        <Card>
          <h2 className="font-semibold mb-4">Customer Sentiment</h2>
          <div className="flex items-center justify-between mb-4">
            <a href="#" className="text-blue-500 text-sm hover:underline">View More</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customerSentiment.length > 0 ? (
              customerSentiment.map((item, index) => (
                <Card key={index}>
                  <h3 className="font-semibold text-sm mb-2">{item.title}</h3>
                  <div className="text-xs grid grid-cols-2 gap-2 text-gray-600">
                    <p><span className="font-semibold">Purchase Date:</span> {item.purchaseDate}</p>
                    <p><span className="font-semibold">Purchase Amount:</span> {item.purchaseAmount}</p>
                    <p><span className="font-semibold">CSAT score:</span> {item.csatScore}</p>
                    <p><span className="font-semibold">Intent to renew:</span> {item.intentToRenew}</p>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-sm text-gray-500">No customer sentiment data available.</p>
            )}
          </div>
        </Card>
      </div>

      {/* Industry Health Section */}
      <div>
        <Card>
          <h2 className="font-semibold mb-2">Industry Health</h2>
          <p className="text-sm text-gray-500 mb-4">
            The overall attractiveness and health of the company's industry
          </p>
          <div className="flex items-center justify-between mb-2">
            <p className="text-lg font-semibold">
              {industryHealth.value ?? 'N/A'}{' '}
              <span className="text-xs font-normal text-gray-500">/ 1000</span>
            </p>
            <p className="text-sm text-gray-500">1y</p>
          </div>
          <div className="h-48">
            <BarChart
              data={industryHealth.data || []}
              color={GoogleColors.blue}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSentiment;
