import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, RotateCcw, Volume2, CheckCircle, HelpCircle } from 'lucide-react';
import { PirateLetterItem } from '../data/pirateAlphabet';
import { playPirateCoin, playTreasureFanfare, speakPirateLetter } from '../utils/soundEffects';

interface PirateMiniGameProps {
  alphabet: PirateLetterItem[];
  studentName: string;
}

interface Question {
  type: 'word-to-letter' | 'letter-to-word';
  prompt: string;
  targetItem: PirateLetterItem;
  options: PirateLetterItem[];
}

export const PirateMiniGame: React.FC<PirateMiniGameProps> = ({ alphabet, studentName }) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const generateNewQuestion = () => {
    setFeedback(null);
    setSelectedAnswer(null);

    // Pick random target
    const targetIdx = Math.floor(Math.random() * alphabet.length);
    const target = alphabet[targetIdx];

    // Pick 2 random distractors
    const distractors: PirateLetterItem[] = [];
    while (distractors.length < 2) {
      const rand = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (rand.letter !== target.letter && !distractors.some(d => d.letter === rand.letter)) {
        distractors.push(rand);
      }
    }

    const options = [target, ...distractors].sort(() => Math.random() - 0.5);
    const isWordToLetter = Math.random() > 0.5;

    const question: Question = {
      type: isWordToLetter ? 'word-to-letter' : 'letter-to-word',
      prompt: isWordToLetter
        ? `¿Con qué letra empieza la palabra "${target.word}"?`
        : `¿Qué palabra pirata empieza con la letra "${target.letter}"?`,
      targetItem: target,
      options
    };

    setCurrentQuestion(question);
  };

  useEffect(() => {
    generateNewQuestion();
  }, [alphabet]);

  const handleSelectOption = (option: PirateLetterItem) => {
    if (feedback !== null || !currentQuestion) return;

    const isCorrect = option.letter === currentQuestion.targetItem.letter;
    setSelectedAnswer(option.letter);

    if (isCorrect) {
      setFeedback('correct');
      setScore(s => s + 10);
      setStreak(st => st + 1);
      playPirateCoin();

      if ((streak + 1) % 5 === 0) {
        playTreasureFanfare();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      setTimeout(() => {
        generateNewQuestion();
      }, 1500);
    } else {
      setFeedback('wrong');
      setStreak(0);
      setTimeout(() => {
        setFeedback(null);
        setSelectedAnswer(null);
      }, 1400);
    }
  };

  const handleHearHint = () => {
    if (!currentQuestion) return;
    speakPirateLetter(currentQuestion.targetItem.letter, currentQuestion.targetItem.word);
  };

  if (!currentQuestion) return null;

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6">
      <div className="bg-[#FFFFFF] border-4 border-[#2D1B11] rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Game Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#D7CCC8] pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#FFE082] border-2 border-[#FFA000] flex items-center justify-center text-2xl shadow-sm">
              🦜
            </div>
            <div>
              <h2 className="font-title text-xl sm:text-2xl font-black text-[#2D1B11]">
                El Reto del Gran Loro
              </h2>
              <p className="text-xs text-[#5D4037]">
                ¡Ayuda al loro pirata a encontrar las letras del tesoro!
              </p>
            </div>
          </div>

          {/* Score & Streak */}
          <div className="flex items-center gap-3 text-xs font-bold">
            <div className="px-3 py-1.5 bg-[#FFF8E1] border-2 border-[#FFC107] rounded-xl flex items-center gap-1.5 text-[#2D1B11]">
              <span>🪙 Doblones:</span>
              <span className="text-sm font-extrabold text-[#C62828] font-mono">{score}</span>
            </div>
            <div className="px-3 py-1.5 bg-[#E8F5E9] border-2 border-[#81C784] rounded-xl flex items-center gap-1.5 text-[#2E7D32]">
              <span>🔥 Racha:</span>
              <span className="text-sm font-extrabold font-mono">{streak}</span>
            </div>
          </div>
        </div>

        {/* Question Stage Card */}
        <div className="bg-[#FAF4EB] border-3 border-[#8D6E63] rounded-2xl p-6 text-center mb-8 relative">
          <button
            onClick={handleHearHint}
            className="absolute top-3 right-3 p-2 bg-white hover:bg-[#FFE082] text-[#2D1B11] border-2 border-[#8D6E63] rounded-xl transition-all shadow-xs cursor-pointer"
            title="Escuchar pista"
          >
            <Volume2 className="w-4 h-4 text-[#C62828]" />
          </button>

          {/* Central Question Display */}
          <div className="text-6xl sm:text-7xl mb-3 select-none animate-bounce">
            {currentQuestion.targetItem.emoji}
          </div>

          <h3 className="text-lg sm:text-2xl font-bold font-title text-[#1A237E] mb-2">
            {currentQuestion.prompt}
          </h3>

          <p className="text-xs text-[#5D4037] italic max-w-md mx-auto">
            «{currentQuestion.targetItem.description}»
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswer === opt.letter;
            let btnStyle = 'bg-white border-[#8D6E63] hover:border-[#C62828] hover:bg-[#FFF8E1] text-[#2D1B11]';

            if (isSelected) {
              if (feedback === 'correct') {
                btnStyle = 'bg-[#4CAF50] border-[#2E7D32] text-white scale-105';
              } else if (feedback === 'wrong') {
                btnStyle = 'bg-[#E53935] border-[#B71C1C] text-white shake';
              }
            }

            return (
              <button
                key={opt.letter}
                onClick={() => handleSelectOption(opt)}
                disabled={feedback !== null}
                className={`border-4 rounded-2xl p-5 font-letter-basic font-extrabold transition-all shadow-md active:scale-95 cursor-pointer flex flex-col items-center justify-center gap-2 select-none ${btnStyle}`}
              >
                {currentQuestion.type === 'word-to-letter' ? (
                  <>
                    <span className="text-6xl font-black font-letter-basic">{opt.letter}</span>
                    <span className="text-sm font-bold opacity-80">
                      letra {opt.letter.toLowerCase()}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">{opt.emoji}</span>
                    <span className="text-2xl font-black font-letter-basic">{opt.word}</span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Interactive Feedback Message */}
        {feedback === 'correct' && (
          <div className="mt-6 text-center font-bold text-sm text-[#2E7D32] flex items-center justify-center gap-1.5 animate-pulse">
            <CheckCircle className="w-5 h-5 text-[#2E7D32]" />
            <span>¡Excelente, Capitán {studentName}! +10 Doblones de oro 🪙</span>
          </div>
        )}
        {feedback === 'wrong' && (
          <div className="mt-6 text-center font-bold text-sm text-[#C62828] flex items-center justify-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-[#C62828]" />
            <span>¡Casi! Inténtalo de nuevo, marinero.</span>
          </div>
        )}
      </div>
    </div>
  );
};
