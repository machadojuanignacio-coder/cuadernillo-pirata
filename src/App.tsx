import React, { useState, useEffect } from 'react';
import { PirateHeader } from './components/PirateHeader';
import { TreasureMap } from './components/TreasureMap';
import { InteractiveTracer } from './components/InteractiveTracer';
import { PrintWorkbook } from './components/PrintWorkbook';
import { VocabularyEditor } from './components/VocabularyEditor';
import { PirateMiniGame } from './components/PirateMiniGame';
import { PirateDiplomaView } from './components/PirateDiplomaView';
import { 
  DEFAULT_PIRATE_ALPHABET, 
  DEFAULT_SETTINGS, 
  PirateLetterItem, 
  WorkbookSettings 
} from './data/pirateAlphabet';

export default function App() {
  // Load saved state from localStorage with safe fallback
  const [alphabet, setAlphabet] = useState<PirateLetterItem[]>(() => {
    try {
      const saved = localStorage.getItem('pirate_alphabet_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Failed to load custom alphabet', e);
    }
    return DEFAULT_PIRATE_ALPHABET;
  });

  const [settings, setSettings] = useState<WorkbookSettings>(() => {
    try {
      const saved = localStorage.getItem('pirate_settings_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Failed to load settings', e);
    }
    return DEFAULT_SETTINGS;
  });

  const [completedLetters, setCompletedLetters] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('pirate_completed_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.debug('Failed to load progress', e);
    }
    return {}; // Fresh start for each student
  });

  const [currentTab, setCurrentTab] = useState<'map' | 'tracer' | 'workbook' | 'editor' | 'game' | 'diploma'>('workbook');
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number>(0);

  // Persistence effects
  useEffect(() => {
    try {
      localStorage.setItem('pirate_alphabet_v1', JSON.stringify(alphabet));
    } catch (e) {
      console.debug(e);
    }
  }, [alphabet]);

  useEffect(() => {
    try {
      localStorage.setItem('pirate_settings_v1', JSON.stringify(settings));
    } catch (e) {
      console.debug(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('pirate_completed_v1', JSON.stringify(completedLetters));
    } catch (e) {
      console.debug(e);
    }
  }, [completedLetters]);

  const handleToggleComplete = (letter: string) => {
    setCompletedLetters(prev => ({
      ...prev,
      [letter]: !prev[letter]
    }));
  };

  const handleUpdateSettings = (newSettings: Partial<WorkbookSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleResetToDefaults = () => {
    setAlphabet(DEFAULT_PIRATE_ALPHABET);
    setSettings(DEFAULT_SETTINGS);
  };

  const handleSelectLetterForTrace = (index: number) => {
    setSelectedLetterIndex(index);
    setCurrentTab('tracer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickPrint = () => {
    setCurrentTab('workbook');
    setTimeout(() => {
      window.print();
    }, 250);
  };

  const completedCount = Object.values(completedLetters).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#2D1B11] flex flex-col font-sans selection:bg-[#FFE082] selection:text-[#2D1B11]">
      {/* Pirate Navigation Header (Top Bar Contract) */}
      <PirateHeader
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onQuickPrint={handleQuickPrint}
        completedCount={completedCount}
        totalLetters={alphabet.length}
        alphabet={alphabet}
        settings={settings}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-6">
        {currentTab === 'map' && (
          <TreasureMap
            alphabet={alphabet}
            completedLetters={completedLetters}
            onSelectLetterForTrace={handleSelectLetterForTrace}
            onToggleComplete={handleToggleComplete}
            onOpenDiploma={() => setCurrentTab('diploma')}
            studentName={settings.studentName}
          />
        )}

        {currentTab === 'tracer' && (
          <InteractiveTracer
            alphabet={alphabet}
            selectedIndex={selectedLetterIndex}
            onSelectIndex={setSelectedLetterIndex}
            completedLetters={completedLetters}
            onToggleComplete={handleToggleComplete}
          />
        )}

        {currentTab === 'workbook' && (
          <PrintWorkbook
            alphabet={alphabet}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            selectedLetterForWorksheet={alphabet[selectedLetterIndex]?.letter || 'A'}
          />
        )}

        {currentTab === 'editor' && (
          <VocabularyEditor
            alphabet={alphabet}
            onUpdateAlphabet={setAlphabet}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetToDefaults={handleResetToDefaults}
          />
        )}

        {currentTab === 'game' && (
          <PirateMiniGame
            alphabet={alphabet}
            studentName={settings.studentName}
          />
        )}

        {currentTab === 'diploma' && (
          <PirateDiplomaView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            completedCount={completedCount}
            totalLetters={alphabet.length}
          />
        )}
      </main>

      {/* Footer (Quiet & Anti-slop) */}
      <footer className="no-print bg-[#2D1B11] text-[#D7CCC8] border-t-2 border-[#5D4037] py-6 px-4 text-center text-xs">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🏴‍☠️</span>
            <span className="font-pirate text-base text-[#FFD54F]">El Tesoro de las Letras</span>
            <span>· Cuadernillo Caligráfico Pirata A4</span>
          </div>

          <div className="text-[11px] text-[#A1887F]">
            Pauta Montessori con línea discontinua central para lectoescritura infantil
          </div>
        </div>
      </footer>
    </div>
  );
}
