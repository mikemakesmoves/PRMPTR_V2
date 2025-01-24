import React, { useState } from 'react';
import categoriesData from './assets/categories.json';
import Header from './components/Header';
import PromptGenerator from './components/PromptGenerator';
import CategoriesList from './components/CategoriesList';
import CategoryOptions from './components/CategoryOptions';
import Footer from './components/Footer';
import PresetsList from './components/PresetsList';
import AdvancedOptions from './components/AdvancedOptions';
import randomData from './assets/random.json';
import AIEnhance from './components/AIEnhance';

function App() {
  // Define the desired order of categories
  const categoryOrder = [
    "Tone",
    "Artistic Style",
    "Theme",
    "Composition",
    "Medium",
    "Subject & Action",
    "Lighting",
    "Fashion",
    "Environment",
    "Time Period",
    "Camera & Film",
    "Color Palette",
    "Post Effects"
  ];


  const getRandomPlaceholder = () => {
    // Add a console.log to debug
    const randomIndex = Math.floor(Math.random() * randomData.placeholderPrompts.length);
    const selected = randomData.placeholderPrompts[randomIndex];
    console.log('Selected placeholder:', selected);
    return selected;
  };

  // Create a helper function to check if text is a placeholder
  const isPlaceholder = (text) => {
    return randomData.placeholderPrompts.includes(text);
  };

  const [selectedCategory, setSelectedCategory] = useState(categoriesData.categories[0]);
  const [customInput, setCustomInput] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(getRandomPlaceholder());
  const [selectedOptions, setSelectedOptions] = useState(
    Object.fromEntries(categoriesData.categories.map((cat) => [cat.name, []]))
  );

  // Toggle option selection
  const handleOptionToggle = (categoryName, optionName) => {
    setSelectedOptions(prev => {
      const category = categoriesData.categories.find(c => c.name === categoryName);
      const maxSelections = category.maxSelections || Infinity;
      
      const currentOptions = prev[categoryName] || [];
      let updatedOptions;

      if (currentOptions.includes(optionName)) {
        updatedOptions = currentOptions.filter(opt => opt !== optionName);
      } else {
        if (maxSelections === 1) {
          updatedOptions = [optionName];
        } else {
          updatedOptions = currentOptions.length < maxSelections 
            ? [...currentOptions, optionName]
            : currentOptions;
        }
      }

      // Get updated selected options
      const newSelectedOptions = {
        ...prev,
        [categoryName]: updatedOptions,
      };

      // Check for subject and medium
      const subjectOptions = newSelectedOptions['Subject & Action'] || [];
      const hasSubject = subjectOptions.length > 0;
      const mediumOptions = newSelectedOptions['Medium'] || [];
      const hasMedium = mediumOptions.length > 0;

      console.log('Debug - Subject:', subjectOptions);
      console.log('Debug - Has Medium:', hasMedium);

      // Generate the prompt with our special logic
      const formattedPrompt = Object.entries(newSelectedOptions)
        .sort(([catA, _], [catB, __]) => {
          return categoryOrder.indexOf(catA) - categoryOrder.indexOf(catB);
        })
        .flatMap(([cat, opts]) => {
          if (cat === 'Subject & Action' && hasSubject) {
            const subjectText = opts.join(', ');
            return !hasMedium ? [`shot of ${subjectText}`] : [subjectText];
          }
          return opts.map((opt) => {
            const category = categoriesData.categories.find(c => c.name === cat);
            const option = category.options.find(o => o.name === opt);
            return option ? option.promptText : opt;
          });
        })
        .join(' ')
        .replace(/^\w/, c => c.toUpperCase());

      // Check if there are any selected options
      const hasAnySelections = Object.values(newSelectedOptions).some(opts => opts.length > 0);
      
      setCurrentPrompt(hasAnySelections ? formattedPrompt : getRandomPlaceholder());

      return newSelectedOptions;
    });
  };

  const handleCustomInput = (categoryName, value) => {
    if (value.trim()) {  // Only process if there's actual input
      // Force lowercase for Subject and Action category
      const processedValue = categoryName === 'Subject & Action' 
        ? value.trim().toLowerCase() 
        : value.trim();
      
      handleOptionToggle(categoryName, processedValue);
      setCustomInput('');  // Clear the input after adding
    }
  };

  const handleClearAll = () => {
    setSelectedOptions(
      Object.fromEntries(categoriesData.categories.map((cat) => [cat.name, []]))
    );
    setCurrentPrompt(getRandomPlaceholder());
  };

  const generatePrompt = () => {
    let promptParts = [];
    
    // Get all subject inputs (both selected and custom)
    const subjectOptions = selectedOptions['Subject & Action'] || [];
    const hasSubject = subjectOptions.length > 0;
    
    // Check medium selections
    const mediumOptions = selectedOptions['Medium'] || [];
    const hasMedium = mediumOptions.length > 0;

    // Handle subjects first
    if (hasSubject) {
      const subjectText = subjectOptions.join(' ');
      if (!hasMedium) {
        promptParts.push(`shot of a ${subjectText}`);
      } else {
        promptParts.push(subjectText);
      }
    }

    // Add all other selected options from categories
    Object.entries(selectedOptions).forEach(([category, options]) => {
      if (category !== 'Subject & Action' && options && options.length > 0) {
        promptParts.push(...options);
      }
    });

    return promptParts.join(' ').trim();
  };

  const handleCategorySelect = (categoryName) => {
    setSelectedCategory(categoryName);
    setCustomInput(''); // Reset custom input when category changes
  };

  const generateFormattedPrompt = (options) => {
    // Get subject and medium status
    const hasSubject = (options['Subject & Action'] || []).length > 0;
    const hasMedium = (options['Medium'] || []).length > 0;

    // Generate formatted prompt
    const formattedPrompt = Object.entries(options)
      .sort(([catA, _], [catB, __]) => {
        return categoryOrder.indexOf(catA) - categoryOrder.indexOf(catB);
      })
      .flatMap(([cat, opts]) => {
        if (cat === 'Subject & Action' && hasSubject) {
          const subjectText = opts.join(' ');
          // Add comma after subject text
          return !hasMedium ? [`shot of ${subjectText},`] : [`${subjectText},`];
        }
        return opts.map((opt) => {
          const category = categoriesData.categories.find(c => c.name === cat);
          const option = category.options.find(o => o.name === opt);
          return option ? option.promptText : opt;
        });
      })
      .join(' ')
      .replace(/^\w/, c => c.toUpperCase());

    return formattedPrompt;
  };

  const handlePresetSelect = (presetOptions) => {
    // Create new options object, preserving only Subject & Action from current selections
    const newOptions = {
      ...Object.fromEntries(categoriesData.categories.map((cat) => [cat.name, []])),
      'Subject & Action': selectedOptions['Subject & Action'] || []
    };
    
    // Apply preset options
    Object.entries(presetOptions).forEach(([category, options]) => {
      if (category !== 'Subject & Action' || !newOptions['Subject & Action'].length) {
        newOptions[category] = options;
      }
    });

    // Generate prompt and update state
    const formattedPrompt = generateFormattedPrompt(newOptions);
    const hasAnySelections = Object.values(newOptions).some(opts => opts.length > 0);
    
    setSelectedOptions(newOptions);
    setCurrentPrompt(hasAnySelections ? formattedPrompt : getRandomPlaceholder());
  };


  return (
    <div className="flex flex-col min-h-screen bg-prmptrblack overflow-x-hidden">
      {/* Top Section - Make it sticky */}
      <div className="sticky top-0 z-50 w-full bg-prmptrwhite">
        {/* Header */}
        <Header />
        {/* Prompt Output Section */}
        <div className="flex w-full max-w-[1280px] mx-auto px-4 mt-8 pb-8">
          <PromptGenerator 
            prompt={currentPrompt} 
            onClear={handleClearAll}
            AIEnhance={
              <AIEnhance 
                currentPrompt={currentPrompt} 
                onEnhancedPrompt={(enhanced) => setCurrentPrompt(enhanced)} 
              />
            }
          />
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-x-hidden">
      
        {/* Main Section */}
        <div className="builder flex flex-col md:flex-row w-full max-w-[1280px] mx-auto px-4 py-8">
          <CategoriesList
            categories={categoriesData.categories}
            selectedCategory={selectedCategory.name}
            selectedOptions={selectedOptions}
            onCategorySelect={(categoryName) =>
              handleCategorySelect(
                categoriesData.categories.find((cat) => cat.name === categoryName)
              )
            }
          />
          <CategoryOptions
            category={selectedCategory}
            selectedOptions={selectedOptions[selectedCategory.name]}
            onOptionToggle={(option) => handleOptionToggle(selectedCategory.name, option)}
            customInput={customInput}
            onCustomInput={setCustomInput}
            onCustomInputSubmit={(value) => handleCustomInput(selectedCategory.name, value)}
          />
        </div>

        {/* Divider */}
        <div className="w-full max-w-[1280px] mx-auto px-8">
          <div className="border-t border-brown2"></div>
        </div>

        {/* Presets Section */}
        <PresetsList 
          onPresetSelect={handlePresetSelect} 
          categoriesData={categoriesData}
          selectedOptions={selectedOptions}
        />

      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
