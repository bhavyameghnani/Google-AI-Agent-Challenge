import React from 'react';
import { Plus, Trash2 } from 'lucide-react';

export function MarketDataSection({ data, onChange }) {
  const addAdvantage = () => {
    onChange({
      ...data,
      competitive_advantages: [
        ...data.competitive_advantages,
        {
          value: '',
          source_url: null,
          source_name: null,
        },
      ],
    });
  };

  const removeAdvantage = (index) => {
    const newAdvantages = data.competitive_advantages.filter((_, i) => i !== index);
    onChange({ ...data, competitive_advantages: newAdvantages });
  };

  const updateAdvantage = (index, advantage) => {
    const newAdvantages = [...data.competitive_advantages];
    newAdvantages[index] = advantage;
    onChange({ ...data, competitive_advantages: newAdvantages });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Market Data</h2>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Market Size
              </label>
              <input
                type="text"
                placeholder="Value"
                value={data.market_size.value}
                onChange={(e) =>
                  onChange({
                    ...data,
                    market_size: { ...data.market_size, value: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Source URL (optional)"
                value={data.market_size.source_url || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    market_size: { ...data.market_size, source_url: e.target.value },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Competitive Landscape
              </label>
              <textarea
                placeholder="Value"
                value={data.competitive_landscape.value}
                onChange={(e) =>
                  onChange({
                    ...data,
                    competitive_landscape: {
                      ...data.competitive_landscape,
                      value: e.target.value,
                    },
                  })
                }
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              <input
                type="text"
                placeholder="Source URL (optional)"
                value={data.competitive_landscape.source_url || ''}
                onChange={(e) =>
                  onChange({
                    ...data,
                    competitive_landscape: {
                      ...data.competitive_landscape,
                      source_url: e.target.value,
                    },
                  })
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Market Position
            </label>
            <textarea
              value={data.market_position}
              onChange={(e) => onChange({ ...data, market_position: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product-Market Fit
            </label>
            <textarea
              value={data.product_market_fit}
              onChange={(e) => onChange({ ...data, product_market_fit: e.target.value })}
              rows={2}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Competitive Advantages</h3>
          <button
            onClick={addAdvantage}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Advantage
          </button>
        </div>

        <div className="space-y-4">
          {data.competitive_advantages.map((advantage, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <textarea
                  value={advantage.value}
                  onChange={(e) =>
                    updateAdvantage(index, { ...advantage, value: e.target.value })
                  }
                  placeholder="Describe the competitive advantage"
                  rows={2}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={() => removeAdvantage(index)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <input
                type="text"
                value={advantage.source_url || ''}
                onChange={(e) =>
                  updateAdvantage(index, { ...advantage, source_url: e.target.value })
                }
                placeholder="Source URL (optional)"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}