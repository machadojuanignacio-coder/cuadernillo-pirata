import React, { useRef, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  RotateCcw, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles,
  Eraser,
  PenTool,
  Award,
  Download,
  Share2
} from 'lucide-react';
import { PirateLetterItem } from '../data/pirateAlphabet';
import { playPirateCoin, playTreasureFanfare, speakPirateLetter } from '../utils/soundEffects';

interface InteractiveTracerProps {
  alphabet: PirateLetterItem[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  completedLetters: Record<string, boolean>;
  onToggleComplete: (letter: string) => void;
}

export const InteractiveTracer: React.FC<InteractiveTracerProps> = ({
  alphabet,
  selectedIndex,
  onSelectIndex,
  completedLetters,
  onToggleComplete
}) => {
  const currentItem = alphabet[selectedIndex] || alphabet[0];
  const [caseMode, setCaseMode] = useState<'upper' | 'lower' | 'word'>('upper');
  const [color, setColor] = useState<string>('#D4AF37'); // Gold ink by default
  const [brushSize, setBrushSize] = useState<number>(14);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [hasDrawn, setHasDrawn] = useState<boolean>(false);
  const [showGuide, setShowGuide] = useState<boolean>(true);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef<boolean>(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const displayTarget = 
    caseMode === 'upper' 
      ? currentItem.letter 
      : caseMode === 'lower' 
        ? currentItem.letter.toLowerCase() 
        : currentItem.word;

  const isCompleted = !!completedLetters[currentItem.letter];

  // Colors available
  const palette = [
    { name: 'Oro Pirata', hex: '#D4AF37', border: '#B8860B' },
    { name: 'Tinta Marina', hex: '#1E293B', border: '#0F172A' },
    { name: 'Rubí Real', hex: '#DC2626', border: '#991B1B' },
    { name: 'Esmeralda', hex: '#059669', border: '#047857' },
    { name: 'Zafiro', hex: '#2563EB', border: '#1D4ED8' },
  ];

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set internal resolution matching display
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    clearCanvas();
  }, [selectedIndex, caseMode]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasDrawn(false);
  };

  const handleDownloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Create a temporary canvas with guidelines and student stroke for exporting
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;
    const eCtx = exportCanvas.getContext('2d');
    if (!eCtx) return;

