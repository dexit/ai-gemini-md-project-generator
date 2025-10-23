
import React, { useState } from 'react';
import { ClipboardIcon, CheckIcon } from './icons';

interface OutputDisplayProps {
  plan: string;
  isLoading: boolean;
  error: string | null;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ plan, isLoading, error }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(plan);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
        <div className="p-6 flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-400">Generating your project plan...</p>
            <p className="text-sm text-gray-500">The AI is architecting your project. This might take a moment.</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-400">
        <h3 className="text-xl font-bold">An Error Occurred</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 text-gray-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-400 mt-4">Your Plan Will Appear Here</h3>
        <p className="text-gray-500 mt-1">Configure your project on the left and click "Generate with AI" to start.</p>
      </div>
    );
  }

  // A simple markdown to HTML converter for basic formatting
  const formattedPlan = plan
    .replace(/^(#\s.+)$/gm, '<h1 class="text-3xl font-bold mt-6 mb-3 text-indigo-300">$1</h1>')
    .replace(/^(##\s.+)$/gm, '<h2 class="text-2xl font-bold mt-5 mb-2 text-indigo-400 border-b border-gray-600 pb-1">$1</h2>')
    .replace(/^(###\s.+)$/gm, '<h3 class="text-xl font-bold mt-4 mb-2 text-gray-200">$1</h3>')
    .replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-yellow-300 px-1 py-0.5 rounded text-sm">$1</code>')
    .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-900/50 p-4 rounded-md overflow-x-auto my-4"><code class="text-sm">$1</code></pre>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br />')
    .replace(/<br \/>- /g, '<li class="ml-6 list-disc">')
    .replace(/<br \/><br \/>/g, '<br />');

  return (
    <div className="relative p-6">
        <button
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors"
            title="Copy to Clipboard"
        >
            {copied ? <CheckIcon /> : <ClipboardIcon />}
        </button>
        <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-li:text-gray-300" dangerouslySetInnerHTML={{ __html: formattedPlan }} />
    </div>
  );
};

export default OutputDisplay;
