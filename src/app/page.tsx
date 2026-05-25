'use client';

import { useState, useEffect } from 'react';
import SectionList from '@/components/SectionList';
import GroupList from '@/components/GroupList';
import TestWizard from '@/components/TestWizard';
import UploadDocx from '@/components/UploadDocx';

type View = 'sections' | 'upload' | 'groups' | 'test';

export default function Home() {
  const [view, setView] = useState<View>('sections');
  const [selectedSectionId, setSelectedSectionId] = useState<number | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, string>>({});
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [shuffleVariants, setShuffleVariants] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('shuffleVariants');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });

  useEffect(() => {
    localStorage.setItem('shuffleVariants', JSON.stringify(shuffleVariants));
  }, [shuffleVariants]);

  const handleSelectSection = (sectionId: number) => {
    setSelectedSectionId(sectionId);
    setView('groups');
  };

  const handleCreateSection = () => {
    setView('upload');
  };

  const handleSelectGroup = (groupId: number, groupQuestions: any[], groupCorrectAnswers: any) => {
    setSelectedGroupId(groupId);
    setQuestions(groupQuestions);
    setCorrectAnswers(groupCorrectAnswers);
    setAnswers({});
    setView('test');
  };

  const handleBackToSections = () => {
    setSelectedSectionId(null);
    setView('sections');
  };

  const handleUploadComplete = () => {
    setView('sections');
  };

  const handleRestart = () => {
    setView('groups');
    setSelectedGroupId(null);
    setAnswers({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-4 sm:py-6 md:py-8">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Test Platformasi
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-md">
              <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-600">Variantlarni aralashtirish</span>
              <button
                onClick={() => setShuffleVariants(!shuffleVariants)}
                className={`relative w-10 h-5 sm:w-12 sm:h-6 md:w-14 md:h-8 rounded-full transition-colors duration-300 ${
                  shuffleVariants ? 'bg-green-400' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`absolute top-0.5 sm:top-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${
                    shuffleVariants ? 'translate-x-5 sm:translate-x-6 md:translate-x-7' : 'translate-x-0.5 sm:translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Bo'limni tanlang va testni boshlang</p>
        </div>

        {view === 'sections' && (
          <SectionList 
            onSelectSection={handleSelectSection}
            onCreateSection={handleCreateSection}
          />
        )}

        {view === 'upload' && (
          <UploadDocx 
            onQuestionsLoaded={handleUploadComplete}
            onBack={handleBackToSections}
          />
        )}

        {view === 'groups' && selectedSectionId && (
          <GroupList 
            sectionId={selectedSectionId}
            onSelectGroup={handleSelectGroup}
            onBack={handleBackToSections}
          />
        )}

        {view === 'test' && (
          <TestWizard 
            questions={questions}
            onRestart={handleRestart}
            answers={answers}
            onAnswersChange={setAnswers}
            correctAnswers={correctAnswers}
            groupId={selectedGroupId || undefined}
            shuffleVariants={shuffleVariants}
          />
        )}
      </div>
    </div>
  );
}
