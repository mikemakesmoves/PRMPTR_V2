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
    <div className="w-full max-w-[1280px] p-4 bg-prmptroffwhite rounded-md shadow-xl shadow-prmptrblack/10 relative">
      <div className="min-h-[120px] md:min-h-[200px] flex items-center">
        <p 
          key={prompt} 
          className="text-xl p-4 md:text-3xl leading-8 md:leading-10 font-medium text-brown3 mb-4 hover:text-brown2 animate-fade-in"
        >
          {prompt}
        </p>
      </div>
      <div className="flex flex-wrap p-4 gap-2 md:gap-4">
        <button
          onClick={copyToClipboard}
          className={`px-2 py-1 rounded-md md:px-4 md:py-2 text-sm md:text-base border-2 transition-all duration-200 
            ${copied 
              ? 'bg-green1 text-prmptrblack font-bold border-brown2 min-w-[140px] md:min-w-[180px]' 
              : 'bg-prmptrblack text-brown1 border-brown2 min-w-[140px] md:min-w-[180px] hover:border-green1 hover:text-green1 hover:shadow-xl hover:scale-105 ease-in-out duration-300'
            }`}
        >
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </button>
        {AIEnhance}
        <button
          onClick={onClear}
          className="px-2 py-1 rounded-md md:px-4 md:py-2 text-sm md:text-base text-prmptrblack border-2 border-brown2 hover:border-red-500 hover:text-red-500 transition-colors duration-200"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

export default PromptGenerator;
