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

interface TestWizardProps {
  questions: Question[];
  onRestart: () => void;
  answers?: Record<number, string>;
  onAnswersChange?: (answers: Record<number, string>) => void;
  correctAnswers?: Record<number, string>;
  groupId?: number;
  shuffleVariants?: boolean;
}

export default function TestWizard({ questions, onRestart, answers: initialAnswers = {}, onAnswersChange, correctAnswers = {}, groupId, shuffleVariants = false }: TestWizardProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>(initialAnswers);
  const [showResults, setShowResults] = useState(false);

  // Shuffle variant texts while keeping labels in place
  const shuffleOptions = (options: Question['options'], questionIndex: number): Question['options'] => {
    if (!shuffleVariants) return options;

    const keys = ['A', 'B', 'C', 'D'] as const;
    const values = keys.map(key => options[key]);
    
    // Use question index as seed for consistent shuffling per question
    const seed = questionIndex + 1;
    
    // Seeded random number generator
    const seededRandom = (index: number) => {
      const x = Math.sin(seed + index) * 10000;
      return x - Math.floor(x);
    };
    
    // Fisher-Yates shuffle with seed
    const array = [...values];
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(seededRandom(i) * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    return {
      A: array[0],
      B: array[1],
      C: array[2],
      D: array[3],
    };
  };

  // Get the correct answer key after shuffling
  const getShuffledCorrectAnswer = (originalCorrectAnswer: string, options: Question['options'], questionIndex: number): string => {
    if (!shuffleVariants) return originalCorrectAnswer;

    const shuffledOptions = shuffleOptions(options, questionIndex);
    const originalValue = options[originalCorrectAnswer as keyof Question['options']];
    
    // Find which key now has the original correct answer value
    for (const [key, value] of Object.entries(shuffledOptions)) {
      if (value === originalValue) {
        return key;
      }
    }
    return originalCorrectAnswer;
  };

  const handleAnswer = (option: string) => {
    const newAnswers = { ...answers, [currentQuestion]: option };
    setAnswers(newAnswers);
    if (onAnswersChange) {
      onAnswersChange(newAnswers);
    }
    
    // Database ga saqlash
    if (groupId) {
      fetch(`/api/groups/${groupId}/answers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers: newAnswers }),
      }).catch(console.error);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionSelect = (index: number) => {
    setCurrentQuestion(index);
  };

  const currentAnswer = answers[currentQuestion];
  const question = questions[currentQuestion];
  const shuffledOptions = shuffleOptions(question.options, currentQuestion);
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults) {
    const correctCount = Object.keys(answers).filter(
      index => {
        const shuffledCorrectAnswer = getShuffledCorrectAnswer(correctAnswers[parseInt(index)], questions[parseInt(index)].options, parseInt(index));
        return answers[parseInt(index)] === shuffledCorrectAnswer;
      }
    ).length;
    const percentage = Math.round((correctCount / questions.length) * 100);

    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
            <h2 className="text-3xl font-bold text-center">Test Natijalari</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-6xl font-bold">{correctCount}</div>
                <div className="text-sm opacity-80">To'g'ri</div>
              </div>
              <div className="text-4xl font-light opacity-50">/</div>
              <div className="text-center">
                <div className="text-6xl font-bold">{questions.length}</div>
                <div className="text-sm opacity-80">Jami</div>
              </div>
              <div className="w-px h-16 bg-white/30 mx-4" />
              <div className="text-center">
                <div className="text-5xl font-bold">{percentage}%</div>
                <div className="text-sm opacity-80">Natija</div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {questions.map((q, index) => {
              const userAnswer = answers[index];
              const originalCorrectAnswer = correctAnswers[index];
              const shuffledCorrectAnswer = getShuffledCorrectAnswer(originalCorrectAnswer, q.options, index);
              const isCorrect = userAnswer === shuffledCorrectAnswer;
              const displayOptions = shuffleOptions(q.options, index);

              return (
                <div
                  key={index}
                  className={`p-5 rounded-2xl border-2 transition-all ${
                    isCorrect 
                      ? 'bg-green-50 border-green-300' 
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {index + 1}
                    </div>
                    <p className="font-semibold text-gray-800 text-base leading-relaxed">
                      {q.text}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-11">
                    {Object.entries(displayOptions).map(([key, value]) => {
                      const isUserAnswer = userAnswer === key;
                      const isCorrectAnswer = shuffledCorrectAnswer === key;

                      return (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            isCorrectAnswer
                              ? 'bg-green-100 border-green-500'
                              : isUserAnswer
                              ? 'bg-red-100 border-red-500'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className={`font-bold text-sm flex-shrink-0 ${
                              isCorrectAnswer ? 'text-green-700' : isUserAnswer ? 'text-red-700' : 'text-gray-700'
                            }`}>
                              {key}.
                            </span>
                            <span className={`text-sm leading-relaxed ${
                              isCorrectAnswer ? 'text-green-800' : isUserAnswer ? 'text-red-800' : 'text-gray-700'
                            }`}>
                              {value}
                            </span>
                            {isCorrectAnswer && (
                              <span className="ml-auto text-green-600 text-lg">✓</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-6 bg-gray-50 border-t">
            <button
              onClick={onRestart}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all font-bold text-base shadow-lg"
            >
              Guruhlarga Qaytish
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Progress bar */}
        <div className="h-4 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex">
          {/* Question navigation sidebar */}
          <div className="w-32 bg-gradient-to-b from-gray-50 to-blue-50 p-4 border-r">
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Savollar</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {questions.map((_, index) => {
                const userAnswer = answers[index];
                const originalCorrectAnswer = correctAnswers[index];
                const shuffledCorrectAnswer = getShuffledCorrectAnswer(originalCorrectAnswer, questions[index].options, index);
                const isAnswered = !!userAnswer;
                const isCorrect = userAnswer === shuffledCorrectAnswer;

                return (
                  <button
                    key={index}
                    onClick={() => handleQuestionSelect(index)}
                    className={`p-4 text-sm font-bold rounded-2xl transition-all duration-200 ${
                      currentQuestion === index
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-xl scale-105'
                        : isAnswered
                        ? isCorrect
                          ? 'bg-green-100 text-green-800 border-2 border-green-400 hover:border-green-500'
                          : 'bg-red-100 text-red-800 border-2 border-red-400 hover:border-red-500'
                        : 'bg-white border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main question area */}
          <div className="flex-1 p-12">
            <div className="mb-10">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-bold text-gray-500 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full uppercase tracking-wide">
                  Savol {currentQuestion + 1} / {questions.length}
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 leading-relaxed">
                {question.text}
              </h2>
            </div>

            <div className="space-y-5">
              {Object.entries(shuffledOptions).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => handleAnswer(key)}
                  className={`w-full p-6 text-left rounded-2xl border-2 transition-all duration-200 font-medium text-lg ${
                    currentAnswer === key
                      ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 shadow-xl scale-[1.02]'
                      : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                      currentAnswer === key
                        ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {key}
                    </div>
                    <span className="text-gray-700">{value}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between mt-12 gap-4">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="flex-1 px-8 py-4 rounded-2xl border-2 border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg transition-all"
              >
                ← Orqaga
              </button>
              <button
                onClick={handleNext}
                className="flex-1 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
              >
                {currentQuestion === questions.length - 1 ? 'Natijalar →' : 'Keyingi →'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
