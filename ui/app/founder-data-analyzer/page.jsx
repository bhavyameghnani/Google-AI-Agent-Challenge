"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  FileText,
  Mic,
  FileAudio,
  Loader2,
  AlertCircle,
  CheckCircle,
  Brain,
  BarChart3,
  Sparkles,
  X,
  Download,
  Building2,
  Zap,
  Video,
  Youtube,
  Play,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import PitchAnalysisResults from "./PitchAnalysisResults";

const API_BASE = process.env.NEXT_PUBLIC_PITCH_URL;

export default function StartupPitchAnalyzer() {
  const [transcriptText, setTranscriptText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [txtFile, setTxtFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingFactCheck, setLoadingFactCheck] = useState(false);
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [loadingAddCompany, setLoadingAddCompany] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pdf");
  const [successMessage, setSuccessMessage] = useState("");

  const uploadAudioFile = async () => {
    setError("");
    if (!audioFile) {
      setError("Select an audio file to upload.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", audioFile);
      const res = await fetch(`${API_BASE}/analyze-audio/`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyzeText = async () => {
    setError("");
    if (!transcriptText.trim()) {
      setError("Provide transcript text or upload a .txt file.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/analyze-text/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: transcriptText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const uploadTxtFile = async () => {
    setError("");
    if (!txtFile) {
      setError("Select a .txt file to upload.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", txtFile);
      const res = await fetch(`${API_BASE}/analyze-file/`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const uploadPdfFile = async () => {
    setError("");
    if (!pdfFile) {
      setError("Select a .pdf file to upload.");
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", pdfFile);
      const res = await fetch(`${API_BASE}/analyze-pitch-deck/`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoading(false);
    }
  };

  const factCheckPdfFile = async () => {
    setError("");
    if (!pdfFile) {
      setError("Select a .pdf file to upload for fact-checking.");
      return;
    }
    setLoadingFactCheck(true);
    setResult(null);
    try {
      const form = new FormData();
      form.append("file", pdfFile);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, "")}/fact-check`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      // attach fact-check report into result so PitchAnalysisResults can render it
      setResult({ ...data, _fact_check: true });
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingFactCheck(false);
    }
  };

  const addCompanyFromPitchDeck = async () => {
    setError("");
    setSuccessMessage("");
    if (!pdfFile) {
      setError("Select a .pdf file to extract company data.");
      return;
    }
    setLoadingAddCompany(true);
    try {
      const form = new FormData();
      form.append("file", pdfFile);
      const res = await fetch(
        `${API_BASE}/extract-company-from-pitch-deck/`,
        {
          method: "POST",
          body: form,
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");

      // Show success message
      setSuccessMessage(`Company "${data.company_name}" added successfully to Firebase!`);

      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingAddCompany(false);
    }
  };

  const uploadVideo = async () => {
    setError("");
    if (!videoFile && !youtubeUrl.trim()) {
      setError("Provide a video file or YouTube link.");
      return;
    }
    setLoadingVideo(true);
    setResult(null);
    try {
      const form = new FormData();
      if (videoFile) form.append("file", videoFile);
      if (youtubeUrl) form.append("youtube_url", youtubeUrl);

      const res = await fetch(`${API_BASE}/analyze-video/`, {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Server error");
      setResult(data);

      // reset video inputs
      setVideoFile(null);
      setYoutubeUrl("");
    } catch (err) {
      setError(String(err));
    } finally {
      setLoadingVideo(false);
    }
  };

  const clearAll = () => {
    setTranscriptText("");
    setAudioFile(null);
    setTxtFile(null);
    setPdfFile(null);
    setVideoFile(null);
    setYoutubeUrl("");
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <Navbar forceSolid={true} />

      <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-6 sm:pb-8 md:pb-10 pt-28">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Founder Data Analyzer
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                AI-powered analysis for pitch decks, founder call transcripts,
                video and presentations
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0 text-xs sm:text-sm"
            >
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Powered by SenseAI
            </Badge>
            <Badge variant="outline" className="text-xs">
              MultiModal Analysis
            </Badge>
          </div>
        </div>

        {/* Success Display */}
        {successMessage && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-green-50 border-2 border-green-300 rounded-lg shadow-md animate-in slide-in-from-top duration-300">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-green-800 flex-1">
                <CheckCircle className="h-5 w-5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-sm sm:text-base block">Success!</span>
                  <p className="text-green-700 text-xs sm:text-sm mt-1 break-words">{successMessage}</p>
                </div>
              </div>
              <button
                onClick={() => setSuccessMessage("")}
                className="text-green-600 hover:text-green-800 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base">Error</span>
            </div>
            <p className="text-red-700 text-xs sm:text-sm mt-1 break-words">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Analyze Pitch Deck
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto gap-1 sm:gap-2 p-1 overflow-x-auto">
                    <TabsTrigger
                      value="pdf"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                    >
                      <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">PDF</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="text"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Text</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="audio"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                    >
                      <Mic className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Audio</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="txt"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                    >
                      <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">TXT</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-2"
                    >
                      <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Video</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                        Paste your transcript here
                      </label>
                      <Textarea
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Enter your pitch transcript here..."
                        className="min-h-[150px] sm:min-h-[200px] resize-none text-sm sm:text-base"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={fetchAnalyzeText}
                        disabled={loading || !transcriptText.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full sm:w-auto text-sm sm:text-base"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Brain className="mr-2 h-4 w-4" />
                            Analyze Text
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setTranscriptText("")}
                        disabled={!transcriptText.trim()}
                        className="w-full sm:w-auto text-sm sm:text-base"
                      >
                        Clear
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                        Upload audio file
                      </label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                        <Mic className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept="audio/*,.wav,.mp3,.m4a,.ogg"
                          onChange={(e) =>
                            setAudioFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full text-xs sm:text-sm text-muted-foreground file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {audioFile && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                            Selected: {audioFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={uploadAudioFile}
                      disabled={loading || !audioFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Transcribing...
                        </>
                      ) : (
                        <>
                          <FileAudio className="mr-2 h-4 w-4" />
                          Transcribe & Analyze Audio
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="txt" className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                        Upload text file
                      </label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                        <FileText className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept=".txt"
                          onChange={(e) =>
                            setTxtFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full text-xs sm:text-sm text-muted-foreground file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {txtFile && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                            Selected: {txtFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={uploadTxtFile}
                      disabled={loading || !txtFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Upload & Analyze TXT
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="pdf" className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                        Upload pitch deck (PDF)
                      </label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                        <Download className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setPdfFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full text-xs sm:text-sm text-muted-foreground file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {pdfFile && (
                          <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                            Selected: {pdfFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={uploadPdfFile}
                      disabled={loading || loadingFactCheck || !pdfFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full text-sm sm:text-base"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>Analyze Pitch Deck</>
                      )}
                    </Button>
                    <div className="mt-2 space-y-2">
                      <Button
                        onClick={factCheckPdfFile}
                        disabled={loadingFactCheck || !pdfFile}
                        variant="outline"
                        className="w-full text-sm sm:text-base"
                      >
                        {loadingFactCheck ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Fact-checking...
                          </>
                        ) : (
                          <>
                            <FileText className="mr-2 h-4 w-4" />
                            Fact-check Pitch Deck
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={addCompanyFromPitchDeck}
                        disabled={loadingAddCompany || !pdfFile}
                        variant="outline"
                        className="w-full text-sm sm:text-base bg-green-50 hover:bg-green-100 border-green-300"
                      >
                        {loadingAddCompany ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding Company...
                          </>
                        ) : (
                          <>
                            <Building2 className="mr-2 h-4 w-4" />
                            Add Company
                          </>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-3 sm:space-y-4">
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                          Upload video file
                        </label>
                        <div className="border-2 border-dashed border-muted rounded-lg p-4 sm:p-6 text-center hover:border-blue-400 transition-colors">
                          <Video className="mx-auto h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                          <input
                            type="file"
                            accept="video/*,.mp4,.mov,.avi,.mkv"
                            onChange={(e) =>
                              setVideoFile(e.target.files?.[0] ?? null)
                            }
                            className="w-full text-xs sm:text-sm text-muted-foreground file:mr-2 sm:file:mr-4 file:py-1.5 sm:file:py-2 file:px-2 sm:file:px-4 file:rounded-lg file:border-0 file:text-xs sm:file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {videoFile && (
                            <p className="text-xs sm:text-sm text-muted-foreground mt-2 break-words">
                              Selected: {videoFile.name}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">
                            Or
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-foreground mb-2">
                          YouTube URL
                        </label>
                        <div className="flex items-center gap-2">
                          <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                          <Input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="flex-1 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={uploadVideo}
                      disabled={
                        loadingVideo || (!videoFile && !youtubeUrl.trim())
                      }
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full text-sm sm:text-base"
                    >
                      {loadingVideo ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing Video...
                        </>
                      ) : (
                        <>
                          <Video className="mr-2 h-4 w-4" />
                          Transcribe & Analyze Video
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-4 sm:mt-6 pt-3 sm:pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={loading || loadingVideo}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="h-fit">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {loading || loadingVideo ? (
                  <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-4">
                    <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-blue-600 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground text-center">
                      {loadingVideo
                        ? "Processing video..."
                        : "Analyzing your content..."}
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 text-center">
                      This may take a few moments
                    </p>
                  </div>
                ) : result ? (
                  <PitchAnalysisResults result={result} />
                ) : (
                  <div className="text-center py-6 sm:py-8 px-4">
                    <Brain className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-muted-foreground mb-2">
                      No analysis yet
                    </p>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Upload content to see AI-powered insights
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
