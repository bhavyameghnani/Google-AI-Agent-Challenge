"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Building2,
  Loader2,
  Info,
  Calendar,
  MapPin,
  TrendingUp,
  Database,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";

// Import tab components
import OverviewTab from "./tabs/OverviewTab";
import FinancialsTab from "./tabs/FinancialsTab";
import PeopleTab from "./tabs/PeopleTab";
import MarketTab from "./tabs/MarketTab";
import NewsTab from "./tabs/NewsTab";
import InsightsTab from "./tabs/InsightsTab";
import AIChatTab from "./tabs/AIChatTab";

// Dedicated Search Section Component
const SearchSection = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loadingExtract,
}) => (
  <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-200 pt-28">
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg sm:rounded-xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200/50 p-1.5 sm:p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 sm:h-5 sm:w-5" />
              <Input
                placeholder="Enter company name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="pl-9 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-6 text-sm sm:text-base md:text-lg border-0 focus:ring-0 focus:outline-none bg-transparent"
              />
            </div>
            <Button
              onClick={() => handleSearch()}
              disabled={loadingExtract}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-4 sm:py-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
            >
              {loadingExtract ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                "Analyze"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const InfoBanner = () => (
  <div className="mb-6 sm:mb-8 max-w-4xl mx-auto">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
      <div className="flex items-start gap-2 sm:gap-3">
        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-blue-900 mb-1">
            AI-Powered Analysis
          </h3>
          <p className="text-xs sm:text-sm text-blue-700">
            New companies may take 2-3 minutes to analyze as our AI agents
            research comprehensive data from multiple sources. Existing
            companies load instantly from our database.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const CompaniesList = ({
  loadingCompanies,
  companiesList,
  handleCompanyCardClick,
  formatDate,
}) => (
  <div className="mb-6 sm:mb-8">
    <div className="flex items-center gap-2 mb-3 sm:mb-4">
      <Database className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Available Companies ({companiesList.length})
      </h2>
    </div>

    {loadingCompanies ? (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin text-blue-600" />
        <span className="ml-2 text-sm sm:text-base text-gray-600">
          Loading companies...
        </span>
      </div>
    ) : companiesList.length === 0 ? (
      <div className="text-center py-8 text-sm sm:text-base text-gray-500 px-4">
        No companies available yet. Start by analyzing your first company above.
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {companiesList.map((company, index) => (
          <Card
            key={index}
            className="hover:shadow-md transition-all duration-200 cursor-pointer hover:border-blue-300 group overflow-hidden flex flex-col"
            onClick={() => handleCompanyCardClick(company.company_name)}
          >
            <CardHeader className="pb-2 sm:pb-3 flex-shrink-0">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <CardTitle className="text-base sm:text-lg group-hover:text-blue-600 transition-colors truncate">
                      {company.company_name}
                    </CardTitle>
                    {company.industry_sector && (
                      <Badge variant="secondary" className="mt-1 text-xs max-w-full truncate block">
                        {company.industry_sector}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      company.is_fresh ? "bg-green-500" : "bg-orange-500"
                    }`}
                  />
                  <span className="text-xs text-gray-500 hidden sm:inline whitespace-nowrap">
                    {company.is_fresh ? "Fresh" : "Stale"}
                  </span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0 flex-1 min-w-0 overflow-hidden">
              <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-gray-600">
                {company.headquarters_location && (
                  <div className="flex items-center gap-2 min-w-0">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate min-w-0">
                      {company.headquarters_location}
                    </span>
                  </div>
                )}

                {company.year_founded && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate">Founded {company.year_founded}</span>
                  </div>
                )}

                {company.latest_valuation && (
                  <div className="flex items-center gap-2 min-w-0">
                    <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="truncate font-medium text-green-600 min-w-0">
                      {company.latest_valuation}
                    </span>
                  </div>
                )}

                {company.last_updated && (
                  <div className="text-xs text-gray-500 pt-1 border-t">
                    <div className="truncate">
                      Updated {formatDate(company.last_updated)}
                      <span className="ml-2 whitespace-nowrap">
                        ({company.cache_age_days}d ago)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )}
  </div>
);

const CompanyHeader = ({ company }) => (
  <div className="mb-4 sm:mb-6">
    <div className="flex items-start gap-3 sm:gap-4">
      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        {company.data.company_info.logo_url ? (
          <img
            src={company.data.company_info.logo_url}
            alt={`${company.data.company_info.company_name} logo`}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded"
          />
        ) : (
          <Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 truncate">
          {company.data.company_info.company_name}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-2 line-clamp-2 sm:line-clamp-none">
          {company.data.company_info.company_description}
        </p>

        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <Badge variant="secondary" className="text-xs">
            {company.data.company_info.industry_sector}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {company.data.company_info.company_stage.value}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {company.data.company_info.headquarters_location}
          </Badge>
          {company.data.company_info.year_founded && (
            <Badge variant="secondary" className="text-xs">
              Founded {company.data.company_info.year_founded}
            </Badge>
          )}
        </div>
      </div>
    </div>
  </div>
);

const LoadingState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin mb-3 sm:mb-4 text-blue-600" />
    <p className="text-sm sm:text-base text-gray-600 text-center">{message}</p>
    <p className="text-xs sm:text-sm text-gray-400 mt-1 text-center">
      This may take a few minutes...
    </p>
  </div>
);

const CompanyDashboard = () => {
  const searchParams = useSearchParams();
  const companyFromURL = searchParams.get("company");

  const [searchQuery, setSearchQuery] = useState(companyFromURL || "");
  const [companyData, setCompanyData] = useState(null);
  const [competitorData, setCompetitorData] = useState(null);
  const [companiesList, setCompaniesList] = useState([]);
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);
  const [loadingCompanies, setLoadingCompanies] = useState(false);

  // Fetch companies list on mount
  useEffect(() => {
    fetchCompaniesList();
  }, []);

  const fetchCompaniesList = async () => {
    setLoadingCompanies(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/companies`
      );
      const data = await response.json();
      setCompaniesList(data.companies || []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoadingCompanies(false);
    }
  };

  const handleSearch = async (companyName = searchQuery) => {
    if (!companyName.trim()) return;

    setLoadingExtract(true);
    setCompanyData(null);
    setCompetitorData(null);

    try {
      const extractResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/extract`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_name: companyName }),
        }
      );
      const extractData = await extractResponse.json();
      setCompanyData(extractData);
      setLoadingExtract(false);

      setLoadingCompetitors(true);
      const competitorResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/competitor-analysis`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_name: companyName }),
        }
      );
      const competitorData = await competitorResponse.json();
      setCompetitorData(competitorData);
      setLoadingCompetitors(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoadingExtract(false);
      setLoadingCompetitors(false);
    }
  };

  const handleCompanyCardClick = (companyName) => {
    setSearchQuery(companyName);
    handleSearch(companyName);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar forceSolid={true} />

      {/* Search Section below navbar */}
      {!companyData && (
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          loadingExtract={loadingExtract}
        />
      )}

      <div className={`container mx-auto px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8 ${companyData ? 'pt-28' : 'pt-4 sm:pt-6 md:pt-8'}`}>
        {(loadingCompanies || !companyData) && <InfoBanner />}

        {/* Show companies list when not analyzing */}
        {!loadingExtract && !companyData && (
          <CompaniesList
            loadingCompanies={loadingCompanies}
            companiesList={companiesList}
            handleCompanyCardClick={handleCompanyCardClick}
            formatDate={formatDate}
          />
        )}

        {loadingExtract && (
          <LoadingState message="Extracting company data..." />
        )}

        {companyData && (
          <div className="bg-white rounded-lg shadow-sm border p-3 sm:p-4 md:p-6">
            <CompanyHeader company={companyData} />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-1 sm:gap-2 p-1 overflow-x-auto">
                <TabsTrigger
                  value="overview"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="insights"
                  disabled={!competitorData}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">Competitive Analysis</span>
                  <span className="sm:hidden">Analysis</span>
                  <span className="ml-1">🔥</span>
                  {loadingCompetitors && (
                    <Loader2 className="h-3 w-3 animate-spin ml-1 inline" />
                  )}
                </TabsTrigger>
                <TabsTrigger
                  value="financials"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  Financials
                </TabsTrigger>
                <TabsTrigger
                  value="people"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  People
                </TabsTrigger>
                <TabsTrigger
                  value="market"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  Market
                </TabsTrigger>
                <TabsTrigger
                  value="news"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  News
                </TabsTrigger>
                <TabsTrigger
                  value="ai-chat"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-2 whitespace-nowrap"
                >
                  <span className="hidden sm:inline">🤖 Talk to SenseAI</span>
                  <span className="sm:hidden">🤖 Chat</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-4 sm:mt-6">
                <OverviewTab company={companyData} />
              </TabsContent>

              <TabsContent value="financials" className="mt-4 sm:mt-6">
                <FinancialsTab company={companyData} />
              </TabsContent>

              <TabsContent value="people" className="mt-4 sm:mt-6">
                <PeopleTab company={companyData} />
              </TabsContent>

              <TabsContent value="market" className="mt-4 sm:mt-6">
                <MarketTab company={companyData} />
              </TabsContent>

              <TabsContent value="news" className="mt-4 sm:mt-6">
                <NewsTab company={companyData} />
              </TabsContent>

              <TabsContent value="insights" className="mt-4 sm:mt-6">
                {loadingCompetitors ? (
                  <LoadingState message="Analyzing competitors..." />
                ) : competitorData ? (
                  <InsightsTab
                    company={companyData}
                    competitors={competitorData}
                  />
                ) : (
                  <div className="text-center py-6 sm:py-8 px-4">
                    <p className="text-sm sm:text-base text-gray-500">
                      Competitor analysis will appear here
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ai-chat" className="mt-4 sm:mt-6">
                <AIChatTab companyData={companyData} />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
