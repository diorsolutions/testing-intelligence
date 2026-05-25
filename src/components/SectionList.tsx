'use client';

import { useEffect, useState } from 'react';

interface Section {
  id: number;
  name: string;
  created_at: string;
}

interface SectionListProps {
  onSelectSection: (sectionId: number) => void;
  onCreateSection: () => void;
}

export default function SectionList({ onSelectSection, onCreateSection }: SectionListProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSections();
  }, []);

  const loadSections = async () => {
    try {
      const response = await fetch('/api/sections');
      const data = await response.json();
      setSections(data.sections || []);
    } catch (error) {
      console.error('Bo\'limlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Bo'limlari</h2>
            <p className="text-gray-600">Bo'limni tanlang yangi test yaratish uchun</p>
          </div>
          <button
            onClick={onCreateSection}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg hover:shadow-xl"
          >
            + Yangi Bo'lim
          </button>
        </div>

        {sections.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-500 text-lg mb-4">Hozircha bo'limlar yo'q</p>
            <button
              onClick={onCreateSection}
              className="text-blue-600 hover:text-blue-700 font-semibold"
            >
              Birinchi bo'limni yarating
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSelectSection(section.id)}
                className="group bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl border-2 border-transparent hover:border-blue-500 transition-all hover:shadow-xl"
              >
                <div className="text-4xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                  {section.name}
                </h3>
                <p className="text-sm text-gray-500">
                  {new Date(section.created_at).toLocaleDateString('uz-UZ')}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
