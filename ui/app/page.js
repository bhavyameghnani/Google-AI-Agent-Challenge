"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  TrendingUp,
  Users,
  Globe,
  BarChart3,
  Building2,
  Zap,
  Brain,
  MessageSquare,
  ArrowRight,
  CheckCircle,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleAnalyze = () => {
    if (searchQuery.trim()) {
      // ✅ Only navigate, let dashboard handle the API
      router.push(`/dashboard?company=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Financial Intelligence",
      description:
        "Deep dive into funding, valuation, and growth metrics with real-time data",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "SenseAI Score",
      description:
        "Our proprietary algorithm rates company health and growth potential",
      color: "from-purple-500 to-purple-600",
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Multimodal Insights",
      description:
        "Leverage startup spitchdecks, transcripts, reports, videos and more",
      color: "from-green-500 to-green-600",
    },
    {
      icon: <Brain className="h-6 w-6" />,
      title: "AI-Powered Chat",
      description:
        "Ask anything about companies and get instant, intelligent responses",
      color: "from-orange-500 to-orange-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Datapoints analyzed" },
    { number: ">96%", label: "Data Accuracy (Manually vetted)" },
    { number: "<120s", label: "Analysis Time" },
    { number: "On demand", label: "Data Updates" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-32 h-16 flex items-center justify-center p-1">
                <img
                  src="/images/senseai-logo.png"
                  alt="SenseAI Logo"
                  className="w-32 h-32  object-contain hover:scale-105 transition-transform duration-200"
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                onClick={() => router.push("/chat")}
              >
                🤖 Talk to SenseAI
              </Button>
              <Button
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-100"
                onClick={() => router.push("/founder-data-analyzer")}
              >
                ⚡ Analyze Founder Data
              </Button>
              <Button
                onClick={() => router.push("/dashboard")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-16">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-6 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Company Intelligence
            </Badge>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-tight">
              X-Ray Vision for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {" "}
                Startups
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Get comprehensive insights on any company. From financials to
              leadership, market position to growth metrics - all powered by
              SenseAI.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto mb-16">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
                <div className="relative bg-white rounded-2xl shadow-xl border border-slate-200/50 p-2 flex items-center">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                    <Input
                      placeholder="Enter any company name (e.g., OpenAI, Tesla, Stripe)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // ✅ avoid accidental double trigger
                          handleAnalyze();
                        }
                      }}
                      className="pl-12 pr-4 py-6 text-lg border-0 focus:ring-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  <Button
                    onClick={handleAnalyze}
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Analyze
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-12">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Button
                size="lg"
                onClick={() => router.push("/chat")}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[200px]"
              >
                🤖 Talk to SenseAI
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => router.push("/founder-data-analyzer")}
                className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 min-w-[200px] bg-white"
              >
                ⚡ Analyze Founder Data
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Everything You Need to Know
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From startup to enterprise, get the complete picture of any
              company with our comprehensive analysis suite.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm hover:-translate-y-1"
              >
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-200`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-slate-900">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 border-0 shadow-2xl">
              <CardContent className="p-12 text-center text-white">
                <Building2 className="h-16 w-16 mx-auto mb-6 opacity-90" />
                <h2 className="text-4xl font-bold mb-4">
                  Ready to Discover Company Intelligence?
                </h2>
                <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                  Join thousands of investors, analysts, and business
                  professionals who trust SenseAI for their research needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Button
                    size="lg"
                    onClick={() => router.push("/dashboard")}
                    className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Start Analyzing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => router.push("/chat")}
                    className="border-white text-blue-600 hover:bg-white hover:text-blue-900 px-8 py-4 text-lg font-semibold backdrop-blur-sm"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Try 🤖 Talk to SenseAI
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/80 backdrop-blur-md py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">SenseAI</span>
            </div>
            <p className="text-slate-600">
              © 2025 SenseAI. Powered by AI. Built for the future of business
              intelligence.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
