"use client";

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Building2,
  Users,
  TrendingUp,
  Globe,
  Newspaper,
  BarChart3,
  Loader2,
  DollarSign,
  Calendar,
  PieChart,
  ExternalLink,
  User,
  Briefcase,
  UserPlus,
  Target,
  Award,
  MapPin,
  Link,
  Heart,
} from "lucide-react";

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

  const getScoreColor = (score) => {
    if (score >= 900) return "text-green-600 bg-green-100";
    if (score >= 700) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const SearchSection = () => (
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

  const OverviewTab = ({ company }) => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                Total Funding
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.financial_data.total_equity_funding?.value || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Valuation
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.financial_data.valuation?.value || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                Employees
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.company_info.employee_count?.value || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">
                Market Size
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.market_data.market_size?.value || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {company.data.extraction_summary}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const FinancialsTab = ({ company }) => {
    const financialData = company.data.financial_data;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-gray-600">
                  Total Funding
                </span>
                {financialData.total_equity_funding?.source_url && (
                  <ExternalLink
                    className="h-3 w-3 text-gray-400 cursor-pointer"
                    onClick={() =>
                      window.open(
                        financialData.total_equity_funding.source_url,
                        "_blank"
                      )
                    }
                  />
                )}
              </div>
              <p className="text-2xl font-bold mb-1">
                {financialData.total_equity_funding?.value || "N/A"}
              </p>
              {financialData.total_equity_funding?.source_name && (
                <p className="text-xs text-gray-500">
                  Source: {financialData.total_equity_funding.source_name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-600">
                  Latest Round
                </span>
                {financialData.latest_funding_round?.source_url && (
                  <ExternalLink
                    className="h-3 w-3 text-gray-400 cursor-pointer"
                    onClick={() =>
                      window.open(
                        financialData.latest_funding_round.source_url,
                        "_blank"
                      )
                    }
                  />
                )}
              </div>
              <p className="text-2xl font-bold mb-1">
                {financialData.latest_funding_round?.value || "N/A"}
              </p>
              {financialData.latest_funding_round?.source_name && (
                <p className="text-xs text-gray-500">
                  Source: {financialData.latest_funding_round.source_name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <PieChart className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-600">
                  Valuation
                </span>
                {financialData.valuation?.source_url && (
                  <ExternalLink
                    className="h-3 w-3 text-gray-400 cursor-pointer"
                    onClick={() =>
                      window.open(financialData.valuation.source_url, "_blank")
                    }
                  />
                )}
              </div>
              <p className="text-2xl font-bold mb-1">
                {financialData.valuation?.value || "N/A"}
              </p>
              {financialData.valuation?.source_name && (
                <p className="text-xs text-gray-500">
                  Source: {financialData.valuation.source_name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {financialData.revenue_growth_rate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Revenue Growth
                {financialData.revenue_growth_rate?.source_url && (
                  <ExternalLink
                    className="h-4 w-4 text-gray-400 cursor-pointer"
                    onClick={() =>
                      window.open(
                        financialData.revenue_growth_rate.source_url,
                        "_blank"
                      )
                    }
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">
                {financialData.revenue_growth_rate.value}
              </p>
              {financialData.revenue_growth_rate.source_name && (
                <p className="text-sm text-gray-500">
                  Source: {financialData.revenue_growth_rate.source_name}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Financial Strength Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {financialData.financial_strength}
            </p>
          </CardContent>
        </Card>

        {financialData.key_investors &&
          financialData.key_investors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Key Investors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {financialData.key_investors.map((investor, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-800">{investor}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Data Information
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-700">
              <div>
                <span className="font-medium">Last Updated:</span>{" "}
                {new Date(company.last_updated).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Source:</span> {company.source}
              </div>
              <div>
                <span className="font-medium">Cache Age:</span>{" "}
                {company.cache_age_days} days
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const PeopleTab = ({ company }) => {
    const peopleData = company.data.people_data;

    return (
      <div className="space-y-6">
        {peopleData.key_people && peopleData.key_people.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Key Leadership
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {peopleData.key_people.map((person, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-6 w-6 text-gray-500" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-lg">{person.name}</h4>
                        {person.source_url && (
                          <ExternalLink
                            className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                            onClick={() =>
                              window.open(person.source_url, "_blank")
                            }
                          />
                        )}
                      </div>

                      <p className="text-blue-600 font-medium mb-2">
                        {person.role}
                      </p>

                      <p className="text-gray-700 text-sm leading-relaxed">
                        {person.background}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {peopleData.employee_growth_rate && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Employee Growth Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold text-green-700 mb-2">
                  {peopleData.employee_growth_rate}
                </p>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-600" />
                Current Headcount
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-purple-700">
                {company.data.company_info.employee_count?.value || "N/A"}
              </p>
              {company.data.company_info.employee_count?.source_name && (
                <p className="text-xs text-gray-500 mt-1">
                  Source: {company.data.company_info.employee_count.source_name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {peopleData.hiring_trends && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Hiring Trends & Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {peopleData.hiring_trends}
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="bg-green-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800">Team Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {peopleData.key_people?.length || 0}
                </div>
                <div className="text-green-600">Key Leaders</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {company.data.company_info.employee_count?.value || "N/A"}
                </div>
                <div className="text-green-600">Total Employees</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-green-700">
                  {company.data.company_info.year_founded
                    ? new Date().getFullYear() -
                      company.data.company_info.year_founded
                    : "N/A"}
                </div>
                <div className="text-green-600">Years Operating</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const MarketTab = ({ company }) => {
    const marketData = company.data.market_data;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-blue-600" />
                Market Size
                {marketData.market_size?.source_url && (
                  <ExternalLink
                    className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      window.open(marketData.market_size.source_url, "_blank")
                    }
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">
                {marketData.market_size?.value || "N/A"}
              </p>
              {marketData.market_size?.source_name && (
                <p className="text-xs text-gray-500">
                  Source: {marketData.market_size.source_name}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Market Position
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {marketData.market_position}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Competitive Landscape
              {marketData.competitive_landscape?.source_url && (
                <ExternalLink
                  className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    window.open(
                      marketData.competitive_landscape.source_url,
                      "_blank"
                    )
                  }
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {marketData.competitive_landscape?.value ||
                marketData.competitive_landscape}
            </p>
            {marketData.competitive_landscape?.source_name && (
              <p className="text-xs text-gray-500 mt-2">
                Source: {marketData.competitive_landscape.source_name}
              </p>
            )}
          </CardContent>
        </Card>

        {marketData.competitive_advantages &&
          marketData.competitive_advantages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-orange-600" />
                  Competitive Advantages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {marketData.competitive_advantages.map((advantage, index) => (
                    <div
                      key={index}
                      className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400"
                    >
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">
                            {advantage.value || advantage}
                          </p>
                          {advantage.source_name && (
                            <div className="flex items-center gap-1 mt-1">
                              <p className="text-xs text-gray-500">
                                Source: {advantage.source_name}
                              </p>
                              {advantage.source_url && (
                                <ExternalLink
                                  className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-600"
                                  onClick={() =>
                                    window.open(advantage.source_url, "_blank")
                                  }
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Product-Market Fit Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {marketData.product_market_fit}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Market Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-blue-700">Industry:</span>
                <p className="text-blue-600">
                  {company.data.company_info.industry_sector}
                </p>
              </div>
              <div>
                <span className="font-semibold text-blue-700">
                  Business Model:
                </span>
                <p className="text-blue-600">
                  {company.data.company_info.business_model}
                </p>
              </div>
              <div>
                <span className="font-semibold text-blue-700">
                  Competitive Advantages:
                </span>
                <p className="text-blue-600">
                  {marketData.competitive_advantages?.length || 0} identified
                </p>
              </div>
              <div>
                <span className="font-semibold text-blue-700">
                  Market Position:
                </span>
                <p className="text-blue-600">
                  {marketData.market_position ? "Analyzed" : "Pending analysis"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const NewsTab = ({ company }) => {
    const reputationData = company.data.reputation_data;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Brand Sentiment Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {reputationData.brand_sentiment}
            </p>
          </CardContent>
        </Card>

        {reputationData.customer_satisfaction && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Customer Satisfaction
                {reputationData.customer_satisfaction?.source_url && (
                  <ExternalLink
                    className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      window.open(
                        reputationData.customer_satisfaction.source_url,
                        "_blank"
                      )
                    }
                  />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-green-700 mb-2">
                {reputationData.customer_satisfaction.value ||
                  reputationData.customer_satisfaction}
              </p>
              {reputationData.customer_satisfaction?.source_name && (
                <p className="text-xs text-gray-500">
                  Source: {reputationData.customer_satisfaction.source_name}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {reputationData.notable_news &&
          reputationData.notable_news.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Newspaper className="h-5 w-5" />
                  Recent News & Media Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reputationData.notable_news.map((newsItem, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <Newspaper className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                            {newsItem.headline}
                          </h4>

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <span className="font-medium">Source:</span>
                              <span>{newsItem.source_name}</span>
                            </div>

                            {newsItem.date && (
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>{newsItem.date}</span>
                              </div>
                            )}

                            <a
                              href={newsItem.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <ExternalLink className="h-3 w-3" />
                              <span>Read full article</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        {reputationData.partnerships &&
          reputationData.partnerships.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5 text-purple-600" />
                  Strategic Partnerships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  {reputationData.partnerships.map((partnership, index) => (
                    <div
                      key={index}
                      className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400"
                    >
                      <div className="flex items-start gap-2">
                        <Link className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-gray-800 leading-relaxed">
                            {partnership.value || partnership}
                          </p>
                          {partnership.source_name && (
                            <div className="flex items-center gap-1 mt-1">
                              <p className="text-xs text-gray-500">
                                Source: {partnership.source_name}
                              </p>
                              {partnership.source_url && (
                                <ExternalLink
                                  className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-600"
                                  onClick={() =>
                                    window.open(
                                      partnership.source_url,
                                      "_blank"
                                    )
                                  }
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        <Card className="bg-gray-50 border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800">
              Media & Reputation Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {reputationData.notable_news?.length || 0}
                </div>
                <div className="text-gray-600">Recent News Articles</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {reputationData.partnerships?.length || 0}
                </div>
                <div className="text-gray-600">Strategic Partnerships</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-700">
                  {reputationData.news_mentions_count || "N/A"}
                </div>
                <div className="text-gray-600">Total Mentions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const InsightsTab = ({ company, competitors }) => {
    const competitorData = competitors.data.competitors;

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Competitive Landscape Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Analysis of {competitorData.length} companies in the competitive
              landscape
            </p>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3 font-semibold">Company</th>
                    <th className="text-left p-3 font-semibold">Location</th>
                    <th className="text-left p-3 font-semibold">Stage</th>
                    <th className="text-left p-3 font-semibold">
                      Total Funding
                    </th>
                    <th className="text-left p-3 font-semibold">
                      Last Funding
                    </th>
                    <th className="text-center p-3 font-semibold">
                      Overall Score
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {competitorData.map((competitor, index) => {
                    const avgScore = Math.round(
                      (competitor.evaluation_score.revenue_growth_score +
                        competitor.evaluation_score.financial_strength_score +
                        competitor.evaluation_score.industry_health_score +
                        competitor.evaluation_score.founder_background_score) /
                        4
                    );

                    return (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="font-semibold">
                            {competitor.competitor_name}
                          </div>
                        </td>
                        <td className="p-3 text-gray-600">
                          {competitor.location}
                        </td>
                        <td className="p-3">
                          <Badge variant="secondary">{competitor.stage}</Badge>
                        </td>
                        <td className="p-3 font-medium">
                          {competitor.total_funding}
                        </td>
                        <td className="p-3 text-gray-600">
                          {competitor.last_funding}
                        </td>
                        <td className="p-3 text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                              avgScore
                            )}`}
                          >
                            {avgScore}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Evaluation Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitorData.map((competitor, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-semibold text-lg mb-3">
                    {competitor.competitor_name}
                  </h4>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        Revenue Growth
                      </div>
                      <div
                        className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                          competitor.evaluation_score.revenue_growth_score
                        )}`}
                      >
                        {competitor.evaluation_score.revenue_growth_score}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        Financial Strength
                      </div>
                      <div
                        className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                          competitor.evaluation_score.financial_strength_score
                        )}`}
                      >
                        {competitor.evaluation_score.financial_strength_score}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        Industry Health
                      </div>
                      <div
                        className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                          competitor.evaluation_score.industry_health_score
                        )}`}
                      >
                        {competitor.evaluation_score.industry_health_score}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">
                        Founder Background
                      </div>
                      <div
                        className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                          competitor.evaluation_score.founder_background_score
                        )}`}
                      >
                        {competitor.evaluation_score.founder_background_score}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-600" />
              Market Position Ranking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {competitorData
                .map((competitor, index) => {
                  const avgScore = Math.round(
                    (competitor.evaluation_score.revenue_growth_score +
                      competitor.evaluation_score.financial_strength_score +
                      competitor.evaluation_score.industry_health_score +
                      competitor.evaluation_score.founder_background_score) /
                      4
                  );
                  return { ...competitor, avgScore, originalIndex: index };
                })
                .sort((a, b) => b.avgScore - a.avgScore)
                .map((competitor, rank) => (
                  <div
                    key={competitor.originalIndex}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          rank === 0
                            ? "bg-yellow-500"
                            : rank === 1
                            ? "bg-gray-400"
                            : rank === 2
                            ? "bg-orange-600"
                            : "bg-gray-300"
                        }`}
                      >
                        {rank + 1}
                      </div>
                      <div>
                        <div className="font-semibold">
                          {competitor.competitor_name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {competitor.location}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div
                        className={`text-lg font-bold ${getScoreColor(
                          competitor.avgScore
                        )}`}
                      >
                        {competitor.avgScore}
                      </div>
                      <div className="text-sm text-gray-600">
                        {competitor.total_funding}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-800">
              Key Competitive Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {competitorData.length}
                </div>
                <div className="text-blue-600">Companies Analyzed</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round(
                    competitorData.reduce(
                      (sum, comp) =>
                        sum +
                        (comp.evaluation_score.revenue_growth_score +
                          comp.evaluation_score.financial_strength_score +
                          comp.evaluation_score.industry_health_score +
                          comp.evaluation_score.founder_background_score) /
                          4,
                      0
                    ) / competitorData.length
                  )}
                </div>
                <div className="text-blue-600">Average Score</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {
                    competitorData.filter(
                      (comp) =>
                        (comp.evaluation_score.revenue_growth_score +
                          comp.evaluation_score.financial_strength_score +
                          comp.evaluation_score.industry_health_score +
                          comp.evaluation_score.founder_background_score) /
                          4 >=
                        900
                    ).length
                  }
                </div>
                <div className="text-blue-600">Top Performers</div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">
                  {new Set(competitorData.map((comp) => comp.location)).size}
                </div>
                <div className="text-blue-600">Markets</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <SearchSection />

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
