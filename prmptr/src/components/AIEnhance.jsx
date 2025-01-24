import React, { useState } from 'react';
import enhancePrompt from '../services/enhanceService';
import randomData from '../assets/random.json';

function AIEnhance({ currentPrompt, onEnhancedPrompt }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remainingRequests, setRemainingRequests] = useState(null);

  const handleEnhance = async () => {
    if (!currentPrompt || randomData.placeholderPrompts.includes(currentPrompt)) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await enhancePrompt(currentPrompt);
      onEnhancedPrompt(response.enhancedPrompt);
      
      // Update remaining requests if available
      if (response.remaining) {
        setRemainingRequests(response.remaining);
      }
    } catch (error) {
      if (error.message.includes('Too Many Requests')) {
        setError('Rate limit reached. Please wait a moment.');
      } else {
        setError('Failed to enhance prompt. Please try again.');
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleEnhance}
        disabled={isLoading || !currentPrompt || currentPrompt === "Your prompt will appear here..."}
        className={`px-4 py-2 bg-prmptrblack text-brown1 border-2 hover:text-green1 ${
          error ? 'border-red-500' : 'border-brown2 hover:border-green1'
        } transition-colors duration-200`}
      >
        {isLoading ? 'Enhancing...' : error ? 'Please Wait' : 'AI Enhance'}
      </button>
      {(error || remainingRequests) && (
        <div className="absolute left-0 right-0 mt-1 text-center">
          {error && (
            <p className="text-red-500 text-xs bg-prmptrblack px-2 py-1 rounded border border-red-500">
              {error}
            </p>
          )}
          {!error && remainingRequests && (
            <p className="text-brown2 text-xs">
              {remainingRequests} remaining
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default AIEnhance; 
