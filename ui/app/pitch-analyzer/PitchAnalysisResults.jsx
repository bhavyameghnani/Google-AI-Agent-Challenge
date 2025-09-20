import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Target,
  Lightbulb,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Eye,
  User,
  Briefcase,
  ChevronRight,
  Star,
  Info,
  FileText,
} from "lucide-react";

const PitchAnalysisResults = ({ result }) => {
  // Handle different response formats:
  // 1. Direct array from analyze-text/audio/file/video endpoints
  // 2. Nested analysis structure
  // 3. Pitch deck analysis object from analyze-pitch-deck endpoint
  let analysisData = [];
  let isPitchDeckAnalysis = false;

  if (Array.isArray(result)) {
    analysisData = result;
  } else if (result?.analysis) {
    if (Array.isArray(result.analysis)) {
      analysisData = result.analysis;
    } else if (
      typeof result.analysis === "object" &&
      !Array.isArray(result.analysis)
    ) {
      // This is the pitch deck analysis format
      analysisData = [result.analysis];
      isPitchDeckAnalysis = true;
    }
  }

  if (!analysisData || analysisData.length === 0) {
    return (
      <div className="text-center py-8">
        <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground mb-2">No analysis data available</p>
        <p className="text-xs text-muted-foreground">
          The response format may be different than expected
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analysis Header */}
      <div className="flex items-center gap-2 text-green-600 mb-6">
        <Star className="h-5 w-5" />
        <span className="font-semibold">Analysis Complete</span>
        <Badge variant="secondary" className="ml-2">
          {isPitchDeckAnalysis
            ? "Pitch Deck"
            : `${analysisData.length} ${
                analysisData.length === 1 ? "Company" : "Companies"
              }`}
        </Badge>
      </div>

      {/* Company Analysis Cards */}
      {analysisData.map((company, index) => (
        <Card key={index} className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-blue-600" />
                <div>
                  <CardTitle className="text-xl text-foreground">
                    {company["company / startup_name"] ||
                      company.company_name ||
                      (isPitchDeckAnalysis
                        ? "Pitch Deck Analysis"
                        : `Company ${index + 1}`)}
                  </CardTitle>
                  {company.summary && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {company.summary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Render pitch deck analysis sections if it's that format */}
            {isPitchDeckAnalysis && (
              <div className="space-y-6">
                {Object.entries(company).map(([sectionKey, sectionContent]) => {
                  if (!sectionContent || typeof sectionContent !== "string")
                    return null;

                  const sectionTitle = sectionKey
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  // Map sections to appropriate colors and icons
                  const getSectionStyle = (key) => {
                    switch (key.toLowerCase()) {
                      case "problem":
                        return {
                          bgColor: "bg-red-50",
                          borderColor: "border-red-200",
                          textColor: "text-red-800",
                          icon: <Target className="h-4 w-4 text-red-600" />,
                        };
                      case "solution":
                        return {
                          bgColor: "bg-green-50",
                          borderColor: "border-green-200",
                          textColor: "text-green-800",
                          icon: (
                            <Lightbulb className="h-4 w-4 text-green-600" />
                          ),
                        };
                      case "market_size":
                      case "market_validation":
                      case "market_adoption":
                        return {
                          bgColor: "bg-blue-50",
                          borderColor: "border-blue-200",
                          textColor: "text-blue-800",
                          icon: (
                            <TrendingUp className="h-4 w-4 text-blue-600" />
                          ),
                        };
                      case "financials":
                      case "business_model":
                        return {
                          bgColor: "bg-emerald-50",
                          borderColor: "border-emerald-200",
                          textColor: "text-emerald-800",
                          icon: (
                            <DollarSign className="h-4 w-4 text-emerald-600" />
                          ),
                        };
                      case "team":
                        return {
                          bgColor: "bg-purple-50",
                          borderColor: "border-purple-200",
                          textColor: "text-purple-800",
                          icon: <Users className="h-4 w-4 text-purple-600" />,
                        };
                      case "competition":
                        return {
                          bgColor: "bg-orange-50",
                          borderColor: "border-orange-200",
                          textColor: "text-orange-800",
                          icon: (
                            <AlertTriangle className="h-4 w-4 text-orange-600" />
                          ),
                        };
                      case "product":
                        return {
                          bgColor: "bg-indigo-50",
                          borderColor: "border-indigo-200",
                          textColor: "text-indigo-800",
                          icon: (
                            <Briefcase className="h-4 w-4 text-indigo-600" />
                          ),
                        };
                      case "press":
                        return {
                          bgColor: "bg-yellow-50",
                          borderColor: "border-yellow-200",
                          textColor: "text-yellow-800",
                          icon: (
                            <FileText className="h-4 w-4 text-yellow-600" />
                          ),
                        };
                      case "user_testimonials":
                        return {
                          bgColor: "bg-pink-50",
                          borderColor: "border-pink-200",
                          textColor: "text-pink-800",
                          icon: <Star className="h-4 w-4 text-pink-600" />,
                        };
                      default:
                        return {
                          bgColor: "bg-slate-50",
                          borderColor: "border-slate-200",
                          textColor: "text-slate-800",
                          icon: <Info className="h-4 w-4 text-slate-600" />,
                        };
                    }
                  };

                  const style = getSectionStyle(sectionKey);

                  // Parse the content to handle bullet points and formatting
                  const formatContent = (content) => {
                    // Split by newlines and process each line
                    const lines = content.split("\n");
                    const formatted = [];

                    lines.forEach((line, index) => {
                      if (!line.trim()) return;

                      // Handle bullet points
                      if (line.trim().startsWith("*")) {
                        const bulletContent = line
                          .replace(/^\s*\*\s*/, "")
                          .trim();
                        if (bulletContent) {
                          formatted.push(
                            <div
                              key={index}
                              className="flex items-start gap-2 mb-2"
                            >
                              <ChevronRight className="h-3 w-3 mt-1 flex-shrink-0 text-current opacity-70" />
                              <span>{bulletContent}</span>
                            </div>
                          );
                        }
                      } else {
                        // Regular text
                        formatted.push(
                          <p key={index} className="mb-2 last:mb-0">
                            {line.trim()}
                          </p>
                        );
                      }
                    });

                    return formatted;
                  };

                  return (
                    <div
                      key={sectionKey}
                      className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                    >
                      <div
                        className={`px-4 py-3 ${style.bgColor} border-b ${style.borderColor}`}
                      >
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          {style.icon}
                          {sectionTitle}
                        </h4>
                      </div>
                      <div className="p-4">
                        <div
                          className={`${style.textColor} text-sm leading-relaxed`}
                        >
                          {formatContent(sectionContent)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Regular company analysis format (original) */}
            {!isPitchDeckAnalysis && (
              <>
                {/* Summary Section */}
                {company.summary && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Executive Summary
                    </h4>
                    <p className="text-blue-800 text-sm leading-relaxed">
                      {company.summary}
                    </p>
                  </div>
                )}

                {/* Founders Section */}
                {company.founders &&
                  Array.isArray(company.founders) &&
                  company.founders.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        Founders & Leadership
                      </h4>
                      <div className="grid gap-3">
                        {company.founders.map((founder, founderIndex) => (
                          <div
                            key={founderIndex}
                            className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200"
                          >
                            <User className="h-5 w-5 text-purple-600 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-purple-900">
                                  {founder.name}
                                </span>
                                {founder.role && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-purple-300 text-purple-700"
                                  >
                                    {founder.role}
                                  </Badge>
                                )}
                              </div>
                              {founder.background && (
                                <p className="text-sm text-purple-800">
                                  {founder.background}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Problem & Solution */}
                <div className="grid md:grid-cols-2 gap-4">
                  {company.problem_statement && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-600" />
                        Problem Statement
                      </h4>
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <p className="text-red-800 text-sm leading-relaxed">
                          {company.problem_statement}
                        </p>
                      </div>
                    </div>
                  )}

                  {company.solution && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-green-600" />
                        Solution
                      </h4>
                      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-green-800 text-sm leading-relaxed">
                          {company.solution}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Funding Information */}
                {company.funding && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      Funding Information
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {company.funding.raised && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="text-sm text-green-700 font-medium">
                            Amount Raised
                          </div>
                          <div className="text-lg font-bold text-green-900">
                            ${company.funding.raised}
                          </div>
                        </div>
                      )}
                      {company.funding.seeking && (
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="text-sm text-orange-700 font-medium">
                            Currently Seeking
                          </div>
                          <div className="text-lg font-bold text-orange-900">
                            ${company.funding.seeking}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Market Information */}
                {company.market && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      Market & Traction
                    </h4>
                    <div className="space-y-3">
                      {company.market.size && (
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-sm text-blue-700 font-medium mb-1">
                            Market Size
                          </div>
                          <p className="text-blue-800 text-sm">
                            {company.market.size}
                          </p>
                        </div>
                      )}
                      {company.market.traction && (
                        <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                          <div className="text-sm text-indigo-700 font-medium mb-1">
                            Traction
                          </div>
                          <p className="text-indigo-800 text-sm">
                            {company.market.traction}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Risks */}
                {company.risks &&
                  Array.isArray(company.risks) &&
                  company.risks.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        Risk Assessment
                      </h4>
                      <div className="space-y-2">
                        {company.risks.map((risk, riskIndex) => (
                          <div
                            key={riskIndex}
                            className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                          >
                            <ChevronRight className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <p className="text-red-800 text-sm">{risk}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Key Insights */}
                {company.key_insights &&
                  Array.isArray(company.key_insights) &&
                  company.key_insights.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-indigo-600" />
                        Key Insights
                      </h4>
                      <div className="space-y-2">
                        {company.key_insights.map((insight, insightIndex) => (
                          <div
                            key={insightIndex}
                            className="flex items-start gap-3 p-3 bg-indigo-50 rounded-lg border border-indigo-200"
                          >
                            <ChevronRight className="h-4 w-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                            <p className="text-indigo-800 text-sm">{insight}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Show transcript if available */}
      {result?.transcript && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-5 w-5 text-gray-600" />
              Transcript
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg border max-h-40 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-700">
                {result.transcript}
              </pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PitchAnalysisResults;
