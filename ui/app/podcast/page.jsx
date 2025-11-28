"use client";

import { useEffect, useState } from "react";
import { Search, TrendingUp } from "lucide-react";
import RecordCard from "./RecordCard";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const Index = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_RECORDS_API}/records`);
      if (!res.ok) throw new Error("Failed to fetch records");
      const data = await res.json();
      setRecords(data);
    } catch (e) {
      setError(e?.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const filteredRecords = records.filter((r) =>
    (r.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recordsByTheme = filteredRecords.reduce((acc, record) => {
    const theme = record.theme || "Others";
    if (!acc[theme]) acc[theme] = [];
    acc[theme].push(record);
    return acc;
  }, {});

  const generatePodcastButton = (
    <Button
      size="lg"
      onClick={() => router.push("/newsletter-podcast-generator")}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto text-sm sm:text-base"
    >
      🎙️ Analyze Market (with podcast)
      {/* 🎙️ Generate New Podcast */}
    </Button>
  );
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navbar forceSolid={true} />

      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <img
            src={"/images/podcast-hero.jpg"}
            alt="Finance Podcast Platform"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-accent/90" />
        </div>

        <div className="relative z-10 container mx-auto px-3 sm:px-4 md:px-6 py-12 sm:py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-accent/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-4 sm:mb-6">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-accent" />
              <span className="text-xs sm:text-sm font-medium text-primary-foreground">
                In-depth Market Analysis
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary-foreground mb-4 sm:mb-6 px-2">
              Analyze the Market with Our Bilingual Podcast
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-primary-foreground/90 mb-6 sm:mb-8 px-2">
              Dive into comprehensive market insights and trends with our market analysis feature
            </p>

            <div className="relative max-w-xl mx-auto px-2">
              <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search episodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 sm:pl-12 h-12 sm:h-14 bg-background/95 backdrop-blur-sm border-2 border-background/50 focus:border-accent text-sm sm:text-base md:text-lg"
              />
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full"
          >
            <path
              fill="hsl(var(--background))"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      <section className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-16">
        {loading ? (
          <div className="text-center py-8 sm:py-12 text-sm sm:text-base">
            Loading episodes...
          </div>
        ) : error ? (
          <div className="text-center py-8 sm:py-12 text-destructive text-sm sm:text-base">
            {error}
          </div>
        ) : Object.keys(recordsByTheme).length === 0 ? (
          <div className="text-center py-8 sm:py-12 px-4">
            <p className="text-muted-foreground text-base sm:text-lg mb-4">
              No episodes found matching "{searchQuery}"
            </p>
            <div className="flex justify-center">{generatePodcastButton}</div>
          </div>
        ) : (
          Object.entries(recordsByTheme).map(([theme, records]) => (
            <div key={theme} className="mb-8 sm:mb-12 animate-fade-in">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-8 justify-start items-start sm:items-center mb-3 sm:mb-2">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A224E]">
                  {theme}
                </h2>
                <div className="w-full sm:w-auto">{generatePodcastButton}</div>
              </div>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                {records.length} episode{records.length !== 1 ? "s" : ""} under
                this theme
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {records.map((record, index) => (
                  <div
                    key={record.id}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <RecordCard
                      id={record.id}
                      title={record.title || "Untitled"}
                      uploadDate={record.created_at || new Date().toISOString()}
                      hasPdf={!!record.report_pdf}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Index;
