import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Target, Award } from "lucide-react";

const InsightsTab = ({ company, competitors }) => {
  const competitorData = competitors.data.competitors;

  const getScoreColor = (score) => {
    if (score >= 900) return "text-green-600 bg-green-100";
    if (score >= 700) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Competitive Landscape Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Analysis of {competitorData.length} companies in the competitive
            landscape
          </p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-3 font-semibold">Company</th>
                  <th className="text-left p-3 font-semibold">Location</th>
                  <th className="text-left p-3 font-semibold">Stage</th>
                  <th className="text-left p-3 font-semibold">Total Funding</th>
                  <th className="text-left p-3 font-semibold">Last Funding</th>
                  <th className="text-center p-3 font-semibold">
                    Overall Score
                  </th>
                </tr>
              </thead>
              <tbody>
                {competitorData.map((competitor, index) => {
                  const avgScore = Math.round(
                    (competitor.evaluation_score.revenue_growth_score +
                      competitor.evaluation_score.financial_strength_score +
                      competitor.evaluation_score.industry_health_score +
                      competitor.evaluation_score.founder_background_score) /
                      4
                  );

                  return (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div className="font-semibold">
                          {competitor.competitor_name}
                        </div>
                      </td>
                      <td className="p-3 text-gray-600">
                        {competitor.location}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">{competitor.stage}</Badge>
                      </td>
                      <td className="p-3 font-medium">
                        {competitor.total_funding}
                      </td>
                      <td className="p-3 text-gray-600">
                        {competitor.last_funding}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreColor(
                            avgScore
                          )}`}
                        >
                          {avgScore}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Evaluation Score Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {competitorData.map((competitor, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold text-lg mb-3">
                  {competitor.competitor_name}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Revenue Growth
                    </div>
                    <div
                      className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                        competitor.evaluation_score.revenue_growth_score
                      )}`}
                    >
                      {competitor.evaluation_score.revenue_growth_score}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Financial Strength
                    </div>
                    <div
                      className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                        competitor.evaluation_score.financial_strength_score
                      )}`}
                    >
                      {competitor.evaluation_score.financial_strength_score}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Industry Health
                    </div>
                    <div
                      className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                        competitor.evaluation_score.industry_health_score
                      )}`}
                    >
                      {competitor.evaluation_score.industry_health_score}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">
                      Founder Background
                    </div>
                    <div
                      className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(
                        competitor.evaluation_score.founder_background_score
                      )}`}
                    >
                      {competitor.evaluation_score.founder_background_score}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-orange-600" />
            Market Position Ranking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {competitorData
              .map((competitor, index) => {
                const avgScore = Math.round(
                  (competitor.evaluation_score.revenue_growth_score +
                    competitor.evaluation_score.financial_strength_score +
                    competitor.evaluation_score.industry_health_score +
                    competitor.evaluation_score.founder_background_score) /
                    4
                );
                return { ...competitor, avgScore, originalIndex: index };
              })
              .sort((a, b) => b.avgScore - a.avgScore)
              .map((competitor, rank) => (
                <div
                  key={competitor.originalIndex}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                        rank === 0
                          ? "bg-yellow-500"
                          : rank === 1
                          ? "bg-gray-400"
                          : rank === 2
                          ? "bg-orange-600"
                          : "bg-gray-300"
                      }`}
                    >
                      {rank + 1}
                    </div>
                    <div>
                      <div className="font-semibold">
                        {competitor.competitor_name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {competitor.location}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-lg font-bold ${getScoreColor(
                        competitor.avgScore
                      )}`}
                    >
                      {competitor.avgScore}
                    </div>
                    <div className="text-sm text-gray-600">
                      {competitor.total_funding}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">
            Key Competitive Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {competitorData.length}
              </div>
              <div className="text-blue-600">Companies Analyzed</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {Math.round(
                  competitorData.reduce(
                    (sum, comp) =>
                      sum +
                      (comp.evaluation_score.revenue_growth_score +
                        comp.evaluation_score.financial_strength_score +
                        comp.evaluation_score.industry_health_score +
                        comp.evaluation_score.founder_background_score) /
                        4,
                    0
                  ) / competitorData.length
                )}
              </div>
              <div className="text-blue-600">Average Score</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {
                  competitorData.filter(
                    (comp) =>
                      (comp.evaluation_score.revenue_growth_score +
                        comp.evaluation_score.financial_strength_score +
                        comp.evaluation_score.industry_health_score +
                        comp.evaluation_score.founder_background_score) /
                        4 >=
                      900
                  ).length
                }
              </div>
              <div className="text-blue-600">Top Performers</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-700">
                {new Set(competitorData.map((comp) => comp.location)).size}
              </div>
              <div className="text-blue-600">Markets</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InsightsTab;
