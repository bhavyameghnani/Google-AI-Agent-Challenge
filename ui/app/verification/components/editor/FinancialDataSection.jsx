import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function FinancialDataSection({ data, onChange }) {
  const addInvestor = () => {
    onChange({
      ...data,
      key_investors: [...data.key_investors, ''],
    });
  };

  const removeInvestor = (index) => {
    const newInvestors = data.key_investors.filter((_, i) => i !== index);
    onChange({ ...data, key_investors: newInvestors });
  };

  const updateInvestor = (index, value) => {
    const newInvestors = [...data.key_investors];
    newInvestors[index] = value;
    onChange({ ...data, key_investors: newInvestors });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Financial Data</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Total Equity Funding
              </label>
              <input
                type="text"
                placeholder="Value"
                value={data.total_equity_funding.value}
                onChange={(e) =>
                  onChange({
                    ...data,
                    total_equity_funding: { ...data.total_equity_funding, value: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Source URL (optional)"
                value={data.total_equity_funding.source_url || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    total_equity_funding: { ...data.total_equity_funding, source_url: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Latest Funding Round
              </label>
              <input
                type="text"
                placeholder="Value"
                value={data.latest_funding_round.value}
                onChange={(e) =>
                  onChange({
                    ...data,
                    latest_funding_round: { ...data.latest_funding_round, value: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Source URL (optional)"
                value={data.latest_funding_round.source_url || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    latest_funding_round: { ...data.latest_funding_round, source_url: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Valuation
              </label>
              <input
                type="text"
                placeholder="Value"
                value={data.valuation.value}
                onChange={(e) =>
                  onChange({
                    ...data,
                    valuation: { ...data.valuation, value: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Source URL (optional)"
                value={data.valuation.source_url || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    valuation: { ...data.valuation, source_url: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Revenue Growth Rate
              </label>
              <input
                type="text"
                placeholder="Value"
                value={data.revenue_growth_rate.value}
                onChange={(e) =>
                  onChange({
                    ...data,
                    revenue_growth_rate: { ...data.revenue_growth_rate, value: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Source URL (optional)"
                value={data.revenue_growth_rate.source_url || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    revenue_growth_rate: { ...data.revenue_growth_rate, source_url: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Financial Strength
            </label>
            <textarea
              value={data.financial_strength}
              onChange={(e) => onChange({ ...data, financial_strength: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Key Investors</h3>
          <button
            onClick={addInvestor}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Investor
          </button>
        </div>

        <div className="space-y-3">
          {data.key_investors.map((investor, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={investor}
                onChange={(e) => updateInvestor(index, e.target.value)}
                placeholder="Investor name"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <button
                onClick={() => removeInvestor(index)}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}