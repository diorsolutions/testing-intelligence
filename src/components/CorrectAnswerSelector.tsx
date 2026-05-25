'use client';

import { useState } from 'react';

interface Question {
  number: string;
  text: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface CorrectAnswerSelectorProps {
  questions: Question[];
  onConfirm: (correctAnswers: Record<number, string>) => void;
}

export default function CorrectAnswerSelector({ questions, onConfirm }: CorrectAnswerSelectorProps) {
  const [correctAnswers, setCorrectAnswers] = useState<Record<number, string>>({});

  const handleSelect = (index: number, option: string) => {
    setCorrectAnswers({ ...correctAnswers, [index]: option });
  };

  const handleConfirm = () => {
    console.log('Confirm button clicked with correctAnswers:', correctAnswers);
    onConfirm(correctAnswers);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          To'g'ri Javoblarni Tanlang
        </h2>
        <p className="text-gray-600 mb-6 text-center">
          Har bir savol uchun to'g'ri javobni tanlang
        </p>
        
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div key={index} className="p-4 border rounded-lg bg-gray-50">
              <p className="font-semibold text-gray-700 mb-3">
                {index + 1}. {q.text}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(q.options).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleSelect(index, key)}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      correctAnswers[index] === key
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-semibold text-gray-700">{key}.</span>{' '}
                    <span className="text-gray-600">{value}</span>
                    {correctAnswers[index] === key && (
                      <span className="ml-2 text-green-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleConfirm}
          disabled={Object.keys(correctAnswers).length !== questions.length}
          className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Tasdiqlash ({Object.keys(correctAnswers).length} / {questions.length})
        </button>
      </div>
    </div>
  );
}
