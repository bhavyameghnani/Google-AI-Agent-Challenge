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
} from "lucide-react";
import { Navbar } from "../dashboard/CompanyDashboard";
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
  const [loadingVideo, setLoadingVideo] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("text");

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
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Startup Pitch Analyzer
              </h1>
              <p className="text-muted-foreground">
                AI-powered analysis for pitch decks, audio, video and
                presentations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border-0"
            >
              <Sparkles className="w-4 h-4 mr-1" />
              Powered by SenseAI
            </Badge>
            <Badge variant="outline" className="text-xs">
              MultiModal Analysis
            </Badge>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload & Analyze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-5">
                    <TabsTrigger
                      value="text"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      Text
                    </TabsTrigger>
                    <TabsTrigger
                      value="audio"
                      className="flex items-center gap-2"
                    >
                      <Mic className="h-4 w-4" />
                      Audio
                    </TabsTrigger>
                    <TabsTrigger
                      value="txt"
                      className="flex items-center gap-2"
                    >
                      <FileText className="h-4 w-4" />
                      TXT File
                    </TabsTrigger>
                    <TabsTrigger
                      value="pdf"
                      className="flex items-center gap-2"
                    >
                      <Download className="h-4 w-4" />
                      PDF
                    </TabsTrigger>
                    <TabsTrigger
                      value="video"
                      className="flex items-center gap-2"
                    >
                      <Video className="h-4 w-4" />
                      Video
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Paste your transcript here
                      </label>
                      <Textarea
                        value={transcriptText}
                        onChange={(e) => setTranscriptText(e.target.value)}
                        placeholder="Enter your pitch transcript here..."
                        className="min-h-[200px] resize-none"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={fetchAnalyzeText}
                        disabled={loading || !transcriptText.trim()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                      >
                        Clear
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="audio" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Upload audio file
                      </label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Mic className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept="audio/*,.wav,.mp3,.m4a,.ogg"
                          onChange={(e) =>
                            setAudioFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {audioFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {audioFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={uploadAudioFile}
                      disabled={loading || !audioFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
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

                  <TabsContent value="txt" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Upload text file
                      </label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <FileText className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept=".txt"
                          onChange={(e) =>
                            setTxtFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {txtFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {txtFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={uploadTxtFile}
                      disabled={loading || !txtFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
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

                  <TabsContent value="pdf" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Upload pitch deck (PDF)
                      </label>
                      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Download className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setPdfFile(e.target.files?.[0] ?? null)
                          }
                          className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {pdfFile && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Selected: {pdfFile.name}
                          </p>
                        )}
                      </div>
                    </div>

                    <Button
                      onClick={uploadPdfFile}
                      disabled={loading || !pdfFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Upload & Analyze PDF
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="video" className="space-y-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Upload video file
                        </label>
                        <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                          <Video className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                          <input
                            type="file"
                            accept="video/*,.mp4,.mov,.avi,.mkv"
                            onChange={(e) =>
                              setVideoFile(e.target.files?.[0] ?? null)
                            }
                            className="w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          />
                          {videoFile && (
                            <p className="text-sm text-muted-foreground mt-2">
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
                        <label className="block text-sm font-medium text-foreground mb-2">
                          YouTube URL
                        </label>
                        <div className="flex items-center gap-2">
                          <Youtube className="h-5 w-5 text-red-600" />
                          <Input
                            type="url"
                            placeholder="https://youtube.com/watch?v=..."
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            className="flex-1"
                          />
                        </div>
                      </div>
                    </div>

                    <Button
                      onClick={uploadVideo}
                      disabled={
                        loadingVideo || (!videoFile && !youtubeUrl.trim())
                      }
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 w-full"
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

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={loading || loadingVideo}
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
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading || loadingVideo ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-muted-foreground text-center">
                      {loadingVideo
                        ? "Processing video..."
                        : "Analyzing your content..."}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      This may take a few moments
                    </p>
                  </div>
                ) : result ? (
                  <PitchAnalysisResults result={result} />
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-2">
                      No analysis yet
                    </p>
                    <p className="text-xs text-muted-foreground">
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
