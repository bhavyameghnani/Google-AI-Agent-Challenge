import React from 'react';

const CompanyCard = ({ company, onClick }) => {
  const info = company.data?.company_info;

  return (
    <div
      onClick={() => onClick?.(company)}
      className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex items-center space-x-4 mb-3">
        {info?.logo_url ? (
          <img
            src={info.logo_url}
            alt={info.company_name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
            {info?.company_name?.charAt(0)}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-lg">{info?.company_name}</h3>
          <p className="text-sm text-gray-500">{info?.industry_sector}</p>
        </div>
      </div>

      <p className="text-sm text-gray-700 line-clamp-3">
        {info?.company_description}
      </p>
    </div>
  );
};

export default CompanyCard;