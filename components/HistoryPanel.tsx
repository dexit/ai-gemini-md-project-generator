import React from 'react';
import { HistoryItem } from '../types';
import { TrashIcon, XMarkIcon } from './icons';

interface HistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ isOpen, onClose, history, onLoad, onDelete, onClear }) => {
  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-800 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-white">Generation History</h2>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700">
              <XMarkIcon />
            </button>
          </header>
          
          {history.length > 0 ? (
            <>
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {history.map((item) => (
                  <div key={item.id} className="bg-gray-700 p-3 rounded-lg flex items-start justify-between gap-2">
                    <div className="flex-grow">
                      <p className="font-semibold text-indigo-300 truncate">{item.spec.projectName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                       <button onClick={() => onLoad(item)} className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-3 py-1 rounded-md transition-colors">
                        Load
                      </button>
                      <button onClick={() => onDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-gray-600 rounded-md transition-colors" title="Delete Item">
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <footer className="p-4 border-t border-gray-700">
                <button
                  onClick={onClear}
                  className="w-full text-center bg-red-600/80 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                  Clear All History
                </button>
              </footer>
            </>
          ) : (
             <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
                <p className="text-gray-400">No history yet.</p>
                <p className="text-sm text-gray-500">Generated plans will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPanel;
