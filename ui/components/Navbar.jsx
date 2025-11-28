"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart3, Menu, X, MessageSquare, Zap, Play } from "lucide-react";
import { useRouter } from "next/navigation";

export function Navbar({ forceSolid = false }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    if (!forceSolid) {
      window.addEventListener("scroll", handleScroll);
    } else {
      setScrolled(true);
    }
    return () => window.removeEventListener("scroll", handleScroll);
  }, [forceSolid]);

  return (
    <nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled || mobileMenuOpen || forceSolid
          ? "bg-white backdrop-blur-md border-b border-slate-200/50 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => router.push("/")}
        >
          <div className="h-9 sm:h-12 flex items-center justify-center transition-transform group-hover:scale-105 flex-shrink-0">
            <img
              src="/images/senseai-logo.png"
              alt="SenseAI Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button
            onClick={() => router.push("/chat")}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative px-4 py-2 rounded-full group"
          >
            <span className="relative z-10">AI Chat</span>
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
              <span className="absolute inset-[2px] rounded-full bg-white"></span>
            </span>
          </button>
          <button
            onClick={() => router.push("/founder-data-analyzer")}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative px-4 py-2 rounded-full group"
          >
            <span className="relative z-10">Founder Analysis</span>
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
              <span className="absolute inset-[2px] rounded-full bg-white"></span>
            </span>
          </button>
          <button
            onClick={() => router.push("/podcast")}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors relative px-4 py-2 rounded-full group"
          >
            <span className="relative z-10">Analyze Market (with podcast)</span>
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
              <span className="absolute inset-[2px] rounded-full bg-white"></span>
            </span>
          </button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 shadow-lg shadow-slate-900/10 hover:shadow-slate-900/20 transition-all relative group overflow-visible"
          >
            <span className="relative z-10">Analyze Company</span>
            <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
              <span className="absolute inset-[2px] rounded-full bg-slate-900"></span>
            </span>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-white border-b border-slate-100 shadow-xl lg:hidden p-4 flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => router.push("/chat")}
          >
            <MessageSquare className="mr-2 h-4 w-4" /> AI Chat
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => router.push("/founder-data-analyzer")}
          >
            <Zap className="mr-2 h-4 w-4" /> Founder Analysis
          </Button>
          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => router.push("/podcast")}
          >
            <Play className="mr-2 h-4 w-4" /> Analyze Market (with podcast)
          </Button>
          <div className="h-px bg-slate-100 my-2" />
          <Button
            className="w-full bg-blue-600 relative group overflow-visible"
            onClick={() => router.push("/dashboard")}
          >
            <span className="relative z-10">Get Started</span>
            <span className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10">
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-[length:200%_100%] animate-border-spin opacity-75 blur-sm"></span>
              <span className="absolute inset-[2px] rounded-md bg-blue-600"></span>
            </span>
          </Button>
        </div>
      )}
    </nav>
  );
}
