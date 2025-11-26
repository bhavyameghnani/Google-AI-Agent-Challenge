"use client";

import React, { useState, useRef } from "react";
import { FilePlus, Play, Loader2, Download, Mail } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function GeneratePodcast() {
  // 🎙️ Podcast Section States
  const [startupName, setStartupName] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  // 📰 Newsletter Section States
  const [newsletterTopic, setNewsletterTopic] = useState("");
  const [newsletterLoading, setNewsletterLoading] = useState(false);
  const [newsletterError, setNewsletterError] = useState(null);
  const [newsletterResult, setNewsletterResult] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_LVX_API || "http://localhost:5007";

  // Utility: reset states
  const clearPodcastState = () => {
    setError(null);
    setResult(null);
  };

  const clearNewsletterState = () => {
    setNewsletterError(null);
    setNewsletterResult(null);
  };

  // 🎙️ Generate Podcast by Startup Name
  const handleGenerateByName = async () => {
    clearPodcastState();
    if (!startupName.trim()) {
      setError("Please enter a startup name.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyze-startup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ startup_name: startupName.trim() }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // 🎙️ Generate Podcast from PDF
  const handlePdfChange = (e) => {
    clearPodcastState();
    const f = e.target.files && e.target.files[0];
    setPdfFile(f || null);
  };

  const handleGenerateFromPdf = async () => {
    clearPodcastState();
    if (!pdfFile) {
      setError("Please choose a PDF file to upload.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.append("file", pdfFile, pdfFile.name);

      const res = await fetch(`${API_BASE}/analyze-from-pdf`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setResult(data);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  };

  // 📰 Generate Newsletter
  const handleGenerateNewsletter = async () => {
    clearNewsletterState();
    if (!newsletterTopic.trim()) {
      setNewsletterError("Please enter a newsletter topic.");
      return;
    }

    setNewsletterLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate-newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sector: newsletterTopic.trim(),
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || `Request failed: ${res.status}`);
      }

      const data = await res.json();
      setNewsletterResult(data);
    } catch (e) {
      setNewsletterError(e.message || String(e));
    } finally {
      setNewsletterLoading(false);
    }
  };

  // 📂 Auto-download podcast files
  const renderFiles = (filesObj) => {
    if (!filesObj) return null;

    const downloadFile = async (key, val) => {
      try {
        const match = val.match(/startup_podcasts\/(lvx[^\/]+)\/(.+)$/);
        if (!match) return;

        const session = match[1];
        const filename = match[2];
        const href = `${API_BASE}/podcasts/${session}/${filename}`;

        const response = await fetch(href);
        if (!response.ok) throw new Error("Failed to download file");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      } catch (err) {
        console.error(`Error downloading ${key}:`, err);
      }
    };

    const items = [];
    Object.entries(filesObj).forEach(([key, val]) => {
      if (!val) return;
      if (typeof val === "string") {
        const match = val.match(/startup_podcasts\/(lvx[^\/]+)\/(.+)$/);
        if (match) {
          const filename = match[2];
          items.push(
            <div key={key} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="text-sm">{filename}</span>
              <span className="text-xs text-muted-foreground">({key})</span>
            </div>
          );
          downloadFile(key, val);
        }
      }
    });

    return (
      <div className="space-y-2 mt-2">
        <div className="text-sm font-medium text-muted-foreground">
          Files downloaded automatically:
        </div>
        {items}
      </div>
    );
  };

  return (
    <Card className="mt-6 sm:mt-8 shadow-elevated">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Generate Podcast & Newsletter</CardTitle>
        <CardDescription className="text-sm">
          Create startup analysis podcasts or newsletters by providing relevant
          inputs.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        {/* 🎙️ Podcast Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Podcast by Name */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">Startup Name</Label>
            <Input
              placeholder="e.g. Zomato or Razorpay"
              value={startupName}
              onChange={(e) => setStartupName(e.target.value)}
              disabled={loading || newsletterLoading}
              className="text-sm sm:text-base"
            />
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button onClick={handleGenerateByName} disabled={loading} className="w-full sm:w-auto text-sm sm:text-base">
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                    Generating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" /> Generate Podcast
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setStartupName("");
                  clearPodcastState();
                }}
                disabled={loading}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Podcast from PDF */}
          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">Upload PDF</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handlePdfChange}
              disabled={loading || newsletterLoading}
              className="w-full text-xs sm:text-sm file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                onClick={handleGenerateFromPdf}
                disabled={loading || !pdfFile}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                    Processing...
                  </>
                ) : (
                  <>
                    <FilePlus className="h-4 w-4 mr-2" /> Generate from PDF
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setPdfFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = null;
                  clearPodcastState();
                }}
                disabled={loading}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Clear
              </Button>
            </div>

            {pdfFile && (
              <div className="text-xs sm:text-sm text-muted-foreground break-words">
                Selected: {pdfFile.name} ({Math.round(pdfFile.size / 1024)} KB)
              </div>
            )}
          </div>
        </div>

        {/* Podcast Status */}
        <div className="mt-4 sm:mt-6">
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 text-destructive-foreground text-xs sm:text-sm break-words">
              Error: {error}
            </div>
          )}
          {result && (
            <div className="p-3 rounded-md bg-success/10 text-success-foreground text-xs sm:text-sm space-y-2">
              <div className="font-medium">Podcast Generation Completed</div>
              <div className="text-xs text-muted-foreground">
                Session: {result.session_id || result.session}
              </div>
              {renderFiles(result.files)}
            </div>
          )}
        </div>

        {/* 📰 Newsletter Section */}
        <div className="border-t mt-6 sm:mt-8 pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2 mb-3 sm:mb-4">
            <Mail className="h-4 w-4 sm:h-5 sm:w-5" /> Generate Newsletter
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
            Create an automated newsletter from the given topic and highlights.
          </p>

          <div className="space-y-2 sm:space-y-3">
            <Label className="text-sm sm:text-base">Newsletter Topic</Label>
            <Input
              placeholder="e.g. FinTech Market Update, AI Startup Trends"
              value={newsletterTopic}
              onChange={(e) => setNewsletterTopic(e.target.value)}
              disabled={newsletterLoading}
              className="text-sm sm:text-base"
            />

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                onClick={handleGenerateNewsletter}
                disabled={newsletterLoading}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                {newsletterLoading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                    Generating...
                  </>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" /> Generate Newsletter
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setNewsletterTopic("");
                  clearNewsletterState();
                }}
                disabled={newsletterLoading}
                className="w-full sm:w-auto text-sm sm:text-base"
              >
                Clear
              </Button>
            </div>
          </div>

          {/* Newsletter Result */}
          <div className="mt-3 sm:mt-4">
            {newsletterError && (
              <div className="p-3 rounded-md bg-destructive/10 text-destructive-foreground text-xs sm:text-sm break-words">
                Error: {newsletterError}
              </div>
            )}
            {newsletterResult && (
              <div className="p-3 rounded-md bg-success/10 text-success-foreground text-xs sm:text-sm space-y-2">
                <div className="font-medium">
                  Newsletter Generated Successfully
                </div>
                {newsletterResult.download_url ? (
                  <a
                    href={newsletterResult.download_url}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-xs sm:text-sm"
                  >
                    Download Newsletter
                  </a>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {newsletterResult.message || "Newsletter ready"}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
