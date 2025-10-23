import React from 'react';
import { GeminiLogo, ClockIcon, ArrowUpOnSquareIcon, ArrowDownOnSquareIcon } from './icons';

interface HeaderProps {
    onToggleHistory: () => void;
    onImport: () => void;
    onExport: () => void;
}

const Header: React.FC<HeaderProps> = ({ onToggleHistory, onImport, onExport }) => {
  return (
    <header className="bg-gray-800 shadow-md p-4 flex items-center justify-between border-b border-gray-700 flex-wrap gap-4">
      <div className="flex items-center gap-4">
        <GeminiLogo />
        <div>
          <h1 className="text-2xl font-bold text-white">AI Project Spec Generator</h1>
          <p className="text-gray-400 text-sm">Craft detailed PHP plans with the power of Gemini</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
         <button onClick={onImport} title="Import Spec from JSON" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
            <ArrowDownOnSquareIcon />
            Import
        </button>
        <button onClick={onExport} title="Export Spec to JSON" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
            <ArrowUpOnSquareIcon />
            Export
        </button>
         <button onClick={onToggleHistory} title="View Generation History" className="flex items-center gap-2 text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors">
            <ClockIcon />
            History
        </button>
      </div>
    </header>
  );
};

export default Header;
