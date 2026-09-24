import React from 'react';
import confetti from 'canvas-confetti';
import { Award, Printer, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { WorkbookSettings } from '../data/pirateAlphabet';
import { playTreasureFanfare } from '../utils/soundEffects';

interface PirateDiplomaViewProps {
  settings: WorkbookSettings;
  onUpdateSettings: (newSettings: Partial<WorkbookSettings>) => void;
  completedCount: number;
  totalLetters: number;
}

export const PirateDiplomaView: React.FC<PirateDiplomaViewProps> = ({
  settings,
  onUpdateSettings,
  completedCount,
  totalLetters
}) => {
  const handlePrintDiploma = () => {
    window.print();
  };

  const handleCelebrate = () => {
    playTreasureFanfare();
    confetti({
      particleCount: 80,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#FFD700', '#FF9800', '#C62828', '#1A237E']
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Control bar (hidden when printing) */}
      <div className="no-print bg-white border-4 border-[#2D1B11] rounded-2xl p-5 shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-title text-[#2D1B11] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#C62828]" />
            <span>Diploma Oficial del Capitán</span>
          </h2>
          <p className="text-xs text-[#5D4037]">
            Progreso actual: <b>{completedCount} de {totalLetters} letras</b> conquistadas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCelebrate}
            className="px-4 py-2 bg-[#FFF8E1] hover:bg-[#FFE082] text-[#2D1B11] border-2 border-[#FFA000] rounded-xl text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#FF9800]" />
            <span>¡Celebrar!</span>
          </button>

          <button
            onClick={handlePrintDiploma}
            className="px-4 py-2 bg-[#C62828] hover:bg-[#D32F2F] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#FFD54F]" />
            <span>Imprimir Diploma A4</span>
          </button>
        </div>
      </div>

      {/* Quick edit fields in web view */}
      <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white border-2 border-[#8D6E63] rounded-xl p-4 text-xs">
        <div>
          <label className="font-bold text-[#5D4037] block mb-1">Nombre en el Diploma</label>
          <input
            type="text"
            value={settings.studentName}
            onChange={(e) => onUpdateSettings({ studentName: e.target.value })}
            className="w-full bg-[#FAF7F2] border border-[#8D6E63] rounded-lg p-2 font-bold text-[#1A237E]"
          />
        </div>
        <div>
          <label className="font-bold text-[#5D4037] block mb-1">Navío Pirata</label>
          <input
            type="text"
            value={settings.shipName}
            onChange={(e) => onUpdateSettings({ shipName: e.target.value })}
            className="w-full bg-[#FAF7F2] border border-[#8D6E63] rounded-lg p-2 font-bold text-[#1A237E]"
          />
        </div>
      </div>

      {/* Diploma Certificate Surface */}
      <div className="relative border-8 border-[#FFC107] outline-4 outline-[#D32F2F] -outline-offset-8 rounded-3xl p-8 sm:p-14 bg-white text-center shadow-2xl min-h-[640px] flex flex-col justify-between overflow-hidden">
        {/* Parchment background effect */}
        <div className="text-6xl sm:text-7xl mb-2 select-none">
          🎉 🏆 🦜
        </div>

        <div className="my-auto py-4">
          <h1 className="text-3xl sm:text-5xl font-black text-[#C62828] font-pirate tracking-wide leading-tight">
            ¡GRAN TRABAJO, CAPITÁN!
          </h1>

          <div className="my-6">
            <span className="text-[11px] uppercase tracking-widest text-[#8D6E63] font-bold block mb-1">
              SE OTORGA ESTE DIPLOMA DE NAVEGACIÓN Y CALIGRAFÍA A:
            </span>
            <div className="text-3xl sm:text-5xl font-extrabold text-[#1A237E] font-title border-b-4 border-[#2D1B11] pb-2 inline-block min-w-[300px]">
              {settings.studentName || 'Capitán Pirata'}
            </div>
          </div>

          <p className="text-base sm:text-xl font-bold text-[#3E2723] max-w-xl mx-auto leading-relaxed">
            ¡Has completado el abecedario pirata entero<br />
            y encontraste el gran tesoro de las letras!
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 my-6 text-xs text-[#5D4037]">
            <span className="px-3 py-1.5 bg-[#FFF8E1] border-2 border-[#FFC107] rounded-xl font-bold">
              ⚓ Navío: {settings.shipName || 'Los Siete Mares'}
            </span>
            <span className="px-3 py-1.5 bg-[#FFF8E1] border-2 border-[#FFC107] rounded-xl font-bold">
              🪙 27 Letras Conquistadas
            </span>
          </div>
        </div>

        {/* Signature & Seal Footer */}
        <div className="mt-6 flex justify-around items-end pt-6 border-t-2 border-[#D7CCC8]">
          <div className="text-center">
            <div className="w-36 border-b-4 border-[#3E2723] mb-2 mx-auto">
              <span className="font-handwriting text-xl text-[#8D6E63] italic">Barbanegra</span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#3E2723] uppercase">
              Firma del Gran Almirante
            </span>
          </div>

          {/* Pirate Stamp Seal */}
          <div className="w-20 h-20 rounded-full border-4 border-[#C62828] text-[#C62828] flex flex-col items-center justify-center p-1 text-center font-bold text-[8px] uppercase tracking-tighter rotate-[-12deg] select-none">
            <span className="text-base">⭐</span>
            <span>SELLO OFICIAL</span>
            <span>PIRATA</span>
          </div>

          <div className="text-center">
            <div className="w-36 border-b-4 border-[#3E2723] mb-2 mx-auto">
              <span className="font-handwriting text-xl text-[#1A237E] italic">
                {settings.studentName || 'Capitán'}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-[#3E2723] uppercase">
              Firma del Capitán
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
