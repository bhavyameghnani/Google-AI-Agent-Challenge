import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  User,
  TrendingUp,
  UserPlus,
  Users,
  ExternalLink,
} from "lucide-react";

const PeopleTab = ({ company }) => {
  // Defensive: Handle both old malformed structure (company.data.data) and new correct structure (company.data)
  const companyData = company?.data?.data || company?.data || {};
  const peopleData = companyData.people_data || {};

  return (
    <div className="space-y-6">
      {peopleData.key_people && peopleData.key_people.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Key Leadership
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {peopleData.key_people.map((person, index) => (
                <div
                  key={index}
                  className="flex gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-6 w-6 text-gray-500" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-lg">{person.name}</h4>
                      {person.source_url && (
                        <ExternalLink
                          className="h-4 w-4 text-gray-400 cursor-pointer hover:text-blue-600"
                          onClick={() =>
                            window.open(person.source_url, "_blank")
                          }
                        />
                      )}
                    </div>

                    <p className="text-blue-600 font-medium mb-2">
                      {person.role}
                    </p>

                    <p className="text-gray-700 text-sm leading-relaxed">
                      {person.background}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {peopleData.employee_growth_rate && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Employee Growth Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold text-green-700 mb-2">
                {peopleData.employee_growth_rate}
              </p>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-purple-600" />
              Current Headcount
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold text-purple-700">
              {companyData.company_info?.employee_count?.value || "N/A"}
            </p>
            {companyData.company_info?.employee_count?.source_name && (
              <p className="text-xs text-gray-500 mt-1">
                Source: {companyData.company_info.employee_count.source_name}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {peopleData.hiring_trends && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Hiring Trends & Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed">
              {peopleData.hiring_trends}
            </p>
          </CardContent>
        </Card>
      )}

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="text-green-800">Team Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {peopleData.key_people?.length || 0}
              </div>
              <div className="text-green-600">Key Leaders</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {companyData.company_info?.employee_count?.value || "N/A"}
              </div>
              <div className="text-green-600">Total Employees</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-700">
                {companyData.company_info?.year_founded
                  ? new Date().getFullYear() -
                    companyData.company_info.year_founded
                  : "N/A"}
              </div>
              <div className="text-green-600">Years Operating</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PeopleTab;
