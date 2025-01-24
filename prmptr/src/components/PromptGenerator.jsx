import React, { useState } from 'react';

function PromptGenerator({ prompt, onClear, AIEnhance }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy:', err);
      
      // Fallback method
      try {
        const textArea = document.createElement('textarea');
        textArea.value = prompt;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
    }
  };

  return (
    <div className="w-full max-w-[1280px] p-4">
      <div className="min-h-[200px]">
        <p key={prompt} className="text-3xl leading-10 font-medium text-brown3 mb-4 hover:text-brown2 animate-fade-in">
          {prompt}
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={copyToClipboard}
          className={`px-4 py-2 border-2 transition-all duration-200 
            ${copied 
              ? 'bg-green1 text-prmptrblack font-bold border-brown2 min-w-[180px]' 
              : 'bg-prmptrblack text-brown1 border-brown2 min-w-[180px] hover:border-green1 hover:text-green1 hover:shadow-xl hover:scale-105 ease-in-out duration-300 min-w-[160px]'
            }`}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        {AIEnhance}
        <button
          onClick={onClear}
          className="px-4 py-2 text-prmptrblack border-2 border-brown2 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export default PromptGenerator;
