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
  // --- FactCheckV2 Results Rendering ---
  const factCheckV2 = result?.fact_check;
  const renderFactCheckV2 = () => {
    if (!factCheckV2) return null;
    return (
      <div className="mb-8 p-6 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3 mb-2">
          <span className="font-bold text-lg">Fact Check</span>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${factCheckV2.verdict === 'True' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {factCheckV2.verdict}
          </span>
          {factCheckV2.confidence_score !== undefined && (
            <span className="ml-2 text-xs text-gray-500">Confidence: {(factCheckV2.confidence_score * 100).toFixed(0)}%</span>
          )}
        </div>
        <div className="mb-2">
          <span className="font-medium">Statement Checked:</span> {factCheckV2.statement_checked}
        </div>
        <div className="mb-2">
          <span className="font-medium">Reasoning:</span> {factCheckV2.reasoning}
        </div>
        {factCheckV2.correction_if_false && (
          <div className="mb-2">
            <span className="font-medium">Correction:</span> {factCheckV2.correction_if_false}
          </div>
        )}
        {factCheckV2.evidence_sources && factCheckV2.evidence_sources.length > 0 && (
          <div>
            <div className="font-medium mb-1">Evidence Sources:</div>
            <ul className="space-y-2">
              {factCheckV2.evidence_sources.map((src, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="inline-block w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-center">{idx + 1}</span>
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{src.source_name || src.url}</a>
                  <span className="text-xs text-gray-500">{src.url && (() => { try { return new URL(src.url).hostname; } catch { return ''; } })()}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };
// ...existing code continues...
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

  // If there's no analysis data, only return early when there's also no fact-check
  // report. This lets the fact-check UI render independently without changing
  // the existing pitch-deck analysis UI.
  if ((!analysisData || analysisData.length === 0) && !result?._fact_check) {
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

  // --- Fact-check Results Rendering ---
  const factCheckClaims = result?.claims;

  // Map verdicts to True/False for display
  const verdictDisplayMap = {
    Supported: 'True',
    Contradicted: 'False',
    'Supported by evidence': 'True',
    'Partially Supported': 'Partially Supported',
    Unsubstantiated: 'Unsubstantiated',
    default: '',
  };
  const verdictColorMap = {
    True: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    False: 'bg-red-50 text-red-700 border-red-200',
    Unsubstantiated: 'bg-amber-50 text-amber-700 border-amber-200',
    'Partially Supported': 'bg-blue-50 text-blue-700 border-blue-200',
    default: 'bg-slate-50 text-slate-700 border-slate-200',
  };
  const verdictIconMap = {
    True: '✓',
    False: '✗',
    Unsubstantiated: '?',
    'Partially Supported': '~',
    default: '•',
  };

  // Render fact-check claims if present
  const renderFactCheck = () => {
    if (!factCheckClaims || !Array.isArray(factCheckClaims) || factCheckClaims.length === 0) return null;
    
    // Count verdicts for summary
    const verdictCounts = factCheckClaims.reduce((acc, item) => {
      const verdictRaw = item.verdict || 'Unsubstantiated';
      const verdict = verdictDisplayMap[verdictRaw] || verdictRaw;
      acc[verdict] = (acc[verdict] || 0) + 1;
      return acc;
    }, {});

    return (
      <div className="mb-8">
        {/* Summary Card */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                <Info className="h-5 w-5 text-white" />
              </div>
              Fact-Check Results
            </h3>
            <Badge variant="secondary" className="text-base px-4 py-2">
              {factCheckClaims.length} {factCheckClaims.length === 1 ? 'Claim' : 'Claims'} Verified
            </Badge>
          </div>
          
          {/* Verdict Summary */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(verdictCounts).map(([verdict, count]) => {
              const colorClass = verdictColorMap[verdict] || verdictColorMap.default;
              const icon = verdictIconMap[verdict] || verdictIconMap.default;
              return (
                <div key={verdict} className={`flex items-center gap-2 px-4 py-2 rounded-full border ${colorClass}`}>
                  <span className="font-bold text-lg">{icon}</span>
                  <span className="font-semibold">{count}</span>
                  <span className="text-sm">{verdict}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Individual Claims */}
        <div className="space-y-4">
          {factCheckClaims.map((item, idx) => {
            const verdictRaw = item.verdict || 'Unsubstantiated';
            const verdict = verdictDisplayMap[verdictRaw] || verdictRaw;
            const verdictColor = verdictColorMap[verdict] || verdictColorMap.default;
            const verdictIcon = verdictIconMap[verdict] || verdictIconMap.default;
            
            // Extract claim data from various possible structures
            const claim = item.claim || {};
            const claimText = claim.text || item.claim_text || item.text || `Claim ${claim.id || idx + 1}`;
            const claimId = claim.id || item.claim_id || `C${idx + 1}`;
            
            // Additional claim metadata
            const normalizedField = claim.normalized_field || item.normalized_field || null;
            const extractedValue = claim.extracted_value || item.extracted_value || null;
            const location = claim.location || item.location || null;
            const context = item.context || claim.context || null;
            const reasoning = item.reasoning || null;
            const confidence = item.confidence || null;
            
            // Evidence handling - support multiple formats
            const evidenceItems = Array.isArray(item.evidences) ? item.evidences : 
                                 Array.isArray(item.evidence_items) ? item.evidence_items :
                                 Array.isArray(item.supporting_evidence) ? item.supporting_evidence.map(url => ({url})) : [];
            
            // Corrected information
            const correctedValue = item.corrected_value || item.corrected_claim || null;
            
            return (
              <div key={idx} className="bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                {/* Claim Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <Badge variant="outline" className="text-xs font-mono border-gray-300">
                          {claimId}
                        </Badge>
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-bold border-2 ${verdictColor}`}>
                          <span className="text-lg">{verdictIcon}</span>
                          {verdict}
                        </div>
                        {normalizedField && (
                          <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-700 border-purple-300">
                            {normalizedField.replace(/_/g, ' ')}
                          </Badge>
                        )}
                      </div>
                      <div className="text-base font-semibold text-gray-900 leading-relaxed">
                        {claimText}
                      </div>
                      
                      {/* Metadata row */}
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-600">
                        {extractedValue && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Extracted:</span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded font-mono">
                              {extractedValue}
                            </span>
                          </div>
                        )}
                        {location && (
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Source:</span>
                            <span className="text-gray-700">{location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {typeof confidence === 'number' && (
                      <div className="flex-shrink-0 text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round(confidence * 100)}%
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">
                          Confidence
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Claim Body */}
                <div className="px-6 py-4 space-y-4">
                  {/* Context */}
                  {context && (
                    <div className="bg-slate-50 border-l-4 border-slate-400 px-4 py-3 rounded-r">
                      <div className="text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1">
                        Context
                      </div>
                      <div className="text-sm text-slate-800 leading-relaxed italic">
                        "{context}"
                      </div>
                    </div>
                  )}
                  
                  {/* Reasoning */}
                  {reasoning && (
                    <div className="bg-blue-50 border-l-4 border-blue-400 px-4 py-3 rounded-r">
                      <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mb-1">
                        Analysis
                      </div>
                      <div className="text-sm text-blue-900 leading-relaxed">
                        {reasoning}
                      </div>
                    </div>
                  )}

                  {/* Evidence Sources */}
                  {evidenceItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Evidence Sources ({evidenceItems.length})
                        </span>
                      </div>
                      <div className="space-y-3">
                        {evidenceItems.map((ev, j) => {
                          // Handle both object and string evidence formats
                          const evidenceUrl = typeof ev === 'string' ? ev : (ev.url || null);
                          const evidenceTitle = typeof ev === 'string' ? ev : (ev.title || evidenceUrl || 'Evidence');
                          const evidenceSnippet = typeof ev === 'object' ? (ev.snippet || null) : null;
                          
                          // Extract domain safely
                          let evidenceSource = '';
                          if (typeof ev === 'object') {
                            evidenceSource = ev.source || ev.domain || '';
                          }
                          if (!evidenceSource && evidenceUrl && typeof evidenceUrl === 'string') {
                            try {
                              evidenceSource = new URL(evidenceUrl).hostname.replace('www.', '');
                            } catch (e) {
                              evidenceSource = '';
                            }
                          }
                          
                          const publishedDate = typeof ev === 'object' && ev.published_date ? 
                            new Date(ev.published_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : null;
                          
                          return (
                            <div key={j} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg border border-slate-200 p-4 hover:border-blue-300 transition-colors">
                              <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {j + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  {evidenceUrl && typeof evidenceUrl === 'string' && evidenceUrl.startsWith('http') ? (
                                    <a 
                                      href={evidenceUrl} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      className="text-sm font-semibold text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 break-words"
                                    >
                                      {evidenceTitle}
                                    </a>
                                  ) : (
                                    <span className="text-sm font-semibold text-gray-700 break-words">
                                      {evidenceTitle}
                                    </span>
                                  )}
                                  
                                  {evidenceSnippet && (
                                    <div className="text-sm text-gray-600 mt-2 leading-relaxed italic">
                                      "{evidenceSnippet}"
                                    </div>
                                  )}
                                  
                                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                    {evidenceSource && (
                                      <span className="px-2 py-1 bg-white rounded border border-gray-200 font-medium">
                                        {evidenceSource}
                                      </span>
                                    )}
                                    {publishedDate && (
                                      <span className="flex items-center gap-1">
                                        <span>•</span>
                                        <span>{publishedDate}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Corrected Value */}
                  {correctedValue && (
                    <div className="bg-amber-50 border-l-4 border-amber-400 px-4 py-3 rounded-r">
                      <div className="text-xs font-semibold text-amber-700 uppercase tracking-wide mb-1">
                        Corrected Information
                      </div>
                      <div className="text-sm font-medium text-amber-900">
                        {correctedValue}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Render FactCheckV2 if present */}
      {renderFactCheckV2()}
      {/* Render classic fact-check claims if present */}
      {renderFactCheck()}
      {/* Fact-check status */}
      {result?._fact_check ? (
        <div className="mb-2">
          <span className="text-green-700 font-semibold">Fact-check successful</span>
        </div>
      ) : (
        <div className="mb-2">
          <span className="text-red-700 font-semibold">Fact-check failed or no claims found</span>
        </div>
      )}

      {/* Fact-check results (if any) */}
      {result?._fact_check && result.results && Array.isArray(result.results) && (
        <div>
          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Info className="h-4 w-4 text-slate-600" /> Fact-check Results
          </h3>
          <div className="space-y-4">
            {result.results.map((r, i) => {
              // support variations in shape: r.evidence_items (objects) or r.supporting_evidence (urls)
              const evidenceItems = Array.isArray(r.evidence_items)
                ? r.evidence_items
                : Array.isArray(r.supporting_evidence)
                ? r.supporting_evidence.map((u) => ({ url: u, title: u }))
                : [];

              // friendly verdict label and color
              const verdict = r.verdict || "Unsubstantiated";
              const verdictColor =
                verdict === "Supported"
                  ? "text-emerald-700 bg-emerald-50"
                  : verdict === "Contradicted"
                  ? "text-red-700 bg-red-50"
                  : "text-amber-700 bg-amber-50";

              const confidence = typeof r.confidence === "number" ? Math.round(r.confidence * 100) : (r.confidence ? r.confidence : "-");

              return (
                <div key={i} className="p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">Claim</div>
                      <div className="text-base font-medium text-foreground">{r.claim_text || `Claim ${r.claim_id}`}</div>
                      {r.context && (
                        <div className="text-sm text-muted-foreground mt-2">{r.context}</div>
                      )}
                    </div>

                    <div className="flex-shrink-0 text-right">
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${verdictColor}`}>
                        {verdict}
                      </div>
                      <div className="text-xs text-muted-foreground mt-2">Confidence: {typeof confidence === 'number' ? `${confidence}%` : confidence}</div>
                    </div>
                  </div>

                  {evidenceItems.length > 0 && (
                    <div className="mt-3">
                      <div className="text-xs text-muted-foreground mb-2">Evidence</div>
                      <div className="space-y-2">
                        {evidenceItems.map((ev, j) => (
                          <div key={j} className="p-3 bg-slate-50 rounded-md border border-slate-100">
                            <a href={ev.url || ev} target="_blank" rel="noreferrer" className="text-sm font-medium text-blue-600 underline">
                              {ev.title || ev.url || ev}
                            </a>
                            {ev.snippet && <div className="text-sm text-muted-foreground mt-1">{ev.snippet}</div>}
                            <div className="text-xs text-muted-foreground mt-1">{ev.source || ev.domain || (ev.url && new URL(ev.url).hostname) || ""} {ev.published_date ? ` • ${new Date(ev.published_date).toLocaleDateString()}` : ""}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {r.corrected_claim && (
                    <div className="mt-3 text-sm text-slate-700">Corrected: <span className="font-medium">{r.corrected_claim}</span></div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
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
