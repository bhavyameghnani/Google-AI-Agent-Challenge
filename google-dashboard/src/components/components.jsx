import React from 'react';

export const GoogleColors = {
  blue: 'rgb(66, 133, 244)',
  red: 'rgb(219, 68, 55)',
  yellow: 'rgb(244, 180, 0)',
  green: 'rgb(15, 157, 88)',
  gray: 'rgb(241, 241, 241)',
  darkGray: 'rgb(95, 99, 104)',
};

export const Card = ({ children, className }) => (
  <div className={`rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg ${className}`}>
    {children}
  </div>
);

export const Button = ({ children, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200 ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const Progress = ({ value, color, label }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between text-sm text-gray-700">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <div className="w-full h-2 rounded-full bg-gray-200">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${value}%`, backgroundColor: color }}
      ></div>
    </div>
  </div>
);

export const Sparkline = ({ points, color }) => {
  if (points.length < 2) return null;

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min === 0 ? 1 : max - min;
  const normalizedPoints = points.map(p => (p - min) / range);
  const pathData = normalizedPoints.map((y, i) =>
    `${i * (100 / (points.length - 1))},${100 - y * 100}`
  ).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-12">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={pathData}
        className="transition-all duration-500"
      />
    </svg>
  );
};

export const BarChart = ({ data, color, height = 150 }) => {
  const maxVal = Math.max(...data.map(d => d.value));

  return (
    <div className="flex items-end h-full gap-2">
      {data.map((item, index) => (
        <div key={index} className="flex flex-col items-center flex-1">
          <div
            className={`w-full rounded-md transition-all duration-500`}
            style={{
              height: `${(item.value / maxVal) * 100}%`,
              backgroundColor: color,
            }}
          ></div>
          <span className="text-xs text-gray-500 mt-1">{item.label}</span>
        </div>
      ))}
    </div>
  );
};