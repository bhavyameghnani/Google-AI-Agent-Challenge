import React from 'react';
import { ExternalLink } from 'lucide-react';

export function CompanyInfoSection({ data, onChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Company Information</h2>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name
            </label>
            <input
              type="text"
              value={data.company_name}
              onChange={(e) => onChange({ ...data, company_name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website URL
            </label>
            <div className="relative">
              <input
                type="text"
                value={data.website_url}
                onChange={(e) => onChange({ ...data, website_url: e.target.value })}
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {data.website_url && (
                <a
                  href={`https://${data.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headquarters Location
            </label>
            <input
              type="text"
              value={data.headquarters_location}
              onChange={(e) => onChange({ ...data, headquarters_location: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Year Founded
            </label>
            <input
              type="number"
              value={data.year_founded}
              onChange={(e) => onChange({ ...data, year_founded: parseInt(e.target.value) })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Type
            </label>
            <select
              value={data.company_type}
              onChange={(e) => onChange({ ...data, company_type: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Industry Sector
            </label>
            <input
              type="text"
              value={data.industry_sector}
              onChange={(e) => onChange({ ...data, industry_sector: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Model
          </label>
          <textarea
            value={data.business_model}
            onChange={(e) => onChange({ ...data, business_model: e.target.value })}
            rows={2}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Company Description
          </label>
          <textarea
            value={data.company_description}
            onChange={(e) => onChange({ ...data, company_description: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Company Stage
            </label>
            <input
              type="text"
              placeholder="Value"
              value={data.company_stage.value}
              onChange={(e) =>
                onChange({
                  ...data,
                  company_stage: { ...data.company_stage, value: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="Source URL (optional)"
              value={data.company_stage.source_url || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  company_stage: { ...data.company_stage, source_url: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Employee Count
            </label>
            <input
              type="text"
              placeholder="Value"
              value={data.employee_count.value}
              onChange={(e) =>
                onChange({
                  ...data,
                  employee_count: { ...data.employee_count, value: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <input
              type="text"
              placeholder="Source URL (optional)"
              value={data.employee_count.source_url || ''}
              onChange={(e) =>
                onChange({
                  ...data,
                  employee_count: { ...data.employee_count, source_url: e.target.value },
                })
              }
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
}