import React, { useState } from 'react';
import { 
  Printer, 
  Download, 
  Eye, 
  CheckSquare, 
  Sparkles, 
  Sliders, 
  FileText, 
  Share2, 
  HelpCircle,
  Laptop
} from 'lucide-react';
import { PirateLetterItem, WorkbookSettings } from '../data/pirateAlphabet';
import { generateSelfContainedAppHtml } from '../utils/exportHtml';

interface PrintWorkbookProps {
  alphabet: PirateLetterItem[];
  settings: WorkbookSettings;
  onUpdateSettings: (newSettings: Partial<WorkbookSettings>) => void;
  selectedLetterForWorksheet?: string;
}

export const PrintWorkbook: React.FC<PrintWorkbookProps> = ({
  alphabet,
  settings,
  onUpdateSettings,
  selectedLetterForWorksheet = 'A'
}) => {
  const [printFilter, setPrintFilter] = useState<'all' | 'uppercase' | 'lowercase' | 'diploma' | 'single'>('all');
  const [ecoFriendly, setEcoFriendly] = useState<boolean>(false);
  const [activeLetter, setActiveLetter] = useState<string>(selectedLetterForWorksheet);
  const [showVirtualTips, setShowVirtualTips] = useState<boolean>(true);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtmlFile = () => {
    const htmlContent = generateSelfContainedAppHtml(alphabet, settings);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `app_pirata_${(settings.studentName || 'letras').toLowerCase().replace(/\s+/g, '_')}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentSingleItem = alphabet.find(item => item.letter === activeLetter) || alphabet[0];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Virtual Work Notice & Guidance Banner */}
      {showVirtualTips && (
        <div className="no-print mb-6 bg-gradient-to-r from-[#1A237E] to-[#283593] text-white p-4 sm:p-5 rounded-2xl shadow-lg border-2 border-[#3949AB] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl text-2xl shrink-0">
              💻
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-[#FFE082]">
                  ¡Perfecto para Clases Virtuales e Impresión Directa!
                </span>
                <span className="text-[10px] bg-[#FFE082] text-[#1A237E] font-black px-2 py-0.5 rounded-full uppercase">
                  PDF / A4
                </span>
              </div>
              <p className="text-xs text-[#E8EAF6] mt-1 max-w-2xl leading-relaxed">
                <b>Cómo usarlo en clases virtuales:</b> Presiona <b>"Imprimir / Guardar en PDF"</b> y en la ventana de impresión selecciona <b>"Guardar como PDF"</b> en lugar de tu impresora. Puedes enviarle el PDF a tus alumnos o proyectar las fichas en pantalla compartida y practicar el trazo digital en la pestaña <b>"✏️ Pizarra de Trazo"</b>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#FFD54F] hover:bg-[#FFE082] text-[#1A237E] font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#1A237E]" />
              <span>Guardar en PDF</span>
            </button>
            <button
              onClick={() => setShowVirtualTips(false)}
              className="text-[#9FA8DA] hover:text-white text-xs px-2 py-1"
              title="Ocultar consejo"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Control Deck (Hidden when printing) */}
      <div className="no-print bg-[#FFFFFF] border-4 border-[#2D1B11] rounded-2xl shadow-lg p-5 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-[#D7CCC8] pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-[#2D1B11] font-title flex items-center gap-2">
              <span>📄 Cuadernillo Imprimible (Formato A4)</span>
            </h2>
            <p className="text-xs text-[#5D4037] mt-0.5">
              Listo para imprimir directamente en papel A4 o guardar como PDF escolar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadHtmlFile}
              className="px-3.5 py-2.5 bg-[#FFF8E1] hover:bg-[#FFE082] text-[#2D1B11] border-2 border-[#FFA000] font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
              title="Descargar archivo .html listo para abrir sin conexión o enviar por WhatsApp/Drive"
            >
              <Download className="w-4 h-4 text-[#C62828]" />
              <span>Descargar Archivo (.html)</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-5 py-2.5 bg-gradient-to-r from-[#C62828] to-[#B71C1C] hover:from-[#D32F2F] hover:to-[#C62828] text-white font-bold text-sm rounded-xl shadow-md flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#FFD54F]" />
              <span>Imprimir / Guardar en PDF</span>
            </button>
          </div>
        </div>

        {/* Configuration Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 text-xs">
          {/* Section Filter */}
          <div>
            <label className="font-bold text-[#5D4037] block mb-1">
              Páginas a Imprimir
            </label>
            <select
              value={printFilter}
              onChange={(e) => setPrintFilter(e.target.value as any)}
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-lg p-2 font-medium text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            >
              <option value="all">Todo el Cuadernillo (Completo)</option>
              <option value="uppercase">Solo Mayúsculas (A - Z)</option>
              <option value="lowercase">Solo Minúsculas (a - z)</option>
              <option value="single">Ficha de Letra Individual</option>
              <option value="diploma">Solo Diploma de Capitán</option>
            </select>
          </div>

          {/* Student Name */}
          <div>
            <label className="font-bold text-[#5D4037] block mb-1">
              Nombre del Pirata
            </label>
            <input
              type="text"
              value={settings.studentName}
              onChange={(e) => onUpdateSettings({ studentName: e.target.value })}
              placeholder="Ej: Capitán Mateo"
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-lg p-2 font-medium text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            />
          </div>

          {/* Ship Name */}
          <div>
            <label className="font-bold text-[#5D4037] block mb-1">
              Nombre del Barco
            </label>
            <input
              type="text"
              value={settings.shipName}
              onChange={(e) => onUpdateSettings({ shipName: e.target.value })}
              placeholder="Ej: El Halcón Dorado"
              className="w-full bg-[#FAF7F2] border-2 border-[#8D6E63] rounded-lg p-2 font-medium text-[#2D1B11] focus:outline-none focus:border-[#C62828]"
            />
          </div>

          {/* Eco friendly & options */}
          <div className="flex flex-col justify-end">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-[#5D4037] p-2 bg-[#F5EBE1] rounded-lg border border-[#D7CCC8]">
              <input
                type="checkbox"
                checked={ecoFriendly}
                onChange={(e) => setEcoFriendly(e.target.checked)}
                className="w-4 h-4 accent-[#C62828]"
              />
              <span>Modo Ahorro de Tinta (B&W)</span>
            </label>
          </div>
        </div>

        {/* If single letter worksheet selected, show quick letter picker */}
        {printFilter === 'single' && (
          <div className="mt-4 pt-4 border-t border-[#D7CCC8]/60 flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-bold text-[#5D4037] shrink-0">Elegir Letra:</span>
            {alphabet.map((item) => (
              <button
                key={item.letter}
                onClick={() => setActiveLetter(item.letter)}
                className={`w-7 h-7 rounded-md font-bold text-xs shrink-0 border transition-all ${
                  activeLetter === item.letter
                    ? 'bg-[#C62828] text-white border-[#2D1B11]'
                    : 'bg-[#F5EBE1] text-[#3E2723] border-[#8D6E63] hover:bg-[#FFE0B2]'
                }`}
              >
                {item.letter}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* PRINTABLE PAGES ENGINE (Formatted to exact A4 Portrait standard) */}
      {/* ============================================================== */}
      <div 
        id="printable-area" 
        className={`mx-auto transition-colors ${
          ecoFriendly ? 'bg-white text-black' : 'bg-[#FDF5E6] text-[#3E2723]'
        }`}
      >
        {/* ======================= 1. PORTADA ======================= */}
        {(printFilter === 'all' || printFilter === 'diploma') && (
          <div className="print-page relative flex flex-col justify-between text-center p-8 sm:p-14 border-8 border-double border-[#8D6E63] rounded-3xl min-h-[920px] mb-12 shadow-md">
            {/* Top decorative corners */}
            <div className="text-right text-xs text-[#8D6E63] font-mono">
              ★ EDICIÓN ESPECIAL APRENDIZAJE ★
            </div>

            <div className="my-auto py-12">
              <div className="text-6xl sm:text-7xl mb-4">🏴‍☠️</div>
              <h1 className="text-4xl sm:text-6xl font-black text-[#C62828] font-pirate tracking-wider drop-shadow-sm mb-2 leading-tight">
                {settings.bookletTitle || 'EL TESORO DE LAS LETRAS'}
              </h1>
              <div className="text-xl sm:text-2xl font-bold text-[#1A237E] font-title mt-2">
                {settings.subtitle || 'Cuadernillo de Práctica Pirata'}
              </div>

              {/* Big Pirate Icons */}
              <div className="text-6xl sm:text-8xl my-10 tracking-widest select-none">
                ⛵ 🗺️ 💰
              </div>

              {/* Name Section */}
              <div className="inline-block bg-white/90 border-4 border-[#8D6E63] rounded-2xl p-6 sm:p-8 shadow-md max-w-md w-full mx-auto">
                <div className="text-lg sm:text-xl font-bold text-[#3E2723] mb-4">
                  <span>Nombre del Pirata:</span>
                  <div className="mt-2 border-b-4 border-dashed border-[#3E2723] pb-1 text-2xl font-handwriting font-bold text-[#C62828] min-h-[38px]">
                    {settings.studentName || ''}
                  </div>
                </div>

                <div className="text-sm sm:text-base font-bold text-[#3E2723]">
                  <span>Barco Pirata:</span>
                  <div className="mt-1 border-b-2 border-dashed border-[#8D6E63] pb-1 text-lg font-handwriting text-[#1A237E] min-h-[28px]">
                    {settings.shipName || ''}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#8D6E63] font-semibold border-t-2 border-[#D7CCC8] pt-4 flex justify-between items-center">
              <span>Cuadernillo de Lectoescritura y Caligrafía</span>
              <span>¡Rumbo al Gran Tesoro!</span>
            </div>
          </div>
        )}

        {/* ======================= 2. LETRAS MAYÚSCULAS ======================= */}
        {(printFilter === 'all' || printFilter === 'uppercase') && (
          <div className="mb-12">
            {/* Section Header */}
            <div className="print-page-break-before bg-[#D32F2F] text-white border-4 border-[#2D1B11] rounded-2xl p-5 mb-8 text-center shadow-md">
              <h2 className="text-3xl sm:text-5xl font-black font-pirate tracking-wide uppercase">
                LETRAS MAYÚSCULAS (A - Z)
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#FFE0B2] mt-1">
                Traza cada letra mayúscula y escribe las palabras del abecedario pirata
              </p>
            </div>

            {/* Alphabet Blocks */}
            <div className="space-y-6">
              {alphabet.map((item) => {
                const rep = item.word.length > 5 ? 3 : 4;
                const repeatedWords = Array.from({ length: rep }, () => item.word);

                return (
                  <div
                    key={`upper-${item.letter}`}
                    className="print-avoid-break bg-white border-4 border-[#2D1B11] rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Block Header */}
                    <div className="bg-[#FFE0B2] border-b-4 border-[#2D1B11] flex items-stretch">
                      <div className="w-20 sm:w-28 bg-[#D32F2F] text-white border-r-4 border-[#2D1B11] font-letter-basic font-black text-5xl sm:text-7xl flex items-center justify-center p-2 shrink-0 select-none">
                        {item.letter}
                      </div>
                      <div className="flex-1 flex justify-around items-center px-4 font-letter-basic text-3xl sm:text-5xl text-[#90A4AE] tracking-widest select-none">
                        {Array.from({ length: 7 }).map((_, i) => (
                          <span key={i} className="hover:text-[#455A64] transition-colors">
                            {item.letter}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Word & Montessori Guidelines Section */}
                    <div className="p-4 sm:p-5 bg-[#FAFAFA] space-y-3">
                      <div className="flex items-center gap-3 text-2xl sm:text-3xl font-extrabold text-[#1A237E] font-letter-basic">
                        <span className="text-3xl sm:text-4xl">{item.emoji}</span>
                        <span className="tracking-wide">{item.word}</span>
                      </div>

                      {/* Row 1: Word repeated for tracing */}
                      <div className="handwriting-renglon font-letter-basic text-2xl sm:text-3xl text-[#78909C] font-bold">
                        {repeatedWords.map((w, idx) => (
                          <span key={idx} className="pb-1 tracking-wider">{w}</span>
                        ))}
                      </div>

                      {/* Row 2: Lighter word trace */}
                      <div className="handwriting-renglon font-letter-basic text-2xl sm:text-3xl text-[#CFD8DC] font-bold">
                        {repeatedWords.map((w, idx) => (
                          <span key={idx} className="pb-1 tracking-wider">{w}</span>
                        ))}
                      </div>

                      {/* Row 3: Blank line for free handwriting */}
                      <div className="handwriting-renglon font-letter-basic text-2xl sm:text-3xl">
                        <span className="text-transparent select-none">{item.word}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 3. LETRAS MINÚSCULAS ======================= */}
        {(printFilter === 'all' || printFilter === 'lowercase') && (
          <div className="mb-12">
            {/* Section Header */}
            <div className="print-page-break-before bg-[#1A237E] text-white border-4 border-[#2D1B11] rounded-2xl p-5 mb-8 text-center shadow-md">
              <h2 className="text-3xl sm:text-5xl font-black font-pirate tracking-wide">
                letras minúsculas (a - z)
              </h2>
              <p className="text-xs sm:text-sm font-medium text-[#BBDEFB] mt-1">
                Practica el trazo de cada letra minúscula y escribe con buena caligrafía
              </p>
            </div>

            {/* Lowercase Alphabet Blocks */}
            <div className="space-y-6">
              {alphabet.map((item) => {
                const letterLower = item.letter.toLowerCase();
                const wordLower = item.word.toLowerCase();
                const rep = wordLower.length > 5 ? 3 : 4;
                const repeatedWords = Array.from({ length: rep }, () => wordLower);

                return (
                  <div
                    key={`lower-${item.letter}`}
                    className="print-avoid-break bg-white border-4 border-[#2D1B11] rounded-2xl overflow-hidden shadow-sm"
                  >
                    {/* Block Header */}
                    <div className="bg-[#E1F5FE] border-b-4 border-[#2D1B11] flex items-stretch">
                      <div className="w-16 sm:w-24 bg-[#1A237E] text-white border-r-4 border-[#2D1B11] font-title font-bold text-4xl sm:text-6xl flex items-center justify-center p-2 shrink-0">
                        {letterLower}
                      </div>
                      <div className="flex-1 flex justify-around items-center px-4 font-handwriting text-3xl sm:text-5xl text-[#B0BEC5] tracking-widest select-none">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <span key={i} className="hover:text-[#78909C] transition-colors">
                            {letterLower}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Word & Guidelines Section */}
                    <div className="p-4 sm:p-5 bg-[#FAFAFA] space-y-3">
                      <div className="flex items-center gap-2 text-xl sm:text-2xl font-bold text-[#C62828] font-title">
                        <span className="text-3xl">{item.emoji}</span>
                        <span>{wordLower}</span>
                      </div>

                      {/* Row 1: Word repeated for tracing */}
                      <div className="handwriting-renglon font-handwriting text-2xl sm:text-3xl text-[#90A4AE] font-bold">
                        {repeatedWords.map((w, idx) => (
                          <span key={idx} className="pb-1">{w}</span>
                        ))}
                      </div>

                      {/* Row 2: Lighter word trace */}
                      <div className="handwriting-renglon font-handwriting text-2xl sm:text-3xl text-[#CFD8DC]">
                        {repeatedWords.map((w, idx) => (
                          <span key={idx} className="pb-1">{w}</span>
                        ))}
                      </div>

                      {/* Row 3: Blank line for free handwriting */}
                      <div className="handwriting-renglon font-handwriting text-2xl sm:text-3xl">
                        <span className="text-transparent select-none">{wordLower}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= 4. FICHA INDIVIDUAL DE LETRA ======================= */}
        {printFilter === 'single' && (
          <div className="print-page border-8 border-double border-[#8D6E63] rounded-3xl p-8 bg-white min-h-[920px]">
            <div className="flex justify-between items-center border-b-4 border-[#2D1B11] pb-3 mb-6">
              <div>
                <span className="font-pirate text-2xl text-[#C62828]">El Tesoro de las Letras</span>
                <h3 className="text-sm text-[#5D4037]">Ficha de Práctica Pirata: Letra {currentSingleItem.letter}</h3>
              </div>
              <div className="text-right text-xs">
                <div><b>Pirata:</b> ____________________</div>
                <div><b>Fecha:</b> ____________________</div>
              </div>
            </div>

            {/* Giant Letter Showcase & Color Box */}
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div className="col-span-1 bg-[#FFE0B2] border-4 border-[#2D1B11] rounded-2xl flex flex-col items-center justify-center p-6 text-center">
                <span className="text-8xl sm:text-9xl font-black font-letter-basic text-[#C62828] leading-none">
                  {currentSingleItem.letter}
                </span>
                <span className="text-4xl sm:text-6xl font-bold font-letter-basic text-[#1A237E] mt-3">
                  {currentSingleItem.letter.toLowerCase()}
                </span>
              </div>

              <div className="col-span-2 border-4 border-dashed border-[#8D6E63] rounded-2xl p-6 flex flex-col justify-between bg-[#FFFDE7]">
                <div className="flex items-center gap-3">
                  <span className="text-5xl">{currentSingleItem.emoji}</span>
                  <div>
                    <h4 className="text-3xl font-black text-[#1A237E] font-letter-basic tracking-wide">
                      {currentSingleItem.word}
                    </h4>
                    <p className="text-xs text-[#5D4037] italic mt-1">
                      {currentSingleItem.description}
                    </p>
                  </div>
                </div>

                <div className="border-2 border-[#D7CCC8] rounded-xl p-3 bg-white text-center mt-4">
                  <span className="text-xs text-[#8D6E63] block font-semibold">
                    🎨 Dibuja aquí tu {currentSingleItem.word.toLowerCase()}:
                  </span>
                  <div className="h-28" />
                </div>
              </div>
            </div>

            {/* Tracing lines */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-[#2D1B11] uppercase tracking-wider">
                1. Traza la letra mayúscula:
              </h4>
              <div className="handwriting-renglon font-handwriting text-4xl text-[#90A4AE]">
                {Array.from({ length: 9 }).map((_, i) => (
                  <span key={i}>{currentSingleItem.letter}</span>
                ))}
              </div>

              <h4 className="font-bold text-sm text-[#2D1B11] uppercase tracking-wider mt-4">
                2. Traza la letra minúscula:
              </h4>
              <div className="handwriting-renglon font-handwriting text-4xl text-[#90A4AE]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i}>{currentSingleItem.letter.toLowerCase()}</span>
                ))}
              </div>

              <h4 className="font-bold text-sm text-[#2D1B11] uppercase tracking-wider mt-4">
                3. Escribe la palabra:
              </h4>
              <div className="handwriting-renglon font-handwriting text-3xl text-[#B0BEC5]">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i}>{currentSingleItem.word}</span>
                ))}
              </div>
              <div className="handwriting-renglon font-handwriting text-3xl">
                <span className="text-transparent select-none">{currentSingleItem.word}</span>
              </div>
            </div>
          </div>
        )}

        {/* ======================= 5. DIPLOMA FINAL ======================= */}
        {(printFilter === 'all' || printFilter === 'diploma') && (
          <div className="print-page-break-before relative border-8 border-[#FFC107] outline-4 outline-[#D32F2F] -outline-offset-8 rounded-3xl p-8 sm:p-14 bg-white/95 text-center min-h-[920px] flex flex-col justify-between shadow-xl">
            <div className="text-6xl sm:text-8xl mt-4 select-none">
              🎉 🏆 🦜
            </div>

            <div className="my-auto py-6">
              <h1 className="text-4xl sm:text-6xl font-black text-[#C62828] font-pirate tracking-wide leading-tight">
                ¡GRAN TRABAJO, CAPITÁN!
              </h1>

              <div className="my-6">
                <span className="text-xs uppercase tracking-widest text-[#8D6E63] font-bold block mb-1">
                  SE OTORGA ESTE DIPLOMA DE NAVEGACIÓN Y CALIGRAFÍA A:
                </span>
                <div className="text-3xl sm:text-5xl font-extrabold text-[#1A237E] font-title border-b-4 border-[#2D1B11] pb-2 inline-block min-w-[320px]">
                  {settings.studentName || 'Valiente Marinero'}
                </div>
              </div>

              <p className="text-lg sm:text-2xl font-bold text-[#3E2723] max-w-xl mx-auto leading-relaxed">
                ¡Has completado el abecedario pirata entero<br />
                y encontraste el gran tesoro de las letras!
              </p>

              <div className="flex items-center justify-center gap-6 my-8 text-sm text-[#5D4037]">
                <div className="px-4 py-2 bg-[#FFF8E1] border-2 border-[#FFC107] rounded-xl font-bold">
                  ⚓ Navío: {settings.shipName || 'Los Siete Mares'}
                </div>
                <div className="px-4 py-2 bg-[#FFF8E1] border-2 border-[#FFC107] rounded-xl font-bold">
                  🪙 27 Letras Conquistadas
                </div>
              </div>
            </div>

            {/* Signature & Seal */}
            <div className="mt-8 flex justify-around items-end pt-6 border-t-2 border-[#D7CCC8]">
              <div className="text-center">
                <div className="w-40 border-b-4 border-[#3E2723] mb-2 mx-auto">
                  <span className="font-handwriting text-xl text-[#8D6E63] italic">Barbanegra</span>
                </div>
                <span className="text-xs font-bold text-[#3E2723] uppercase">
                  Firma del Gran Almirante
                </span>
              </div>

              {/* Pirate Stamp Seal */}
              <div className="w-20 h-20 rounded-full border-4 border-[#C62828] text-[#C62828] flex flex-col items-center justify-center p-1 text-center font-bold text-[9px] uppercase tracking-tighter rotate-[-12deg] select-none">
                <span className="text-lg">⭐</span>
                <span>SELLO OFICIAL</span>
                <span>PIRATA</span>
              </div>

              <div className="text-center">
                <div className="w-40 border-b-4 border-[#3E2723] mb-2 mx-auto">
                  <span className="font-handwriting text-xl text-[#1A237E] italic">
                    {settings.studentName || 'Capitán'}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#3E2723] uppercase">
                  Firma del Capitán
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
