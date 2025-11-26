import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Users,
  Newspaper,
  Link,
  Calendar,
  ExternalLink,
} from "lucide-react";

const NewsTab = ({ company }) => {
  // Defensive: Handle both old malformed structure (company.data.data) and new correct structure (company.data)
  const companyData = company?.data?.data || company?.data || {};
  const reputationData = companyData.reputation_data || {};

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Brand Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {reputationData.brand_sentiment}
          </p>
        </CardContent>
      </Card>

      {reputationData.customer_satisfaction && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-green-600" />
              Customer Satisfaction
              {reputationData.customer_satisfaction?.source_url && (
                <ExternalLink
                  className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    window.open(
                      reputationData.customer_satisfaction.source_url,
                      "_blank"
                    )
                  }
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-green-700 mb-2">
              {reputationData.customer_satisfaction.value ||
                reputationData.customer_satisfaction}
            </p>
            {reputationData.customer_satisfaction?.source_name && (
              <p className="text-xs text-gray-500">
                Source: {reputationData.customer_satisfaction.source_name}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {reputationData.notable_news &&
        reputationData.notable_news.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Newspaper className="h-5 w-5" />
                Recent News & Media Coverage
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reputationData.notable_news.map((newsItem, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <Newspaper className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2 leading-tight">
                          {newsItem.headline}
                        </h4>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <span className="font-medium">Source:</span>
                            <span>{newsItem.source_name}</span>
                          </div>

                          {newsItem.date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>{newsItem.date}</span>
                            </div>
                          )}

                          <a
                            href={newsItem.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Read full article</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      {reputationData.partnerships &&
        reputationData.partnerships.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5 text-purple-600" />
                Strategic Partnerships
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {reputationData.partnerships.map((partnership, index) => (
                  <div
                    key={index}
                    className="p-3 bg-purple-50 rounded-lg border-l-4 border-purple-400"
                  >
                    <div className="flex items-start gap-2">
                      <Link className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">
                          {partnership.value || partnership}
                        </p>
                        {partnership.source_name && (
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs text-gray-500">
                              Source: {partnership.source_name}
                            </p>
                            {partnership.source_url && (
                              <ExternalLink
                                className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-600"
                                onClick={() =>
                                  window.open(partnership.source_url, "_blank")
                                }
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      <Card className="bg-gray-50 border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800">
            Media & Reputation Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {reputationData.notable_news?.length || 0}
              </div>
              <div className="text-gray-600">Recent News Articles</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {reputationData.partnerships?.length || 0}
              </div>
              <div className="text-gray-600">Strategic Partnerships</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-700">
                {reputationData.news_mentions_count || "N/A"}
              </div>
              <div className="text-gray-600">Total Mentions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewsTab;
