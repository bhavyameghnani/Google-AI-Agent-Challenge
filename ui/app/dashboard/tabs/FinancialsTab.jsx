import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  PieChart,
  BarChart3,
  ExternalLink,
  Calendar,
} from "lucide-react";

const FinancialsTab = ({ company }) => {
  // Defensive: Handle both old malformed structure (company.data.data) and new correct structure (company.data)
  const companyData = company?.data?.data || company?.data || {};
  const financialData = companyData.financial_data || {};

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                Total Funding
              </span>
              {financialData.total_equity_funding?.source_url && (
                <ExternalLink
                  className="h-3 w-3 text-gray-400 cursor-pointer"
                  onClick={() =>
                    window.open(
                      financialData.total_equity_funding.source_url,
                      "_blank"
                    )
                  }
                />
              )}
            </div>
            <p className="text-2xl font-bold mb-1">
              {financialData.total_equity_funding?.value || "N/A"}
            </p>
            {financialData.total_equity_funding?.source_name && (
              <p className="text-xs text-gray-500">
                Source: {financialData.total_equity_funding.source_name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Latest Round
              </span>
              {financialData.latest_funding_round?.source_url && (
                <ExternalLink
                  className="h-3 w-3 text-gray-400 cursor-pointer"
                  onClick={() =>
                    window.open(
                      financialData.latest_funding_round.source_url,
                      "_blank"
                    )
                  }
                />
              )}
            </div>
            <p className="text-2xl font-bold mb-1">
              {financialData.latest_funding_round?.value || "N/A"}
            </p>
            {financialData.latest_funding_round?.source_name && (
              <p className="text-xs text-gray-500">
                Source: {financialData.latest_funding_round.source_name}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <PieChart className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                Valuation
              </span>
              {financialData.valuation?.source_url && (
                <ExternalLink
                  className="h-3 w-3 text-gray-400 cursor-pointer"
                  onClick={() =>
                    window.open(financialData.valuation.source_url, "_blank")
                  }
                />
              )}
            </div>
            <p className="text-2xl font-bold mb-1">
              {financialData.valuation?.value || "N/A"}
            </p>
            {financialData.valuation?.source_name && (
              <p className="text-xs text-gray-500">
                Source: {financialData.valuation.source_name}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {financialData.revenue_growth_rate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Revenue Growth
              {financialData.revenue_growth_rate?.source_url && (
                <ExternalLink
                  className="h-4 w-4 text-gray-400 cursor-pointer"
                  onClick={() =>
                    window.open(
                      financialData.revenue_growth_rate.source_url,
                      "_blank"
                    )
                  }
                />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold mb-2">
              {financialData.revenue_growth_rate.value}
            </p>
            {financialData.revenue_growth_rate.source_name && (
              <p className="text-sm text-gray-500">
                Source: {financialData.revenue_growth_rate.source_name}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Financial Strength Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {financialData.financial_strength}
          </p>
        </CardContent>
      </Card>

      {financialData.key_investors &&
        financialData.key_investors.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Key Investors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {financialData.key_investors.map((investor, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-800">{investor}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">
              Data Information
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-blue-700">
            <div>
              <span className="font-medium">Last Updated:</span>{" "}
              {new Date(company.last_updated).toLocaleDateString()}
            </div>
            {/* <div>
              <span className="font-medium">Source:</span> {company.source}
            </div> */}
            {/* <div>
              <span className="font-medium">Cache Age:</span>{" "}
              {company.cache_age_days} days
            </div> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialsTab;
