import React, { useState } from 'react';

function CategoryOptions({ 
  category, 
  selectedOptions = [], 
  onOptionToggle, 
  customInput, 
  onCustomInput,
  onCustomInputSubmit 
}) {
  const [hoveredOption, setHoveredOption] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreviews, setShowPreviews] = useState(true);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && customInput.trim()) {
      onCustomInputSubmit(customInput);
    }
  };

  // Get custom options (options that are selected but not in the predefined list)
  const customOptions = selectedOptions.filter(option => 
    !category.options?.some(predefined => predefined.name === option)
  );

  // Check if this is the "Subject and Action" category
  const isSubjectCategory = category.name === "Subject & Action";

  // Filter options based on search query (only for non-subject categories)
  const filteredOptions = isSubjectCategory ? [] : 
    category.options?.filter(option =>
      option.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  return (
    <div className="w-3/4 p-4 text-prmptrwhite mt-1">
      <p className="mb-4">{category.description}</p>

      {/* Search Bar - only show for non-subject categories */}
      {!isSubjectCategory && (
        <div className="mb-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="w-full rounded-md p-2 bg-brown1 text-s font-semibold text-prmptrblack placeholder-prmptrblack"
          />
        </div>
      )}

      {/* Options Grid */}
      <div className="flex flex-wrap gap-2 relative  py-6">
        {/* Custom Options */}
        {customOptions.map((option) => (
          <div key={option} className="relative">
            <button
              onClick={() => onOptionToggle(option)}
              className="inline-flex items-center p-2 bg-green1 border border-green1 border-solid border-2 text-prmptrblack font-medium"
            >
              <span>{option}</span>
              <span className="ml-2 inline-block w-[15px] h-[15px] rounded-full bg-green2"></span>
            </button>
          </div>
        ))}

        {/* Predefined Options - only show for non-subject categories */}
        {!isSubjectCategory && filteredOptions.map((option) => {
          const isSelected = selectedOptions?.includes(option.name) || false;
          return (
            <div key={option.name} className="relative w-full md:w-auto">
              <button
                onClick={() => onOptionToggle(option.name)}
                onMouseEnter={() => setHoveredOption(option)}
                onMouseLeave={() => setHoveredOption(null)}
                className={`w-full rounded-md md:w-auto inline-flex items-center justify-between p-3 md:p-2 text-base md:text-sm ${
                  isSelected
                    ? 'bg-green1 border border-green1 border-solid border-2 text-prmptrblack font-medium'
                    : 'bg-prmptrblack font-medium text-brown1 border border-brown2 border-2 hover:text-green1 hover:border-green1'
                }`}
              >
                <span>{option.name}</span>
                <span className={`ml-2 inline-block w-[10px] h-[10px] rounded-full ${
                  isSelected ? 'bg-green2' : 'bg-brown2'
                }`}></span>
              </button>
              
              {/* Preview Image Popup - hide on mobile */}
              {hoveredOption?.name === option.name && option.previewImage && showPreviews && (
                <div className="hidden md:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                  <div className="shadow-lg w-[240px]">
                    <img 
                      src={option.previewImage} 
                      alt={`Preview of ${option.name}`}
                      className="w-[240px] h-[320px] rounded-md object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Show "No results found" message if no options match the search - only for non-subject categories */}
      {!isSubjectCategory && filteredOptions.length === 0 && customOptions.length === 0 && (
        <p className="text-prmptrwhite font-regular text-2xl my-4">
          Nothing found for "{searchQuery}" - maybe try a custom option?
        </p>
      )}

      {/* Custom Input */}
      <div className="mt-4 flex items-center space-x-2 max-w-[600px]">
        <input
          type="text"
          value={customInput}
          onChange={(e) => onCustomInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isSubjectCategory ? "a goat on a mountain (press enter to add)" : "Custom entry..."}
          className="flex-grow rounded-md p-2 bg-prmptrblack border-2 border-prmptrwhite text-prmptrwhite placeholder-brown2 focus:border-green1 focus:outline-none transition-colors duration-200"
        />
        <button
          onClick={() => onCustomInputSubmit(customInput)}
          className={`px-4 py-2 border-2 rounded-md transition-colors duration-200 ${
            customInput.trim() 
              ? 'bg-green1 border-green1 text-prmptrblack hover:bg-green1/90' 
              : 'bg-prmptrblack border-prmptrwhite text-brown1 hover:bg-green1 hover:border-green1 hover:text-prmptrblack'
          }`}
        >
          Add
        </button>
      </div>

      {/* Preview Toggle - only show if not Subject and Action category */}
      {category.name !== 'Subject & Action' && (
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="previewToggle"
            checked={showPreviews}
            onChange={(e) => setShowPreviews(e.target.checked)}
            className="w-4 h-4 rounded border-2 border-brown2 text-green1 focus:ring-1 focus:ring-green1 focus:ring-offset-0 bg-prmptrblack checked:bg-green1 checked:border-green1 hover:cursor-pointer transition-colors"
          />
          <label htmlFor="previewToggle" className="text-brown2 text-sm hover:cursor-pointer">
            Show preview images on hover
          </label>
        </div>
      )}
    </div>
  );
}

export default CategoryOptions;
