import React, { useState } from 'react';
import randomData from '../assets/random.json';

const presets = [
  {
    name: "Randomize",
    description: "Generate a random combination of options - what's life without a little chaos?",
    options: "RANDOMIZE" // Special flag to handle randomization
  },
  {
    name: "Storyboard Drawing",
    description: "Black and white ink drawings ideal for storyboarding",
    options: {
      "Medium": ["Ink Pen"],
      "Artistic Style": ["Storyboard"],
      "Color Palette": ["Black and White"]
    }
  },
  {
    name: "Cinematic Shot",
    description: "Dramatic movie-style composition",
    options: {
      "Artistic Style": ["Cinematic"],
      "Lighting": ["Dramatic"],
      "Color Palette": ["Muted Colors"],
      "Camera & Film": ["Arri Alexa"]
    }
  },
  {
    name: "Product Photography",
    description: "A starting point for well-lit studio photos of products",
    options: {
      "Medium": ["Digital Photo"],
      "Composition": ["Medium Shot"],
      "Lighting": ["Three Point"],
      "Environment": ["Product Shoot"],
      "Camera & Film": ["DSLR Camera"]
    }
  },
  {
    name: "Architectural Visualization",
    description: "A sketchy colored pencil look for classic architectural renderings",
    options: {
      "Medium": ["Colored Pencil"],
      "Composition": ["Birds Eye View"],
      "Artistic Style": ["Concept Art"],
      "Color Palette": ["Pastels"],
    }
  },
  {
    name: "Fantasy Illustration",
    description: "An earth-toned fantasy illustration",
    options: {
      "Medium": ["Pastel"],
      "Theme": ["Fantasy"],
      "Lighting": ["Volumetric"],
      "Time Period": ["Medieval"],
      "Color Palette": ["Earth Tones"]
    }
  },
  
  // Add more presets as needed
];

function PresetsList({ onPresetSelect, categoriesData }) {
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});

  const getRandomOption = (options) => {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  };

  const generateRandomPreset = () => {
    const randomOptions = {};
    
    // Only add a random subject if there isn't one already selected
    if (!selectedOptions['Subject and Action'] || selectedOptions['Subject and Action'].length === 0) {
      const randomSubject = randomData.randomSubjects[
        Math.floor(Math.random() * randomData.randomSubjects.length)
      ];
      randomOptions['Subject & Action'] = [randomSubject];
    } else {
      // Keep the existing subject
      randomOptions['Subject & Action'] = selectedOptions['Subject and Action'];
    }
    
    // Then add random options from other categories
    categoriesData.categories.forEach(category => {
      if (category.name !== 'Subject & Action' && category.options && category.options.length > 0) {
        // Randomly decide whether to include an option from this category (80% chance)
        if (Math.random() > 0.5) {
          randomOptions[category.name] = [getRandomOption(category.options).name];
        }
      }
    });

    return randomOptions;
  };

  const handlePresetClick = (preset) => {
    setSelectedPreset(preset.name);
    
    if (preset.options === "RANDOMIZE") {
      const randomPreset = generateRandomPreset();
      onPresetSelect(randomPreset);
    } else {
      onPresetSelect(preset.options);
    }
  };

  return (
    <div className="w-full bg-prmptrblack">
      <div className="w-full max-w-[1280px] mx-auto px-9 py-6">
        <h2 className="text-xl font-semibold text-brown1 mb-4">Quick Presets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => handlePresetClick(preset)}
              className={`bg-prmptrblack border-2 ${
                selectedPreset === preset.name 
                  ? 'border-green1' 
                  : 'border-brown2'
              } p-4 text-left rounded-md hover:border-green1 transition-colors`}
            >
              <h3 className="text-green1 text-md font-semibold mb-2">{preset.name}</h3>
              <p className="text-brown2 text-sm">{preset.description}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PresetsList;
