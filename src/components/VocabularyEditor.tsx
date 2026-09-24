import React, { useState } from 'react';
import { 
  RotateCcw, 
  Sparkles, 
  Download, 
  Upload, 
  Search, 
  Save, 
  Sliders,
  Smile,
  BookOpen
} from 'lucide-react';
import { PirateLetterItem, WorkbookSettings, DEFAULT_PIRATE_ALPHABET } from '../data/pirateAlphabet';
import { playPirateCoin } from '../utils/soundEffects';

interface VocabularyEditorProps {
  alphabet: PirateLetterItem[];
  onUpdateAlphabet: (newAlphabet: PirateLetterItem[]) => void;
  settings: WorkbookSettings;
  onUpdateSettings: (newSettings: Partial<WorkbookSettings>) => void;
  onResetToDefaults: () => void;
}

export const VocabularyEditor: React.FC<VocabularyEditorProps> = ({
  alphabet,
  onUpdateAlphabet,
  settings,
  onUpdateSettings,
  onResetToDefaults
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [savedToast, setSavedToast] = useState(false);

  const handleItemChange = (index: number, field: keyof PirateLetterItem, value: string) => {
    const updated = [...alphabet];
    updated[index] = {
      ...updated[index],
      [field]: field === 'word' ? value.toUpperCase() : value
    };
    onUpdateAlphabet(updated);
  };

  const handleApplyPreset = (presetType: 'pirates' | 'ocean' | 'adventurers') => {
    if (presetType === 'pirates') {
      onResetToDefaults();
      triggerToast();
      return;
    }

    if (presetType === 'ocean') {
      const oceanWords: Record<string, { word: string; emoji: string; desc: string }> = {
        A: { word: 'ALMEJA', emoji: '🦪', desc: 'Concha marina que guarda una perla.' },
        B: { word: 'BALLENA', emoji: '🐋', desc: 'El mamífero más grande de los océanos.' },
        C: { word: 'CORAL', emoji: '🪸', desc: 'Arrecife submarino lleno de vida marina.' },
        D: { word: 'DELFÍN', emoji: '🐬', desc: 'Ágil y simpático nadador de las olas.' },
        E: { word: 'ESTRELLA', emoji: '⭐', desc: 'Estrella de mar descansando en la arena.' },
        F: { word: 'FOCA', emoji: '🦭', desc: 'Juguetona foca marina en los arrecifes.' },
        G: { word: 'GAVIOTA', emoji: '🕊️', desc: 'Vuela alto vigilando la costa marina.' },
        M: { word: 'MEDUSA', emoji: '🪼', desc: 'Flota suavemente brillando en el agua.' },
        P: { word: 'PULPO', emoji: '🐙', desc: 'Ocho tentáculos veloces en el arrecife.' },
        T: { word: 'TIBURÓN', emoji: '🦈', desc: 'El guardián veloz de las aguas profundas.' },
      };

      const updated = alphabet.map(item => {
        if (oceanWords[item.letter]) {
          return {
            ...item,
            word: oceanWords[item.letter].word,
            emoji: oceanWords[item.letter].emoji,
            description: oceanWords[item.letter].desc
          };
        }
        return item;
      });

      onUpdateAlphabet(updated);
      triggerToast();
    }
  };

  const triggerToast = () => {
    playPirateCoin();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleExportJSON = () => {
    const data = JSON.stringify({ alphabet, settings }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `abecedario_pirata_${settings.studentName.replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.alphabet && Array.isArray(json.alphabet)) {
          onUpdateAlphabet(json.alphabet);
        }
        if (json.settings) {
          onUpdateSettings(json.settings);
        }
        triggerToast();
      } catch (err) {
        alert('Archivo JSON no válido.');
      }
    };
    reader.readAsText(file);
  };

  const filteredAlphabet = alphabet.filter(
    item => 
      item.letter.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.word.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header Banner */}
      <div className="bg-[#FFFFFF] border-4 border-[#2D1B11] rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#D7CCC8] pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#2D1B11] font-title flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#C62828]" />
              <span>Personalizar Palabras y Ajustes</span>
            </h2>
            <p className="text-xs text-[#5D4037] mt-1">
              Personaliza cada palabra, emoji y detalle del cuadernillo tal como en el script de Python.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportJSON}
              className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#3E2723] border-2 border-[#8D6E63] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              title="Descargar configuración"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <label className="px-3 py-1.5 bg-[#FAF7F2] hover:bg-[#F5EBE1] text-[#3E2723] border-2 border-[#8D6E63] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all">
              <Upload className="w-3.5 h-3.5" />
              <span>Importar</span>
              <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('¿Deseas restablecer las 27 palabras originales del abecedario pirata?')) {
                  onResetToDefaults();
                  triggerToast();
                }
              }}
              className="px-3 py-1.5 bg-[#FFEBEE] hover:bg-[#FFCDD2] text-[#C62828] border-2 border-[#EF9A9A] rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer</span>
            </button>
          </div>
        </div>

        {/* Global Settings Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-4">
          <div>
            <label className="text-xs font-bold text-[#5D4037] block mb-1">
              Título del Cuadernillo
            </label>
            <input
              type="text"
              value={settings.bookletTitle}
              onChange={(e) => onUpdateSettings({ bookletTitle: e.target.value })}
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-lg p-2 font-bold text-sm text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5D4037] block mb-1">
              Nombre del Alumno / Pirata
            </label>
            <input
              type="text"
              value={settings.studentName}
              onChange={(e) => onUpdateSettings({ studentName: e.target.value })}
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-lg p-2 font-bold text-sm text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#5D4037] block mb-1">
              Nombre de la Embarcación
            </label>
            <input
              type="text"
              value={settings.shipName}
              onChange={(e) => onUpdateSettings({ shipName: e.target.value })}
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-lg p-2 font-bold text-sm text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            />
          </div>
        </div>

        {/* Preset Badges */}
        <div className="mt-4 pt-3 border-t border-[#D7CCC8]/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-[#8D6E63] text-xs">Temas Rápidos:</span>
          <button
            onClick={() => handleApplyPreset('pirates')}
            className="px-3 py-1 bg-[#FFF8E1] hover:bg-[#FFE082] text-[#5D4037] border border-[#FFB300] rounded-lg font-semibold transition-all cursor-pointer"
          >
            🏴‍☠️ Piratas Clásicos (Original)
          </button>
          <button
            onClick={() => handleApplyPreset('ocean')}
            className="px-3 py-1 bg-[#E1F5FE] hover:bg-[#B3E5FC] text-[#0277BD] border border-[#4FC3F7] rounded-lg font-semibold transition-all cursor-pointer"
          >
            🐬 Criaturas del Mar y Océano
          </button>
        </div>
      </div>

      {/* Vocabulary Search & Edit List */}
      <div className="bg-[#FFFFFF] border-4 border-[#2D1B11] rounded-2xl shadow-lg p-5">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#C62828]" />
            <h3 className="font-title font-bold text-lg text-[#2D1B11]">
              Lista de Palabras del Abecedario (27 Letras)
            </h3>
          </div>

          {/* Search Bar */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-[#8D6E63] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar letra o palabra..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            />
          </div>
        </div>

        {/* Word Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAlphabet.map((item) => {
            const originalIndex = alphabet.findIndex(a => a.letter === item.letter);
            return (
              <div
                key={item.letter}
                className="bg-[#FDFBF7] border-2 border-[#8D6E63] rounded-xl p-3.5 shadow-xs hover:border-[#C62828] transition-all space-y-2.5"
              >
                {/* Letter Header and Inputs */}
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-[#D32F2F] text-white font-letter-basic font-black text-2xl rounded-lg flex items-center justify-center shrink-0 border border-[#2D1B11]">
                    {item.letter}
                  </div>

                  {/* Word Input */}
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase block">
                      Palabra
                    </label>
                    <input
                      type="text"
                      value={item.word}
                      onChange={(e) => handleItemChange(originalIndex, 'word', e.target.value)}
                      className="w-full bg-white border border-[#BCAAA4] rounded-lg px-2 py-1 text-sm font-black font-letter-basic text-[#1A237E] uppercase focus:outline-none focus:border-[#C62828]"
                    />
                  </div>

                  {/* Emoji Input */}
                  <div className="w-16">
                    <label className="text-[10px] font-bold text-[#8D6E63] uppercase block">
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={item.emoji}
                      onChange={(e) => handleItemChange(originalIndex, 'emoji', e.target.value)}
                      className="w-full bg-white border border-[#BCAAA4] rounded-lg px-2 py-1 text-center text-lg focus:outline-none focus:border-[#C62828]"
                    />
                  </div>
                </div>

                {/* Description Sentence */}
                <div>
                  <label className="text-[10px] font-bold text-[#8D6E63] block">
                    Frase explicativa para niños
                  </label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleItemChange(originalIndex, 'description', e.target.value)}
                    className="w-full bg-white border border-[#BCAAA4] rounded-lg px-2 py-1 text-xs text-[#5D4037] focus:outline-none focus:border-[#C62828]"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Save Confirmation Notification */}
      {savedToast && (
        <div className="fixed bottom-6 right-6 bg-[#2E7D32] text-white px-5 py-3 rounded-2xl shadow-2xl border-2 border-[#1B5E20] font-bold text-xs flex items-center gap-2 z-50 animate-bounce">
          <Sparkles className="w-4 h-4 text-[#FFE082]" />
          <span>¡Cambios guardados con éxito en tu cuadernillo!</span>
        </div>
      )}
    </div>
  );
};