    // Background
    eCtx.fillStyle = '#FFFFFF';
    eCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);

    // Header label
    eCtx.fillStyle = '#C62828';
    eCtx.font = 'bold 28px sans-serif';
    eCtx.fillText(`El Tesoro de las Letras: Letra ${currentItem.letter} - ${currentItem.word}`, 30, 45);

    // Draw user drawing
    eCtx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `trazo_${currentItem.letter}_${currentItem.word}.png`;
    link.href = exportCanvas.toDataURL('image/png');
    link.click();
    playPirateCoin();
  };

  const getCanvasCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    isDrawing.current = true;
    const pos = getCanvasCoordinates(e);
    lastPoint.current = pos;
    drawPoint(pos.x, pos.y);
    setHasDrawn(true);
  };

  const drawPoint = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize * 1.5, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  };

  const drawMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPos = getCanvasCoordinates(e);
    if (!lastPoint.current) {
      lastPoint.current = currentPos;
      return;
    }

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize * 2.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
      ctx.lineTo(currentPos.x, currentPos.y);
      ctx.stroke();
    }
    ctx.restore();

    lastPoint.current = currentPos;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const handleSound = () => {
    playPirateCoin();
    speakPirateLetter(currentItem.letter, currentItem.word);
  };

  const handleCelebrate = () => {
    playTreasureFanfare();
    onToggleComplete(currentItem.letter);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#C62828', '#1A237E', '#4CAF50']
      });
    } catch (e) {
      console.debug('Confetti error', e);
    }
  };

  const handlePrev = () => {
    const nextIdx = selectedIndex > 0 ? selectedIndex - 1 : alphabet.length - 1;
    onSelectIndex(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = selectedIndex < alphabet.length - 1 ? selectedIndex + 1 : 0;
    onSelectIndex(nextIdx);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6">
      {/* Top Navigator Card */}
      <div className="bg-[#FFFFFF] border-4 border-[#2D1B11] rounded-2xl shadow-lg p-4 sm:p-5 mb-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Previous Letter Button */}
          <button
            onClick={handlePrev}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F5EBE1] hover:bg-[#EBDDCF] text-[#3E2723] rounded-xl font-bold border-2 border-[#8D6E63] active:scale-95 transition-all cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5 text-[#C62828]" />
            <span className="hidden sm:inline">Anterior</span>
          </button>

          {/* Letter & Word Title Showcase */}
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-[#D32F2F] text-white border-3 border-[#2D1B11] rounded-2xl flex items-center justify-center font-black font-letter-basic text-4xl shadow-md select-none">
              {currentItem.letter}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-3xl">{currentItem.emoji}</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#1A237E] font-letter-basic tracking-wide">
                  {currentItem.word}
                </h2>
                <button
                  onClick={handleSound}
                  className="p-2 bg-[#FFE082] hover:bg-[#FFD54F] text-[#2D1B11] border-2 border-[#FFA000] rounded-xl active:scale-90 transition-all cursor-pointer shadow-sm"
                  title="Escuchar pronunciación pirata"
                >
                  <Volume2 className="w-4 h-4 text-[#C62828]" />
                </button>
              </div>
              <p className="text-xs text-[#5D4037] font-medium max-w-md hidden sm:block">
                {currentItem.description}
              </p>
            </div>
          </div>

          {/* Next Letter Button */}
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#F5EBE1] hover:bg-[#EBDDCF] text-[#3E2723] rounded-xl font-bold border-2 border-[#8D6E63] active:scale-95 transition-all cursor-pointer"
          >
            <span className="hidden sm:inline">Siguiente</span>
            <ChevronRight className="w-5 h-5 text-[#C62828]" />
          </button>
        </div>

        {/* Quick Letter Carousel Pill Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 mt-4 border-t border-[#D7CCC8]/60 scrollbar-thin">
          {alphabet.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            const isDone = !!completedLetters[item.letter];
            return (
              <button
                key={item.letter}
                onClick={() => onSelectIndex(idx)}
                className={`w-9 h-9 rounded-lg font-black font-letter-basic text-sm shrink-0 transition-all flex items-center justify-center border-2 ${
                  isSelected
                    ? 'bg-[#C62828] text-white border-[#2D1B11] shadow-md scale-105'
                    : isDone
                      ? 'bg-[#E8F5E9] text-[#2E7D32] border-[#81C784]'
                      : 'bg-[#FAFAFA] text-[#4E342E] border-[#D7CCC8] hover:bg-[#FFE0B2]'
                }`}
              >
                {item.letter}
                {isDone && !isSelected && (
                  <span className="absolute -top-1 -right-1 text-[8px]">⭐</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tracing Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 cols: Canvas Stage */}
        <div className="lg:col-span-3">
          <div className="bg-[#FFFFFF] border-4 border-[#2D1B11] rounded-2xl shadow-xl overflow-hidden relative">
            {/* Stage Header Controls */}
            <div className="bg-[#FFE0B2] border-b-4 border-[#2D1B11] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              {/* Mode switch */}
              <div className="flex items-center gap-1 bg-[#FFFFFF] p-1 rounded-xl border-2 border-[#8D6E63]">
                <button
                  onClick={() => setCaseMode('upper')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    caseMode === 'upper'
                      ? 'bg-[#C62828] text-white shadow-sm'
                      : 'text-[#5D4037] hover:bg-[#F5EBE1]'
                  }`}
                >
                  Mayúscula ({currentItem.letter})
                </button>
                <button
                  onClick={() => setCaseMode('lower')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    caseMode === 'lower'
                      ? 'bg-[#C62828] text-white shadow-sm'
                      : 'text-[#5D4037] hover:bg-[#F5EBE1]'
                  }`}
                >
                  minúscula ({currentItem.letter.toLowerCase()})
                </button>
                <button
                  onClick={() => setCaseMode('word')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    caseMode === 'word'
                      ? 'bg-[#C62828] text-white shadow-sm'
                      : 'text-[#5D4037] hover:bg-[#F5EBE1]'
                  }`}
                >
                  Palabra ({currentItem.word})
                </button>
              </div>

              {/* Guide visibility toggle */}
              <button
                onClick={() => setShowGuide(!showGuide)}
                className={`text-xs px-2.5 py-1 rounded-lg border-2 font-semibold transition-all ${
                  showGuide 
                    ? 'bg-[#FFF8E1] text-[#795548] border-[#FFB300]'
                    : 'bg-white text-[#9E9E9E] border-[#E0E0E0]'
                }`}
              >
                {showGuide ? '👁️ Guía Visible' : '🙈 Sin Guía'}
              </button>
            </div>

            {/* Canvas Surface with Montessori Guidelines Background */}
            <div 
              className="relative w-full h-[360px] sm:h-[420px] bg-[#FDFBF7] touch-none select-none flex items-center justify-center overflow-hidden"
              style={{
                backgroundImage: 'radial-gradient(#E0D7C6 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            >
              {/* Montessori Handwriting Lines Overlay */}
              <div className="absolute inset-x-8 inset-y-12 flex flex-col justify-around pointer-events-none opacity-80">
                <div className="w-full relative">
                  <div className="h-0 border-t-3 border-[#795548]" />
                  <div className="h-0 border-t-2 border-dashed border-[#BCAAA4] my-10 sm:my-14" />
                  <div className="h-0 border-t-3 border-[#795548]" />
                </div>
              </div>

              {/* Ghost Guide Character Layer */}
              {showGuide && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                  {caseMode === 'word' ? (
                    <div className="font-letter-basic text-5xl sm:text-7xl font-black tracking-widest text-[#B0BEC5]/70 text-center px-4">
                      {displayTarget}
                    </div>
                  ) : (
                    <div className="font-letter-basic text-[180px] sm:text-[230px] font-black text-[#CFD8DC]/85 flex items-center justify-center leading-none">
                      {displayTarget}
                    </div>
                  )}
                </div>
              )}

              {/* Active Drawing Canvas */}
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={drawMove}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={drawMove}
                onTouchEnd={stopDrawing}
                className="absolute inset-0 w-full h-full cursor-crosshair z-10"
              />

              {/* Helper guide hint banner */}
              <div className="absolute bottom-2 left-3 right-3 bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#D7CCC8] rounded-xl px-3 py-1.5 flex items-center justify-between text-xs text-[#5D4037] pointer-events-none z-20">
                <span className="font-medium truncate">
                  💡 <span className="font-bold">Consejo:</span> {currentItem.strokeHint}
                </span>
                <span className="text-[10px] text-[#8D6E63] shrink-0 ml-2">
                  Usa ratón o dedo para trazar
                </span>
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="bg-[#FAF7F2] border-t-3 border-[#2D1B11] p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCanvas}
                  className="px-3 py-2 bg-white hover:bg-[#FFEBEE] text-[#C62828] border-2 border-[#EF9A9A] rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Borrar Todo</span>
                </button>

                <button
                  onClick={handleDownloadCanvas}
                  className="px-3 py-2 bg-white hover:bg-[#E8EAF6] text-[#1A237E] border-2 border-[#C5CAE9] rounded-xl font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                  title="Descargar imagen del trazo realizado"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PNG</span>
                </button>
              </div>

              {/* Completion Celebration Button */}
              <button
                onClick={handleCelebrate}
                className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 cursor-pointer ${
                  isCompleted
                    ? 'bg-[#2E7D32] hover:bg-[#1B5E20] text-white border-2 border-[#1B5E20]'
                    : 'bg-gradient-to-r from-[#FFB300] to-[#F57C00] hover:from-[#FFA000] hover:to-[#E65100] text-[#2D1B11] border-2 border-[#B78103]'
                }`}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" />
                    <span>¡Letra {currentItem.letter} Dominada! ⭐</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#2D1B11]" />
                    <span>¡He completado el trazo!</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 col: Pirate Toolbox */}
        <div className="lg:col-span-1 space-y-4">
          {/* Tool Selector Card */}
          <div className="bg-[#FFFFFF] border-3 border-[#2D1B11] rounded-2xl p-4 shadow-md">
            <h3 className="text-xs font-bold text-[#5D4037] uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-[#C62828]" />
              <span>Herramientas Pirata</span>
            </h3>

            {/* Pen vs Eraser */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                onClick={() => setIsEraser(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-2 transition-all ${
                  !isEraser
                    ? 'bg-[#FFE0B2] text-[#2D1B11] border-[#2D1B11] shadow-xs'
                    : 'bg-[#FAFAFA] text-[#8D6E63] border-[#E0E0E0] hover:bg-[#F5F5F5]'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Pluma</span>
              </button>
              <button
                onClick={() => setIsEraser(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border-2 transition-all ${
                  isEraser
                    ? 'bg-[#FFE0B2] text-[#2D1B11] border-[#2D1B11] shadow-xs'
                    : 'bg-[#FAFAFA] text-[#8D6E63] border-[#E0E0E0] hover:bg-[#F5F5F5]'
                }`}
              >
                <Eraser className="w-3.5 h-3.5" />
                <span>Borrador</span>
              </button>
            </div>

            {/* Color Palette (Active when not eraser) */}
            {!isEraser && (
              <div className="space-y-2 mb-4">
                <label className="text-[11px] font-semibold text-[#8D6E63]">
                  Tinta del Navío
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {palette.map((p) => {
                    const isSelected = color === p.hex;
                    return (
                      <button
                        key={p.hex}
                        onClick={() => setColor(p.hex)}
                        className={`w-full aspect-square rounded-xl border-3 transition-transform active:scale-90 ${
                          isSelected ? 'border-[#2D1B11] scale-110 shadow-sm' : 'border-transparent hover:scale-105'
                        }`}
                        style={{ backgroundColor: p.hex }}
                        title={p.name}
                      />
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brush Thickness */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-semibold text-[#8D6E63]">
                <span>Grosor de Trazo</span>
                <span className="font-bold text-[#2D1B11]">{brushSize}px</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[8, 14, 22].map((size) => (
                  <button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    className={`py-1.5 rounded-lg border-2 text-xs font-bold flex items-center justify-center transition-all ${
                      brushSize === size
                        ? 'bg-[#C62828] text-white border-[#2D1B11]'
                        : 'bg-[#F5EBE1] text-[#5D4037] border-[#D7CCC8]'
                    }`}
                  >
                    {size === 8 ? 'Fino' : size === 14 ? 'Medio' : 'Grueso'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Letter Info & Captain Badge Card */}
          <div className="bg-[#FFF8E1] border-3 border-[#FFB300] rounded-2xl p-4 shadow-sm text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#FFE082] border-2 border-[#FFA000] flex items-center justify-center text-2xl mb-2">
              {currentItem.emoji}
            </div>
            <h4 className="font-bold text-sm text-[#2D1B11]">{currentItem.word}</h4>
            <p className="text-xs text-[#6D4C41] mt-1 italic">
              «{currentItem.description}»
            </p>

            <div className="mt-4 pt-3 border-t border-[#FFE082] flex items-center justify-around text-xs">
              <div className="text-center">
                <span className="text-[10px] text-[#8D6E63] uppercase block font-medium">Estado</span>
                <span className={`font-bold ${isCompleted ? 'text-[#2E7D32]' : 'text-[#C62828]'}`}>
                  {isCompleted ? '✓ Conquistada' : 'En práctica'}
                </span>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-[#8D6E63] uppercase block font-medium">Categoría</span>
                <span className="font-bold capitalize text-[#1A237E]">{currentItem.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
