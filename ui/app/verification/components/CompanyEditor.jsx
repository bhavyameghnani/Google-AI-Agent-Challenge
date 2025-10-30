import React, { useState } from "react";
import { ArrowLeft, Save, Info } from "lucide-react";
import { CompanyInfoSection } from "./editor/CompanyInfoSection";
import { FinancialDataSection } from "./editor/FinancialDataSection";
import { PeopleDataSection } from "./editor/PeopleDataSection";
import { MarketDataSection } from "./editor/MarketDataSection";
import { ReputationDataSection } from "./editor/ReputationDataSection";

export function CompanyEditor({ company, onBack, onSave }) {
  const [editedCompany, setEditedCompany] = useState(company);
  const [activeTab, setActiveTab] = useState("company");

  const tabs = [
    { id: "company", label: "Company Info" },
    { id: "financial", label: "Financial" },
    { id: "people", label: "People" },
    { id: "market", label: "Market" },
    { id: "reputation", label: "Reputation" },
  ];

  const handleSave = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/verified_company_data`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editedCompany),
        }
      );

      const data = await response.json();
      if (data.status === "success") {
        alert("Company saved to verified data successfully!");
        onSave(editedCompany);
      } else {
        alert("Failed to save company.");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving company.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {editedCompany.data.company_info.company_name}
                </h1>
                <p className="text-sm text-gray-500">
                  Last updated:{" "}
                  {new Date(editedCompany.last_updated).toLocaleDateString()}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>

          <div className="flex gap-2 mt-4 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-900">
            <p className="font-medium mb-1">Human-in-the-Loop Review</p>
            <p className="text-blue-700">
              Review and modify the extracted data. Add notes or reference URLs
              where needed to support your analysis.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {activeTab === "company" && (
            <CompanyInfoSection
              data={editedCompany.data.company_info}
              onChange={(companyInfo) =>
                setEditedCompany({
                  ...editedCompany,
                  data: { ...editedCompany.data, company_info: companyInfo },
                })
              }
            />
          )}

          {activeTab === "financial" && (
            <FinancialDataSection
              data={editedCompany.data.financial_data}
              onChange={(financialData) =>
                setEditedCompany({
                  ...editedCompany,
                  data: {
                    ...editedCompany.data,
                    financial_data: financialData,
                  },
                })
              }
            />
          )}

          {activeTab === "people" && (
            <PeopleDataSection
              data={editedCompany.data.people_data}
              onChange={(peopleData) =>
                setEditedCompany({
                  ...editedCompany,
                  data: { ...editedCompany.data, people_data: peopleData },
                })
              }
            />
          )}

          {activeTab === "market" && (
            <MarketDataSection
              data={editedCompany.data.market_data}
              onChange={(marketData) =>
                setEditedCompany({
                  ...editedCompany,
                  data: { ...editedCompany.data, market_data: marketData },
                })
              }
            />
          )}

          {activeTab === "reputation" && (
            <ReputationDataSection
              data={editedCompany.data.reputation_data}
              onChange={(reputationData) =>
                setEditedCompany({
                  ...editedCompany,
                  data: {
                    ...editedCompany.data,
                    reputation_data: reputationData,
                  },
                })
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
