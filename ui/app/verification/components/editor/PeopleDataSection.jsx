import React from 'react';
import { Plus, Trash2, User } from 'lucide-react';

export function PeopleDataSection({ data, onChange }) {
  const addPerson = () => {
    onChange({
      ...data,
      key_people: [
        ...data.key_people,
        {
          name: '',
          role: '',
          background: '',
          source_url: null,
        },
      ],
    });
  };

  const removePerson = (index) => {
    const newPeople = data.key_people.filter((_, i) => i !== index);
    onChange({ ...data, key_people: newPeople });
  };

  const updatePerson = (index, person) => {
    const newPeople = [...data.key_people];
    newPeople[index] = person;
    onChange({ ...data, key_people: newPeople });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">People Data</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hiring Trends
          </label>
          <textarea
            value={data.hiring_trends}
            onChange={(e) => onChange({ ...data, hiring_trends: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Key People</h3>
          <button
            onClick={addPerson}
            className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            Add Person
          </button>
        </div>

        <div className="space-y-6">
          {data.key_people.map((person, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) =>
                        updatePerson(index, { ...person, name: e.target.value })
                      }
                      placeholder="Full Name"
                      className="w-full font-medium text-gray-900 border-0 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:ring-0 px-0 py-1 transition-all"
                    />
                  </div>
                </div>
                <button
                  onClick={() => removePerson(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={person.role}
                  onChange={(e) =>
                    updatePerson(index, { ...person, role: e.target.value })
                  }
                  placeholder="Role / Title"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                <textarea
                  value={person.background}
                  onChange={(e) =>
                    updatePerson(index, { ...person, background: e.target.value })
                  }
                  placeholder="Background & Experience"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />

                <input
                  type="text"
                  value={person.source_url || ''}
                  onChange={(e) =>
                    updatePerson(index, { ...person, source_url: e.target.value })
                  }
                  placeholder="Source URL (optional)"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}