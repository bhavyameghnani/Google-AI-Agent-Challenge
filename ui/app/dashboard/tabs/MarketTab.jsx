import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  MapPin,
  BarChart3,
  Award,
  Target,
  TrendingUp,
  ExternalLink,
} from "lucide-react";

const MarketTab = ({ company }) => {
  const marketData = company.data.market_data;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Market Size
              {marketData.market_size?.source_url && (
                <ExternalLink
                  className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                  onClick={() =>
                    window.open(marketData.market_size.source_url, "_blank")
                  }
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">
              {marketData.market_size?.value || "N/A"}
            </p>
            {marketData.market_size?.source_name && (
              <p className="text-xs text-gray-500">
                Source: {marketData.market_size.source_name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Market Position
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {marketData.market_position}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Competitive Landscape
            {marketData.competitive_landscape?.source_url && (
              <ExternalLink
                className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                onClick={() =>
                  window.open(
                    marketData.competitive_landscape.source_url,
                    "_blank"
                  )
                }
              />
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {marketData.competitive_landscape?.value ||
              marketData.competitive_landscape}
          </p>
          {marketData.competitive_landscape?.source_name && (
            <p className="text-xs text-gray-500 mt-2">
              Source: {marketData.competitive_landscape.source_name}
            </p>
          )}
        </CardContent>
      </Card>

      {marketData.competitive_advantages &&
        marketData.competitive_advantages.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-orange-600" />
                Competitive Advantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {marketData.competitive_advantages.map((advantage, index) => (
                  <div
                    key={index}
                    className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400"
                  >
                    <div className="flex items-start gap-2">
                      <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-800 leading-relaxed">
                          {advantage.value || advantage}
                        </p>
                        {advantage.source_name && (
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs text-gray-500">
                              Source: {advantage.source_name}
                            </p>
                            {advantage.source_url && (
                              <ExternalLink
                                className="h-3 w-3 text-gray-400 cursor-pointer hover:text-blue-600"
                                onClick={() =>
                                  window.open(advantage.source_url, "_blank")
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

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600" />
            Product-Market Fit Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {marketData.product_market_fit}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-800">
            Market Analysis Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-blue-700">Industry:</span>
              <p className="text-blue-600">
                {company.data.company_info.industry_sector}
              </p>
            </div>
            <div>
              <span className="font-semibold text-blue-700">
                Business Model:
              </span>
              <p className="text-blue-600">
                {company.data.company_info.business_model}
              </p>
            </div>
            <div>
              <span className="font-semibold text-blue-700">
                Competitive Advantages:
              </span>
              <p className="text-blue-600">
                {marketData.competitive_advantages?.length || 0} identified
              </p>
            </div>
            <div>
              <span className="font-semibold text-blue-700">
                Market Position:
              </span>
              <p className="text-blue-600">
                {marketData.market_position ? "Analyzed" : "Pending analysis"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketTab;
