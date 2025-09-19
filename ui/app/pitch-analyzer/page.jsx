"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navbar } from "../dashboard/page";
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
} from "lucide-react";

const API_BASE = "http://localhost:8000"; // change if different

export default function StartupPitchAnalyzer() {
  const [transcriptText, setTranscriptText] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [txtFile, setTxtFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [loading, setLoading] = useState(false);
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

  const clearAll = () => {
    setTranscriptText("");
    setAudioFile(null);
    setTxtFile(null);
    setPdfFile(null);
    setResult(null);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* ...existing code... */}
          <div className="flex items-center gap-3 mb-4 justify-center">
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Startup Pitch Analyzer
              </h1>
              <p className="text-slate-600">
                AI-powered analysis for pitch decks and presentations
              </p>
            </div>
          </div>
          {/* ...existing code... */}
        </div>

        {/* Error Banner */}
        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 font-medium">{error}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setError("")}
                  className="ml-auto h-6 w-6 p-0 text-red-600 hover:text-red-800"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-blue-600" />
                  Upload & Analyze
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="grid w-full grid-cols-4 mb-6">
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
                      <FileAudio className="h-4 w-4" />
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
                  </TabsList>

                  <TabsContent value="text" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Upload audio file
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Mic className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <input
                          type="file"
                          accept="audio/*,.wav,.mp3,.m4a,.ogg"
                          onChange={(e) =>
                            setAudioFile(e.target.files?.[0] ?? null)
                          }
                          className="hidden"
                          id="audio-upload"
                        />
                        <label
                          htmlFor="audio-upload"
                          className="cursor-pointer"
                        >
                          <span className="text-blue-600 hover:text-blue-800 font-medium">
                            Click to upload
                          </span>
                          <span className="text-slate-500">
                            {" "}
                            or drag and drop
                          </span>
                        </label>
                        <p className="text-xs text-slate-500 mt-1">
                          MP3, WAV, M4A, OGG files supported
                        </p>
                      </div>
                      {audioFile && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <FileAudio className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-800">
                            {audioFile.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setAudioFile(null)}
                            className="ml-auto h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={uploadAudioFile}
                      disabled={loading || !audioFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileAudio className="mr-2 h-4 w-4" />
                          Upload & Analyze Audio
                        </>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="txt" className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Upload text file
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <FileText className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <input
                          type="file"
                          accept=".txt"
                          onChange={(e) =>
                            setTxtFile(e.target.files?.[0] ?? null)
                          }
                          className="hidden"
                          id="txt-upload"
                        />
                        <label htmlFor="txt-upload" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-800 font-medium">
                            Click to upload
                          </span>
                          <span className="text-slate-500">
                            {" "}
                            or drag and drop
                          </span>
                        </label>
                        <p className="text-xs text-slate-500 mt-1">
                          TXT files only
                        </p>
                      </div>
                      {txtFile && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-800">
                            {txtFile.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setTxtFile(null)}
                            className="ml-auto h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={uploadTxtFile}
                      disabled={loading || !txtFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Upload pitch deck (PDF)
                      </label>
                      <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <Download className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) =>
                            setPdfFile(e.target.files?.[0] ?? null)
                          }
                          className="hidden"
                          id="pdf-upload"
                        />
                        <label htmlFor="pdf-upload" className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-800 font-medium">
                            Click to upload
                          </span>
                          <span className="text-slate-500">
                            {" "}
                            or drag and drop
                          </span>
                        </label>
                        <p className="text-xs text-slate-500 mt-1">
                          PDF files only
                        </p>
                      </div>
                      {pdfFile && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                          <Download className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-800">
                            {pdfFile.name}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPdfFile(null)}
                            className="ml-auto h-6 w-6 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 text-amber-800 text-sm">
                        <AlertCircle className="h-4 w-4" />
                        PDF processing may take some time depending on your
                        backend AI calls.
                      </div>
                    </div>
                    <Button
                      onClick={uploadPdfFile}
                      disabled={loading || !pdfFile}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Upload & Analyze PDF
                        </>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={clearAll}
                    disabled={loading}
                  >
                    Clear All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-1">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl h-fit">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-slate-600 text-center">
                      Analyzing your content...
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      This may take a few moments
                    </p>
                  </div>
                ) : result ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Analysis Complete
                      </span>
                    </div>

                    {result.transcript && result.analysis ? (
                      <>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">
                            Transcript:
                          </h4>
                          <div className="bg-slate-50 p-3 rounded-lg border text-xs max-h-32 overflow-y-auto">
                            <pre className="whitespace-pre-wrap">
                              {result.transcript}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-2">
                            Analysis:
                          </h4>
                          <div className="bg-slate-100 p-3 rounded-lg border text-xs max-h-64 overflow-y-auto">
                            <pre className="whitespace-pre-wrap">
                              {JSON.stringify(result.analysis, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-slate-100 p-3 rounded-lg border text-xs max-h-64 overflow-y-auto">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 mb-2">No analysis yet</p>
                    <p className="text-xs text-slate-400">
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
