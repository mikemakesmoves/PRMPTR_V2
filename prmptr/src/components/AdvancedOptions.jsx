import React, { useState } from 'react';

const aspectRatios = [
  { name: '16:9', value: '--ar 16:9' },
  { name: '4:5', value: '--ar 4:5' },
  { name: '1:1', value: '--ar 1:1' },
  { name: '9:16', value: '--ar 9:16' }
];

function AdvancedOptions({ onOptionsChange }) {
  const [selectedAspectRatio, setSelectedAspectRatio] = useState('');
  const [useImageRef, setUseImageRef] = useState(false);
  const [imageWeight, setImageWeight] = useState(0.5);
  const [useCharRef, setUseCharRef] = useState(false);
  const [charWeight, setCharWeight] = useState(50);
  const [negativePrompt, setNegativePrompt] = useState('');
  const [isSliderDragging, setIsSliderDragging] = useState(false);

  // Update parent component with current options
  const updateOptions = () => {
    let options = [];

    // Image reference should be first
    if (useImageRef) {
      options.push('[paste image link here]');
    }

    if (selectedAspectRatio) {
      options.push(selectedAspectRatio);
    }

    // Add weights and character reference
    if (useImageRef) {
      options.push(`--iw ${imageWeight}`);
    }

    if (useCharRef) {
      options.push('--cref [paste character reference image here]');
      options.push(`--cw ${charWeight}`);
    }

    if (negativePrompt.trim()) {
      options.push(`--no ${negativePrompt.trim()}`);
    }

    onOptionsChange(options);
  };

  // Handle negative prompt submission
  const handleNegativePromptSubmit = () => {
    if (negativePrompt.trim()) {
      updateOptions();
    }
  };

  const handleNegativePromptKeyPress = (e) => {
    if (e.key === 'Enter' && negativePrompt.trim()) {
      handleNegativePromptSubmit();
    }
  };

  // Handle aspect ratio selection
  const handleAspectRatioClick = (ratioValue) => {
    setSelectedAspectRatio(prevRatio => {
      const newRatio = prevRatio === ratioValue ? '' : ratioValue;
      // Only update options with the ratio value, not the display text
      onOptionsChange(newRatio ? [newRatio] : []);
      return newRatio;
    });
  };

  // Handle checkbox changes
  const handleImageRefChange = (e) => {
    const isChecked = e.target.checked;
    setUseImageRef(isChecked);
    
    // If checked, immediately add placeholder and default weight
    // If unchecked, remove both
    const options = [];
    if (isChecked) {
      options.push('[paste image link here]');
      options.push(`--iw ${imageWeight}`);
    } else {
      // When unchecking, we need to remove both placeholder and weight
      options.push('REMOVE_IMAGE_REF');
    }
    onOptionsChange(options);
  };

  // Handle image weight changes
  const handleImageWeightChange = (newWeight) => {
    setImageWeight(newWeight);
    if (useImageRef) {
      // Only send the weight parameter, let App.jsx handle the placeholder
      onOptionsChange([`--iw ${newWeight}`]);
    }
  };

  // Handle character reference checkbox changes
  const handleCharRefChange = (e) => {
    const isChecked = e.target.checked;
    setUseCharRef(isChecked);
    
    // If checked, immediately add placeholder and default weight
    // If unchecked, remove both
    const options = [];
    if (isChecked) {
      options.push('--cref [paste character reference image here]');
      options.push(`--cw ${charWeight}`);
    } else {
      // When unchecking, we need to remove both placeholder and weight
      options.push('REMOVE_CHAR_REF');
    }
    onOptionsChange(options);
  };

  // Handle character weight changes
  const handleCharWeightChange = (newWeight) => {
    setCharWeight(newWeight);
    if (useCharRef) {
      // Only send the weight parameter
      onOptionsChange([`--cw ${newWeight}`]);
    }
  };

  return (
    <div className="w-full bg-brown3">
      <div className="w-full max-w-[1280px] mx-auto px-8 py-6">
        <h2 className="text-l font-semibold text-brown1 mb-4">Advanced Options</h2>
        
        {/* Aspect Ratio */}
        <div className="mb-6">
          <h3 className="text-brown1 mb-2">Aspect Ratio</h3>
          <div className="flex gap-2">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                onClick={() => handleAspectRatioClick(ratio.value)}
                className={`px-4 py-2 border-2 ${
                  selectedAspectRatio === ratio.value
                    ? 'bg-green1 border-green1 text-prmptrblack'
                    : 'bg-prmptrblack border-brown2 text-brown1 hover:border-green1'
                }`}
              >
                {ratio.name}
              </button>
            ))}
          </div>
        </div>

        {/* Image Reference */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="imageRef"
              checked={useImageRef}
              onChange={handleImageRefChange}
              className="w-4 h-4 mr-2"
            />
            <label htmlFor="imageRef" className="text-brown1">Using image reference?</label>
          </div>
          {useImageRef && (
            <div className="ml-6">
              <label className="text-brown2 block mb-1">Image Weight: {imageWeight}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={imageWeight}
                onChange={(e) => {
                  setImageWeight(parseFloat(e.target.value));
                }}
                onMouseUp={(e) => {
                  handleImageWeightChange(parseFloat(e.target.value));
                }}
                onTouchEnd={(e) => {
                  handleImageWeightChange(parseFloat(e.target.value));
                }}
                className="w-full max-w-[200px]"
              />
            </div>
          )}
        </div>

        {/* Character Reference */}
        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="charRef"
              checked={useCharRef}
              onChange={handleCharRefChange}
              className="w-4 h-4 mr-2"
            />
            <label htmlFor="charRef" className="text-brown1">Using character reference?</label>
          </div>
          {useCharRef && (
            <div className="ml-6">
              <label className="text-brown2 block mb-1">Character Weight: {charWeight}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={charWeight}
                onMouseDown={() => setIsSliderDragging(true)}
                onMouseUp={() => {
                  setIsSliderDragging(false);
                  updateOptions();
                }}
                onTouchStart={() => setIsSliderDragging(true)}
                onTouchEnd={() => {
                  setIsSliderDragging(false);
                  updateOptions();
                }}
                onChange={(e) => {
                  setCharWeight(parseInt(e.target.value));
                }}
                className="w-full max-w-[200px]"
              />
            </div>
          )}
        </div>

        {/* Negative Prompt */}
        <div className="mb-6">
          <h3 className="text-brown1 mb-2">Negative Prompt</h3>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={negativePrompt}
              onChange={(e) => setNegativePrompt(e.target.value)}
              onKeyPress={handleNegativePromptKeyPress}
              placeholder="Enter negative prompt..."
              className="w-full max-w-[600px] p-2 bg-prmptrblack border-2 border-brown2 text-prmptrwhite placeholder-brown2"
            />
            <button
              onClick={handleNegativePromptSubmit}
              className={`px-4 py-2 border-2 transition-colors duration-200 ${
                negativePrompt.trim() 
                  ? 'bg-green1 border-green1 text-prmptrblack hover:bg-green1/90' 
                  : 'bg-prmptrblack border-brown2 text-brown1 hover:border-green1'
              }`}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdvancedOptions; 