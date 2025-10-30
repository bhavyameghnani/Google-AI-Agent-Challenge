"use client";
import React, { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import { fetchCompanies } from "../api/companyApi";
import CompanyCard from "./CompanyCard";
import { Navbar } from "../../dashboard/CompanyDashboard";

const CompanyList = ({ onCompanyClick }) => {
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadCompanies = async () => {
      const data = await fetchCompanies();
      setCompanies(data);
      setFilteredCompanies(data);
      setLoading(false);
    };
    loadCompanies();
  }, []);

  useEffect(() => {
    const filtered = companies.filter((company) =>
      company.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [searchQuery, companies]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        Loading companies...
      </div>
    );

  if (filteredCompanies.length === 0)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500 text-lg">
        No companies found.
      </div>
    );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Fixed Navbar */}
      <div className="fixed top-0 left-0 w-full z-20 bg-white/70 backdrop-blur-md shadow-sm">
        <Navbar />
      </div>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Investment Portfolio
          </h1>
          <p className="text-gray-600">
            Review and analyze company data for informed investment decisions
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 rounded-xl bg-white hover:bg-gray-50 shadow-sm transition-all">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700 font-medium">Filters</span>
          </button>
        </div>

        {/* Company Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCompanies.map((company) => (
            <div
              key={company.id || company.company_name}
              onClick={() => onCompanyClick(company)}
              className="transition-transform hover:scale-[1.02]"
            >
              <CompanyCard company={company} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;
