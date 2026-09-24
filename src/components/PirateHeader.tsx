import React, { useState } from 'react';
import { Compass, Printer, Map, Edit3, Sliders, Gamepad2, Award, Share2, Check, Copy, Download, FileText, Smartphone, AlertCircle } from 'lucide-react';
import { PirateLetterItem, WorkbookSettings } from '../data/pirateAlphabet';
import { generateSelfContainedAppHtml } from '../utils/exportHtml';

interface PirateHeaderProps {
  currentTab: 'map' | 'tracer' | 'workbook' | 'editor' | 'game' | 'diploma';
  onSelectTab: (tab: 'map' | 'tracer' | 'workbook' | 'editor' | 'game' | 'diploma') => void;
  onQuickPrint: () => void;
  completedCount: number;
  totalLetters: number;
  alphabet?: PirateLetterItem[];
  settings?: WorkbookSettings;
}

export const PirateHeader: React.FC<PirateHeaderProps> = ({
  currentTab,
  onSelectTab,
  onQuickPrint,
  completedCount,
  totalLetters,
  alphabet = [],
  settings = {
    bookletTitle: 'El Tesoro de las Letras',
    subtitle: 'Cuadernillo Pirata de Caligrafía',
    studentName: '',
    shipName: 'La Perla Negra',
    showUppercase: true,
    showLowercase: true,
    showCover: true,
    showDiploma: true,
    repeatWordTimes: 3,
    traceOpacity: 35,
    paperTexture: 'parchment',
    fontStyle: 'montessori'
  }
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    }
  };

  const handleDownloadStandaloneApp = () => {
    const htmlContent = generateSelfContainedAppHtml(alphabet, settings);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `app_pirata_completa_${(settings.studentName || 'letras').toLowerCase().replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <header className="no-print sticky top-0 z-40 bg-[#2D1B11] text-[#FDF5E6] border-b-4 border-[#C62828] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
          {/* Zone 1: Single text element Brand Zone */}
          <div 
            onClick={() => onSelectTab('map')}
            className="cursor-pointer flex items-center gap-2 group transition-transform active:scale-95"
          >
            <div className="w-9 h-9 rounded-lg bg-[#C62828] border border-[#FFC107] flex items-center justify-center text-xl shadow-inner shrink-0">
              🏴‍☠️
            </div>
            <div>
              <span className="font-pirate text-2xl tracking-wide text-[#FFD54F] group-hover:text-white transition-colors block leading-tight">
                El Tesoro de las Letras
              </span>
              <span className="text-[10px] text-[#D7CCC8] uppercase tracking-wider block font-medium">
                Cuadernillo Pirata de Caligrafía
              </span>
            </div>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => onSelectTab('map')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'map'
                  ? 'bg-[#C62828] text-white shadow-sm font-bold'
                  : 'text-[#D7CCC8] hover:text-white hover:bg-[#3E2723]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>Mapa del Tesoro</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[#1A0E08] rounded-full text-[#FFD54F]">
                {completedCount}/{totalLetters}
              </span>
            </button>

            <button
              onClick={() => onSelectTab('workbook')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'workbook'
                  ? 'bg-[#C62828] text-white shadow-sm font-bold'
                  : 'text-[#D7CCC8] hover:text-white hover:bg-[#3E2723]'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>Cuadernillo A4</span>
            </button>

            <button
              onClick={() => onSelectTab('tracer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'tracer'
                  ? 'bg-[#C62828] text-white shadow-sm font-bold'
                  : 'text-[#D7CCC8] hover:text-white hover:bg-[#3E2723]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>Pizarra de Trazo</span>
            </button>

            <button
              onClick={() => onSelectTab('game')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'game'
                  ? 'bg-[#C62828] text-white shadow-sm font-bold'
                  : 'text-[#D7CCC8] hover:text-white hover:bg-[#3E2723]'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>Juego</span>
            </button>

            <button
              onClick={() => onSelectTab('editor')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'editor'
                  ? 'bg-[#C62828] text-white shadow-sm font-bold'
                  : 'text-[#D7CCC8] hover:text-white hover:bg-[#3E2723]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>Personalizar</span>
            </button>

            <button
              onClick={() => onSelectTab('diploma')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                currentTab === 'diploma'
                  ? 'bg-[#C62828] text-white shadow-sm font-bold'
                  : 'text-[#D7CCC8] hover:text-white hover:bg-[#3E2723]'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-[#FFD54F]" />
              <span>Diploma</span>
            </button>
          </nav>

          {/* Zone 3: Primary Actions (Compartir & Imprimir) */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowShareModal(true)}
              className="px-3 py-1.5 text-xs font-bold text-white bg-[#1A237E] hover:bg-[#283593] border border-[#3949AB] rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Compartir enlace para alumnos o colegas"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FFE082]" />
              <span className="hidden sm:inline">Compartir Enlace</span>
            </button>

            <button
              onClick={onQuickPrint}
              className="px-3.5 py-1.5 text-xs font-bold text-[#2D1B11] bg-gradient-to-b from-[#FFE082] to-[#FFC107] hover:from-[#FFECB3] hover:to-[#FFD54F] border border-[#FFA000] rounded-lg shadow-sm flex items-center gap-1.5 transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              title="Imprimir Cuadernillo en tamaño A4"
            >
              <Printer className="w-4 h-4 text-[#2D1B11]" />
              <span>Imprimir A4 / PDF</span>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer tabs */}
        <div className="md:hidden flex overflow-x-auto px-4 py-2 gap-1 border-t border-[#4E342E] bg-[#23140C] text-xs">
          <button
            onClick={() => onSelectTab('map')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${currentTab === 'map' ? 'bg-[#C62828] text-white font-bold' : 'text-[#D7CCC8]'}`}
          >
            🗺️ Mapa
          </button>
          <button
            onClick={() => onSelectTab('workbook')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${currentTab === 'workbook' ? 'bg-[#C62828] text-white font-bold' : 'text-[#D7CCC8]'}`}
          >
            📄 Cuadernillo
          </button>
          <button
            onClick={() => onSelectTab('tracer')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${currentTab === 'tracer' ? 'bg-[#C62828] text-white font-bold' : 'text-[#D7CCC8]'}`}
          >
            ✏️ Trazo
          </button>
          <button
            onClick={() => onSelectTab('game')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${currentTab === 'game' ? 'bg-[#C62828] text-white font-bold' : 'text-[#D7CCC8]'}`}
          >
            🎮 Juego
          </button>
          <button
            onClick={() => onSelectTab('editor')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${currentTab === 'editor' ? 'bg-[#C62828] text-white font-bold' : 'text-[#D7CCC8]'}`}
          >
            ⚙️ Palabras
          </button>
          <button
            onClick={() => onSelectTab('diploma')}
            className={`px-2.5 py-1 rounded text-xs whitespace-nowrap ${currentTab === 'diploma' ? 'bg-[#C62828] text-white font-bold' : 'text-[#D7CCC8]'}`}
          >
            🏆 Diploma
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="px-2.5 py-1 rounded text-xs whitespace-nowrap bg-[#1A237E] text-[#FFE082] font-bold cursor-pointer"
          >
            🔗 Compartir
          </button>
        </div>
      </header>

      {/* Share Modal Dialog */}
      {showShareModal && (
        <div className="no-print fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border-4 border-[#2D1B11] shadow-2xl max-w-lg w-full p-6 text-[#2D1B11] animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#D7CCC8]">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🏴‍☠️</span>
                <h3 className="font-title font-black text-xl text-[#1A237E]">
                  Compartir Cuadernillo Pirata
                </h3>
              </div>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="my-5 space-y-4">
              {/* Alert explaining why preview links block external students */}
              <div className="bg-[#FFEBEE] border-2 border-[#EF5350] rounded-2xl p-4 text-xs text-[#C62828] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-[#C62828]" />
                <div>
                  <b className="font-bold block text-sm mb-1 text-[#B71C1C]">¿Por qué el link no deja entrar a las familias?</b>
                  Los enlaces que terminan en <code className="bg-[#FFCDD2] px-1.5 py-0.5 rounded font-mono text-[11px] font-bold">.run.app</code> son vistas previas temporales de Google AI Studio protegidas con tu cuenta y <b>bloquean a personas externas</b> por seguridad.
                </div>
              </div>

              {/* Solution 1: Direct Standalone App Download */}
              <div className="bg-[#E8F5E9] border-2 border-[#66BB6A] rounded-2xl p-4 text-xs space-y-2.5 text-[#1B5E20]">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-sm text-[#2E7D32] flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#2E7D32]" />
                    <span>Solución 1 (Recomendada): Descargar App (.html)</span>
                  </div>
                  <span className="bg-[#C8E6C9] text-[#1B5E20] px-2 py-0.5 rounded-full font-bold text-[10px]">
                    100% Offline • Sin fallos
                  </span>
                </div>
                <p className="text-[#33691E] leading-relaxed">
                  Descarga un archivo único que contiene <b>todo el cuadernillo, la pizarra de trazo interactiva y el juego</b>. Envíalo como archivo por WhatsApp o Google Drive. ¡Las familias hacen doble clic y se abre directamente en cualquier tablet, celular o PC sin internet ni registros!
                </p>
                <button
                  onClick={handleDownloadStandaloneApp}
                  className="w-full py-2.5 bg-[#2E7D32] hover:bg-[#1B5E20] text-white font-black rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer text-xs"
                >
                  <Download className="w-4 h-4 text-[#A5D6A7]" />
                  <span>Descargar App Completa Offline (.html)</span>
                </button>
              </div>

              {/* Solution 2: PDF Save */}
              <div className="bg-[#FFF8E1] border-2 border-[#FFCA28] rounded-2xl p-4 text-xs space-y-2 text-[#5D4037]">
                <div className="font-bold text-sm text-[#2D1B11] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C62828]" />
                  <span>Solución 2: Enviar como Cuadernillo PDF Imprimible</span>
                </div>
                <p className="text-[#5D4037] leading-relaxed">
                  Haz clic en <b>"Imprimir A4 / PDF"</b> en la barra superior, selecciona <i>"Guardar como PDF"</i> en tu impresora y tendrás el cuadernillo listo para enviar por WhatsApp o imprimir en papel.
                </p>
                <button
                  onClick={() => {
                    setShowShareModal(false);
                    onQuickPrint();
                  }}
                  className="w-full py-2 bg-[#FF8F00] hover:bg-[#E65100] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all cursor-pointer text-xs"
                >
                  <Printer className="w-4 h-4 text-[#FFE082]" />
                  <span>Generar y Guardar como PDF</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-5 py-2 bg-[#3E2723] hover:bg-[#2D1B11] text-white font-bold text-xs rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
