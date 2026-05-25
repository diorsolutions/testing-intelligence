'use client';

import { useState } from 'react';

interface UploadDocxProps {
  onQuestionsLoaded: (questions: any[]) => void;
  onBack: () => void;
}

export default function UploadDocx({ onQuestionsLoaded, onBack }: UploadDocxProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sectionName, setSectionName] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      setError('Faqat .docx formatidagi fayllarni yuklang');
      return;
    }

    if (!sectionName.trim()) {
      setError('Bo\'lim nomini kiriting');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/parse-docx', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Xatolik yuz berdi');
      }

      // Bo'lim yaratish
      const sectionResponse = await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sectionName }),
      });
      const sectionData = await sectionResponse.json();

      // Savollarni 25 tadan guruhlarga bo'lish
      const questions = data.questions;
      const groupSize = 25;
      
      for (let i = 0; i < questions.length; i += groupSize) {
        const groupQuestions = questions.slice(i, i + groupSize);
        const correctAnswers: Record<number, string> = {};
        groupQuestions.forEach((question: any, index: number) => {
          correctAnswers[index] = question.correctAnswer || 'A';
        });

        await fetch('/api/groups', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_id: sectionData.sectionId,
            name: `Guruh ${Math.floor(i / groupSize) + 1}`,
            questions: groupQuestions,
            correct_answers: correctAnswers,
            group_index: Math.floor(i / groupSize),
          }),
        });
      }

      onQuestionsLoaded(data.questions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4">
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

        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center">
          Yangi Bo'lim Yaratish
        </h2>

        <div className="mb-4 sm:mb-6">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
            Bo'lim nomi
          </label>
          <input
            type="text"
            value={sectionName}
            onChange={(e) => setSectionName(e.target.value)}
            placeholder="Masalan: Matematika, Fizika..."
            className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-blue-500 focus:outline-none transition-colors text-sm sm:text-base"
          />
        </div>
        
        <div className="border-2 border-dashed border-gray-300 rounded-lg sm:rounded-xl p-4 sm:p-6 md:p-8 text-center hover:border-blue-500 transition-colors">
          <input
            type="file"
            accept=".docx"
            onChange={handleFileUpload}
            disabled={loading}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer"
          >
            <div className="text-4xl sm:text-5xl md:text-6xl mb-3 sm:mb-4">📄</div>
            <p className="text-gray-600 mb-1 sm:mb-2 text-sm sm:text-base md:text-lg">
              {loading ? 'Yuklanmoqda...' : 'DOCX faylni tanlang yoki bu yerga torting'}
            </p>
            <p className="text-[10px] sm:text-xs md:text-sm text-gray-400">
              Savollar avtomatik 25 tadan guruhlarga bo'linadi
            </p>
          </label>
        </div>

        {error && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-red-50 border-2 border-red-200 rounded-lg sm:rounded-xl text-red-600 text-xs sm:text-sm">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
