"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Search,
  TrendingUp,
  Users,
  Brain,
  Sparkles,
  Layers,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleAnalyze = () => {
    if (searchQuery.trim()) {
      router.push(`/dashboard?company=${encodeURIComponent(searchQuery)}`);
    }
  };

  const features = [
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Financial Intelligence",
      description: "Real-time deep dives into valuation and growth metrics.",
      bg: "bg-blue-50 text-blue-600",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "SenseAI Score",
      description: "Proprietary algorithmic health & potential rating.",
      bg: "bg-purple-50 text-purple-600",
    },
    {
      icon: <Layers className="h-5 w-5" />,
      title: "Multimodal Analysis",
      description: "Processing decks, videos, and transcripts simultaneously.",
      bg: "bg-indigo-50 text-indigo-600",
    },
    {
      icon: <Brain className="h-5 w-5" />,
      title: "AI Consultant",
      description: "Interactive chat for instant, data-backed answers.",
      bg: "bg-emerald-50 text-emerald-600",
    },
  ];

  const stats = [
    { number: "10K+", label: "Companies Analyzed" },
    { number: "96%", label: "Data Accuracy" },
    { number: "<2m", label: "Analysis Time" },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 selection:bg-blue-100 selection:text-blue-900 font-sans text-slate-900">
      {/* Abstract Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-96 h-96 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <Badge
            variant="outline"
            className="mb-8 px-4 py-1.5 rounded-full border-blue-200 bg-blue-50/50 text-blue-700 text-sm font-medium backdrop-blur-sm animate-fade-in-up"
          >
            <Sparkles className="w-3.5 h-3.5 mr-2 inline-block" />
            Startup Evaluation, Reinvented
          </Badge>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-8 text-slate-900 leading-[1.1]">
            Research Companion Powered By <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              Agentic AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            Instantly analyze any company with AI. From funding history to
            founder personality, get the complete picture in seconds.
          </p>

          {/* Hero Search */}
          <div className="max-w-2xl mx-auto relative group mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative flex items-center bg-white rounded-full shadow-2xl shadow-blue-900/5 ring-1 ring-slate-200/60 p-2 pl-6 transition-all focus-within:ring-blue-500/50 focus-within:shadow-blue-500/10">
              <Search className="h-5 w-5 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Enter company name (e.g., Stripe, SpaceX)..."
                className="flex-1 bg-transparent border-none outline-none text-lg text-slate-900 placeholder:text-slate-400 h-12 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
              />
              <Button
                onClick={handleAnalyze}
                size="lg"
                className="rounded-full px-8 bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20 transition-all hover:scale-105 relative group overflow-visible"
              >
                <span className="relative z-10">Analyze</span>
                <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
                  <span className="absolute inset-[2px] rounded-full bg-blue-600"></span>
                </span>
              </Button>
            </div>
          </div>

          {/* Mini Stats */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 border-t border-slate-200/60 pt-8 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-slate-900">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wide mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Intelligence, Simplified.
              </h2>
              <p className="text-slate-500 text-lg">
                We aggregate thousands of data points into a single, beautiful
                dashboard. No more tab switching.
              </p>
            </div>
            <Button
              variant="outline"
              className="hidden md:flex rounded-full border-slate-200 relative group overflow-visible"
              onClick={() => router.push("/dashboard")}
            >
              <span className="relative z-10">View Features</span>
              <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
                <span className="absolute inset-[2px] rounded-full bg-white"></span>
              </span>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="relative rounded-[2.5rem] bg-slate-900 overflow-hidden px-8 py-20 md:p-20 text-center">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Ready to see the unseen?
              </h2>
              <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10">
                Join forward-thinking investors and founders using SenseAI to
                make better decisions, faster.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  size="lg"
                  onClick={() => router.push("/dashboard")}
                  className="w-full sm:w-auto rounded-full bg-white text-slate-900 hover:bg-slate-100 text-base px-8 h-14 font-semibold relative group overflow-visible"
                >
                  <span className="relative z-10">Start Analyzing Now</span>
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
                    <span className="absolute inset-[2px] rounded-full bg-white"></span>
                  </span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => router.push("/chat")}
                  className="w-full sm:w-auto rounded-full border-slate-700 text-white hover:bg-slate-800 hover:text-white text-base px-8 h-14 bg-transparent relative group overflow-visible"
                >
                  <span className="relative z-10">Talk to SenseAI</span>
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
                    <span className="absolute inset-[2px] rounded-full bg-slate-900"></span>
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 border-t border-slate-100 bg-white">
        <div className="container mx-auto px-6 flex justify-center items-center">
          <div className="h-9 sm:h-12 flex items-center justify-center">
            <img
              src="/images/senseai-logo.png"
              alt="SenseAI Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>
      </footer>
    </div>
  );
}
