import React from 'react';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

export function ReputationDataSection({ data, onChange }) {
  const addNews = () => {
    onChange({
      ...data,
      notable_news: [
        ...data.notable_news,
        {
          headline: '',
          source_url: '',
          source_name: '',
          date: new Date().toISOString().split('T')[0],
        },
      ],
    });
  };

  const removeNews = (index) => {
    const newNews = data.notable_news.filter((_, i) => i !== index);
    onChange({ ...data, notable_news: newNews });
  };

  const updateNews = (index, news) => {
    const newNews = [...data.notable_news];
    newNews[index] = news;
    onChange({ ...data, notable_news: newNews });
  };

  const addPartnership = () => {
    onChange({
      ...data,
      partnerships: [
        ...data.partnerships,
        {
          value: '',
          source_url: null,
          source_name: null,
        },
      ],
    });
  };

  const removePartnership = (index) => {
    const newPartnerships = data.partnerships.filter((_, i) => i !== index);
    onChange({ ...data, partnerships: newPartnerships });
  };

  const updatePartnership = (index, partnership) => {
    const newPartnerships = [...data.partnerships];
    newPartnerships[index] = partnership;
    onChange({ ...data, partnerships: newPartnerships });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Reputation Data</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Sentiment
          </label>
          <textarea
            value={data.brand_sentiment}
            onChange={(e) => onChange({ ...data, brand_sentiment: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Notable News</h3>
          <button
            onClick={addNews}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add News
          </button>
        </div>

        <div className="space-y-4">
          {data.notable_news.map((news, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <input
                  type="text"
                  value={news.headline}
                  onChange={(e) =>
                    updateNews(index, { ...news, headline: e.target.value })
                  }
                  placeholder="News headline"
                  className="flex-1 font-medium px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={() => removeNews(index)}
                  className="ml-3 p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={news.source_name}
                  onChange={(e) =>
                    updateNews(index, { ...news, source_name: e.target.value })
                  }
                  placeholder="Source name"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                <input
                  type="date"
                  value={news.date}
                  onChange={(e) =>
                    updateNews(index, { ...news, date: e.target.value })
                  }
                  className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>

              <div className="mt-3 relative">
                <input
                  type="text"
                  value={news.source_url}
                  onChange={(e) =>
                    updateNews(index, { ...news, source_url: e.target.value })
                  }
                  placeholder="Source URL"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {news.source_url && (
                  <a
                    href={news.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Partnerships</h3>
          <button
            onClick={addPartnership}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Partnership
          </button>
        </div>

        <div className="space-y-4">
          {data.partnerships.map((partnership, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <textarea
                  value={partnership.value}
                  onChange={(e) =>
                    updatePartnership(index, { ...partnership, value: e.target.value })
                  }
                  placeholder="Describe the partnership"
                  rows={2}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={() => removePartnership(index)}
                  className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="relative">
                <input
                  type="text"
                  value={partnership.source_url || ''}
                  onChange={(e) =>
                    updatePartnership(index, { ...partnership, source_url: e.target.value })
                  }
                  placeholder="Source URL (optional)"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
                {partnership.source_url && (
                  <a
                    href={partnership.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}