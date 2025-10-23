import React, { useState } from 'react';
import { DebugInfo } from '../types';
import { ClipboardIcon, CheckIcon, CodeBracketIcon } from './icons';

interface DebugWindowProps {
  debugInfo: DebugInfo;
}

const DebugSection: React.FC<{ title: string; content: string; isJson?: boolean }> = ({ title, content, isJson = false }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedContent = isJson ? JSON.stringify(JSON.parse(content), null, 2) : content;

  return (
    <div>
      <div className="flex justify-between items-center bg-gray-700/50 p-2 rounded-t-md">
        <h4 className="font-semibold text-gray-300">{title}</h4>
        <button
          onClick={handleCopy}
          className="p-1.5 bg-gray-600 hover:bg-gray-500 rounded-md transition-colors"
          title="Copy to Clipboard"
        >
          {copied ? <CheckIcon /> : <ClipboardIcon />}
        </button>
      </div>
      <pre className="bg-gray-900/70 p-4 rounded-b-md overflow-x-auto text-sm text-gray-300 max-h-60">
        <code>{formattedContent}</code>
      </pre>
    </div>
  );
};


const DebugWindow: React.FC<DebugWindowProps> = ({ debugInfo }) => {
  return (
    <div className="bg-gray-800/80 border-t-2 border-indigo-800 backdrop-blur-sm p-4 mt-auto">
        <div className="flex items-center gap-3 mb-4">
            <CodeBracketIcon />
            <h3 className="text-xl font-bold text-gray-200">Debug & AI Inspector</h3>
        </div>
      <div className="space-y-4">
        <DebugSection title="Request Prompt" content={debugInfo.prompt} />
        <DebugSection title="Generation Config" content={JSON.stringify(debugInfo.config, null, 2)} />
        <DebugSection title="Raw Model Output" content={debugInfo.rawResponse} />
      </div>
    </div>
  );
};

export default DebugWindow;
