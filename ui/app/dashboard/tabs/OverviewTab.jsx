import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BarChart3, Users, Globe } from "lucide-react";

const OverviewTab = ({ company }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-gray-600">
                Total Funding
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.financial_data.total_equity_funding?.value || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">
                Valuation
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.financial_data.valuation?.value || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">
                Employees
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.company_info.employee_count?.value || "N/A"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe className="h-4 w-4 text-orange-600" />
              <span className="text-sm font-medium text-gray-600">
                Market Size
              </span>
            </div>
            <p className="text-xl font-bold">
              {company.data.market_data.market_size?.value || "N/A"}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 leading-relaxed">
            {company.data.extraction_summary}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
