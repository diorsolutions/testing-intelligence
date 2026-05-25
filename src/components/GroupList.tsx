'use client';

import { useEffect, useState } from 'react';

interface Group {
  id: number;
  name: string;
  questions: any[];
  correct_answers: Record<number, string>;
  group_index: number;
}

interface GroupListProps {
  sectionId: number;
  onSelectGroup: (groupId: number, questions: any[], correctAnswers: any) => void;
  onBack: () => void;
}

export default function GroupList({ sectionId, onSelectGroup, onBack }: GroupListProps) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGroups();
  }, [sectionId]);

  const loadGroups = async () => {
    try {
      const response = await fetch(`/api/groups?section_id=${sectionId}`);
      const data = await response.json();
      setGroups(data.groups || []);
    } catch (error) {
      console.error('Guruhlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] sm:min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 sm:mb-6 transition-colors text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Orqaga
        </button>

        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-1 sm:mb-2">Test Guruhlari</h2>
          <p className="text-sm sm:text-base text-gray-600">Guruhni tanlang testni boshlash uchun</p>
        </div>

        {groups.length === 0 ? (
          <div className="text-center py-8 sm:py-12 md:py-16">
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📝</div>
            <p className="text-gray-500 text-base sm:text-lg mb-3 sm:mb-4">Hozircha guruhlar yo'q</p>
            <p className="text-gray-400 text-sm sm:text-base">Avval DOCX faylni yuklang</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {groups.map((group) => (
              <button
                key={group.id}
                onClick={() => onSelectGroup(group.id, group.questions, group.correct_answers)}
                className="group bg-gradient-to-br from-purple-50 to-pink-50 p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border-2 border-transparent hover:border-purple-500 transition-all hover:shadow-xl text-left"
              >
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎯</div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-1 sm:mb-2 group-hover:text-purple-600 transition-colors">
                  {group.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                  {group.questions.length} ta savol
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400">
                  Guruh #{group.group_index + 1}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
