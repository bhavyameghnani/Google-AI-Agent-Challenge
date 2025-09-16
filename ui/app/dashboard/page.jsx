"use client"
 

import { useState } from "react"
import {
  Search,
  Building2,
  TrendingUp,
  Users,
  DollarSign,
  Globe,
  ExternalLink,
  Star,
  BarChart3,
  PieChart,
  Activity,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// interface CompanyData {
//   company_name: string
//   data: {
//     company_info: {
//       company_name: string
//       logo_url: string | null
//       headquarters_location: string
//       year_founded: number
//       company_type: string
//       industry_sector: string
//       business_model: string
//       company_stage: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       employee_count: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       website_url: string
//       company_description: string
//     }
//     financial_data: {
//       total_equity_funding: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       latest_funding_round: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       valuation: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       revenue_growth_rate: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       financial_strength: string
//       key_investors: string[]
//     }
//     people_data: {
//       key_people: Array<{
//         name: string
//         role: string
//         background: string
//         source_url: string | null
//       }>
//       employee_growth_rate: string | null
//       hiring_trends: string
//     }
//     market_data: {
//       market_size: {
//         value: string
//         source_url: string
//         source_name: string
//       }
//       competitive_landscape: {
//         value: string
//         source_url: string | null
//         source_name: string | null
//       }
//       market_position: string
//       competitive_advantages: Array<{
//         value: string
//         source_url: string | null
//         source_name: string | null
//       }>
//       product_market_fit: string
//     }
//     reputation_data: {
//       customer_satisfaction: string | null
//       news_mentions_count: string | null
//       notable_news: Array<{
//         headline: string
//         source_url: string
//         source_name: string
//         date: string
//       }>
//       partnerships: Array<{
//         value: string
//         source_url: string
//         source_name: string
//       }>
//       brand_sentiment: string
//     }
//     extraction_summary: string
//   }
//   source: string
//   last_updated: string
//   cache_age_days: number
//   extraction_status: string
// }

export default function CBInsightsDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [companyData, setCompanyData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://127.0.0.1:5005/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_name: searchQuery }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch company data")
      }

      const data = await response.json()
      
      setCompanyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900">CB Insights</span>
              </div>
            </div>

            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search companies, investors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 pr-4 py-2 w-full bg-slate-50 border-slate-200 focus:bg-white"
                />
                <Button
                  onClick={handleSearch}
                  disabled={loading}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 px-3"
                >
                  {loading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                Advanced Search
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {!companyData && !loading && (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-slate-900 mb-2">Search for Company Intelligence</h2>
            <p className="text-slate-600 max-w-md mx-auto">
              Enter a company name above to get comprehensive business intelligence, financial data, and market
              insights.
            </p>
          </div>
        )}

        {companyData && (
          <div className="space-y-6">
            {/* Company Header */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarImage src={companyData.data.company_info.logo_url || undefined} />
                      <AvatarFallback className="text-lg font-semibold">
                        {companyData.data.company_info.company_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h1 className="text-3xl font-bold text-slate-900">
                        {companyData.data.company_info.company_name}
                      </h1>
                      <p className="text-slate-600 mt-1">
                        {companyData.data.company_info.headquarters_location} •{" "}
                        {companyData.data.company_info.industry_sector}
                      </p>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="secondary">{companyData.data.company_info.company_stage.value}</Badge>
                        <span className="text-sm text-slate-500">
                          Founded {companyData.data.company_info.year_founded}
                        </span>
                        {companyData.data.company_info.website_url && (
                          <a
                            href={companyData.data.company_info.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
                          >
                            <Globe className="w-4 h-4 mr-1" />
                            Website
                            <ExternalLink className="w-3 h-3 ml-1" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-slate-500 mb-1">Last Updated</div>
                    <div className="text-sm font-medium">{new Date(companyData.last_updated).toLocaleDateString()}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Total Funding</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {companyData.data.financial_data.total_equity_funding.value}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Valuation</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {companyData.data.financial_data.valuation.value}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Employees</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {companyData.data.company_info.employee_count.value}
                      </p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-600">Market Size</p>
                      <p className="text-2xl font-bold text-slate-900">
                        {companyData.data.market_data.market_size.value}
                      </p>
                    </div>
                    <PieChart className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="financials">Financials</TabsTrigger>
                <TabsTrigger value="people">People</TabsTrigger>
                <TabsTrigger value="market">Market</TabsTrigger>
                <TabsTrigger value="news">News</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>About</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-700 leading-relaxed">
                          {companyData.data.company_info.company_description}
                        </p>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-600">Business Model:</span>
                            <span className="text-sm text-slate-900">
                              {companyData.data.company_info.business_model}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-600">Company Type:</span>
                            <span className="text-sm text-slate-900">{companyData.data.company_info.company_type}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Key Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="text-sm font-medium text-slate-600 mb-1">Financial Strength</div>
                          <Badge variant="outline">{companyData.data.financial_data.financial_strength}</Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-600 mb-1">Market Position</div>
                          <Badge variant="outline">{companyData.data.market_data.market_position}</Badge>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-slate-600 mb-1">Product-Market Fit</div>
                          <Badge variant="outline">{companyData.data.market_data.product_market_fit}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="financials" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Funding Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-slate-600 mb-1">Latest Funding Round</div>
                        <div className="text-lg font-semibold">
                          {companyData.data.financial_data.latest_funding_round.value}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-600 mb-1">Revenue Growth Rate</div>
                        <div className="text-lg font-semibold">
                          {companyData.data.financial_data.revenue_growth_rate.value}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Key Investors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {companyData.data.financial_data.key_investors.map((investor, index) => (
                          <Badge key={index} variant="secondary" className="mr-2 mb-2">
                            {investor}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="people" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Key People</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companyData.data.people_data.key_people.map((person, index) => (
                        <div key={index} className="flex items-start space-x-4 p-4 border border-slate-200 rounded-lg">
                          <Avatar>
                            <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <h4 className="font-semibold text-slate-900">{person.name}</h4>
                            <p className="text-sm text-slate-600 mb-2">{person.role}</p>
                            <p className="text-sm text-slate-700">{person.background}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="market" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Market Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <div className="text-sm font-medium text-slate-600 mb-1">Competitive Landscape</div>
                        <p className="text-sm text-slate-700">
                          {companyData.data.market_data.competitive_landscape.value}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Competitive Advantages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {companyData.data.market_data.competitive_advantages.map((advantage, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Star className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-slate-700">{advantage.value}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="news" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent News</CardTitle>
                    <CardDescription>
                      {companyData.data.reputation_data.news_mentions_count} mentions found
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {companyData.data.reputation_data.notable_news.map((news, index) => (
                        <div key={index} className="border-l-4 border-blue-500 pl-4">
                          <h4 className="font-medium text-slate-900 mb-1">{news.headline}</h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span>{news.source_name}</span>
                            <span>•</span>
                            <span>{new Date(news.date).toLocaleDateString()}</span>
                            <a
                              href={news.source_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              Read more <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>AI-Powered Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start space-x-3">
                        <Activity className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-900 mb-2">Extraction Summary</h4>
                          <p className="text-blue-800 text-sm leading-relaxed">{companyData.data.extraction_summary}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="font-medium text-slate-900 mb-3">Brand Sentiment</h4>
                      <Badge variant="outline" className="text-lg px-3 py-1">
                        {companyData.data.reputation_data.brand_sentiment}
                      </Badge>
                    </div>

                    {companyData.data.reputation_data.partnerships.length > 0 && (
                      <div className="mt-6">
                        <h4 className="font-medium text-slate-900 mb-3">Key Partnerships</h4>
                        <div className="space-y-2">
                          {companyData.data.reputation_data.partnerships.map((partnership, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                              <span className="text-sm font-medium">{partnership.value}</span>
                              <a
                                href={partnership.source_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                              >
                                {partnership.source_name} <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </main>
    </div>
  )
}
