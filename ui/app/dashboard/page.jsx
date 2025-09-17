"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Building2, Loader2 } from "lucide-react";

// Import tab components
import OverviewTab from "./tabs/OverviewTab";
import FinancialsTab from "./tabs/FinancialsTab";
import PeopleTab from "./tabs/PeopleTab";
import MarketTab from "./tabs/MarketTab";
import NewsTab from "./tabs/NewsTab";
import InsightsTab from "./tabs/InsightsTab";

// Move SearchSection outside to prevent re-creation on every render
const SearchSection = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  loadingExtract,
}) => (
  <div className="mb-8">
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-2">
        Company Intelligence Platform
      </h1>
      <p className="text-gray-600 text-center mb-6">
        Get comprehensive insights on any company
      </p>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Enter company name (e.g., OpenAI, Google)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Button onClick={handleSearch} disabled={loadingExtract}>
          {loadingExtract ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Analyze"
          )}
        </Button>
      </div>
    </div>
  </div>
);

const CompanyDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [companyData, setCompanyData] = useState(null);
  const [competitorData, setCompetitorData] = useState(null);
  const [loadingExtract, setLoadingExtract] = useState(false);
  const [loadingCompetitors, setLoadingCompetitors] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoadingExtract(true);
    setCompanyData(null);
    setCompetitorData(null);

    try {
      // Call /extract endpoint
      const extractResponse = await fetch("http://127.0.0.1:5005/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company_name: searchQuery }),
      });
      const extractData = await extractResponse.json();
      setCompanyData(extractData);
      setLoadingExtract(false);

      // Start competitor analysis
      setLoadingCompetitors(true);
      const competitorResponse = await fetch(
        "http://127.0.0.1:5005/competitor-analysis",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ company_name: searchQuery }),
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

  const CompanyHeader = ({ company }) => (
    <div className="mb-6">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
          {company.data.company_info.logo_url ? (
            <img
              src={company.data.company_info.logo_url}
              alt={`${company.data.company_info.company_name} logo`}
              className="w-12 h-12 rounded"
            />
          ) : (
            <Building2 className="h-8 w-8 text-gray-400" />
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">
            {company.data.company_info.company_name}
          </h2>
          <p className="text-gray-600 mb-2">
            {company.data.company_info.company_description}
          </p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">
              {company.data.company_info.industry_sector}
            </Badge>
            <Badge variant="secondary">
              {company.data.company_info.company_stage.value}
            </Badge>
            <Badge variant="secondary">
              {company.data.company_info.headquarters_location}
            </Badge>
            {company.data.company_info.year_founded && (
              <Badge variant="secondary">
                Founded {company.data.company_info.year_founded}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const LoadingState = ({ message }) => (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-blue-600" />
      <p className="text-gray-600">{message}</p>
      <p className="text-sm text-gray-400 mt-1">
        This may take a few minutes...
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SearchSection
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          handleSearch={handleSearch}
          loadingExtract={loadingExtract}
        />

        {loadingExtract && (
          <LoadingState message="Extracting company data..." />
        )}

        {companyData && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <CompanyHeader company={companyData} />

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="insights" disabled={!competitorData}>
                  Insights
                  {loadingCompetitors && (
                    <Loader2 className="h-3 w-3 animate-spin ml-1" />
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <OverviewTab company={companyData} />
              </TabsContent>

              <TabsContent value="financials" className="mt-6">
                <FinancialsTab company={companyData} />
              </TabsContent>

              <TabsContent value="people" className="mt-6">
                <PeopleTab company={companyData} />
              </TabsContent>

              <TabsContent value="market" className="mt-6">
                <MarketTab company={companyData} />
              </TabsContent>

              <TabsContent value="news" className="mt-6">
                <NewsTab company={companyData} />
              </TabsContent>

              <TabsContent value="insights" className="mt-6">
                {loadingCompetitors ? (
                  <LoadingState message="Analyzing competitors..." />
                ) : competitorData ? (
                  <InsightsTab
                    company={companyData}
                    competitors={competitorData}
                  />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      Competitor analysis will appear here
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
