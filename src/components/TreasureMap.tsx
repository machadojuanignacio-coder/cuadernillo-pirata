import React from 'react';
import { 
  Sparkles, 
  Award, 
  Volume2, 
  PenTool, 
  CheckCircle2, 
  MapPin, 
  Compass,
  ArrowRight
} from 'lucide-react';
import { PirateLetterItem } from '../data/pirateAlphabet';
import { playPirateCoin, speakPirateLetter } from '../utils/soundEffects';

interface TreasureMapProps {
  alphabet: PirateLetterItem[];
  completedLetters: Record<string, boolean>;
  onSelectLetterForTrace: (index: number) => void;
  onToggleComplete: (letter: string) => void;
  onOpenDiploma: () => void;
  studentName: string;
}

export const TreasureMap: React.FC<TreasureMapProps> = ({
  alphabet,
  completedLetters,
  onSelectLetterForTrace,
  onToggleComplete,
  onOpenDiploma,
  studentName
}) => {
  const completedCount = Object.values(completedLetters).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / alphabet.length) * 100);
  const isAllComplete = completedCount === alphabet.length;

  const handleSpeak = (letter: string, word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    playPirateCoin();
    speakPirateLetter(letter, word);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Captain's Quest Log Banner */}
      <div className="bg-[#2D1B11] text-[#FDF5E6] border-4 border-[#C62828] rounded-2xl p-5 shadow-xl relative overflow-hidden">
        {/* Background compass watermarks */}
        <div className="absolute -right-8 -bottom-8 opacity-10 pointer-events-none select-none text-9xl">
          🧭
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFE082] to-[#FFC107] border-3 border-[#FFA000] flex items-center justify-center text-3xl shadow-md shrink-0">
              🦜
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-wider font-bold text-[#FFD54F]">
                  Diario de A bordo
                </span>
                <span className="text-xs text-[#D7CCC8]">·</span>
                <span className="text-xs text-[#D7CCC8]">
                  Capitán: <b className="text-white">{studentName || 'Pirata'}</b>
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-title text-[#FFE082]">
                La Gran Ruta del Abecedario
              </h2>
              <p className="text-xs sm:text-sm text-[#D7CCC8] mt-1 max-w-xl">
                Navega de isla en isla desde la <b>A</b> (Ancla) hasta la <b>Z</b> (Zafiro). ¡Traza cada letra para desbloquear el tesoro legendario!
              </p>
            </div>
          </div>

          {/* Progress Box */}
          <div className="bg-[#1F120B] border-2 border-[#8D6E63] rounded-xl p-4 text-center min-w-[220px] w-full md:w-auto shadow-inner">
            <div className="flex justify-between items-center text-xs font-bold mb-1 text-[#D7CCC8]">
              <span>Islas Conquistadas</span>
              <span className="text-[#FFD54F] font-mono text-sm">
                {completedCount} / {alphabet.length}
              </span>
            </div>

            {/* Progress Bar with Sailing Boat */}
            <div className="w-full bg-[#3E2723] h-3.5 rounded-full overflow-hidden border border-[#5D4037] relative my-2">
              <div
                className="bg-gradient-to-r from-[#FFC107] via-[#FF9800] to-[#4CAF50] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex justify-between items-center text-[10px] text-[#A1887F]">
              <span>Progreso: {progressPercent}%</span>
              {isAllComplete ? (
                <button
                  onClick={onOpenDiploma}
                  className="text-[#81C784] font-bold hover:underline flex items-center gap-1"
                >
                  <Award className="w-3 h-3" /> ¡Reclamar Diploma!
                </button>
              ) : (
                <span>Faltan {alphabet.length - completedCount} letras</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Nautical Island Grid */}
      <div className="bg-[#FAF4EB] border-4 border-[#8D6E63] rounded-3xl p-5 sm:p-8 shadow-lg relative overflow-hidden">
        {/* Subtle sea wave background lines */}
        <div 
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#CBB89D 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="relative z-10 mb-6 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#D7CCC8] pb-4">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#C62828]" />
            <h3 className="font-title font-bold text-lg text-[#2D1B11]">
              Islas del Archipiélago Pirata
            </h3>
          </div>
          <div className="flex items-center gap-3 text-xs text-[#5D4037]">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#E8F5E9] border border-[#81C784] inline-block" />
              <span>Conquistada (⭐)</span>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-white border border-[#D7CCC8] inline-block" />
              <span>Por Explorar</span>
            </span>
          </div>
        </div>

        {/* 27 Letter Islands in Playful Nautical Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
          {alphabet.map((item, idx) => {
            const isDone = !!completedLetters[item.letter];
            return (
              <div
                key={item.letter}
                onClick={() => onSelectLetterForTrace(idx)}
                className={`group relative rounded-2xl border-3 p-3.5 transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isDone
                    ? 'bg-[#F1F8E9] border-[#66BB6A] shadow-sm hover:border-[#2E7D32] hover:shadow-md'
                    : 'bg-white border-[#8D6E63]/70 hover:border-[#C62828] hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Island Number / Check Badge */}
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-bold text-[#8D6E63] font-mono">
                    #{idx + 1}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleComplete(item.letter);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-transform active:scale-75 ${
                      isDone
                        ? 'bg-[#4CAF50] text-white shadow-xs'
                        : 'bg-[#F5EBE1] text-[#A1887F] hover:bg-[#FFE0B2]'
                    }`}
                    title={isDone ? 'Conquistada' : 'Marcar como dominada'}
                  >
                    {isDone ? '✓' : '○'}
                  </button>
                </div>

                {/* Big Island Letter & Emoji Icon */}
                <div className="text-center my-1.5">
                  <div className="text-3xl mb-1 group-hover:scale-110 transition-transform">
                    {item.emoji}
                  </div>
                  <div className="text-3xl sm:text-4xl font-black font-letter-basic tracking-tight text-[#2D1B11]">
                    {item.letter}
                    <span className="text-xl text-[#8D6E63] font-bold font-letter-basic ml-1.5 opacity-80">
                      {item.letter.toLowerCase()}
                    </span>
                  </div>
                  <div className="text-xs font-black font-letter-basic text-[#1A237E] truncate mt-1 tracking-wide">
                    {item.word}
                  </div>
                </div>

                {/* Card Bottom: Audio & Quick Trace Affordance */}
                <div className="mt-2 pt-2 border-t border-[#D7CCC8]/60 flex items-center justify-between">
                  <button
                    onClick={(e) => handleSpeak(item.letter, item.word, e)}
                    className="p-1 rounded-md text-[#5D4037] hover:text-[#C62828] hover:bg-[#FFE082]/60 transition-colors"
                    title="Escuchar"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] font-bold text-[#C62828] flex items-center gap-0.5 group-hover:underline">
                    <span>Trazar</span>
                    <ArrowRight className="w-2.5 h-2.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Milestone Chest Banners */}
        <div className="mt-8 pt-6 border-t-2 border-[#D7CCC8] flex flex-wrap items-center justify-between gap-4 text-xs text-[#5D4037]">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span>
              <b>Cofres Intermedios:</b> Cada 5 letras dominadas desbloqueas un doblón de oro.
            </span>
          </div>

          <button
            onClick={onOpenDiploma}
            className="px-4 py-2 bg-[#FFF8E1] hover:bg-[#FFE082] text-[#2D1B11] border-2 border-[#FFA000] rounded-xl font-bold flex items-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Award className="w-4 h-4 text-[#C62828]" />
            <span>Ver Diploma Oficial del Capitán</span>
          </button>
        </div>
      </div>
    </div>
  );
};
