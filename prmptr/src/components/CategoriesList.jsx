import React, { useEffect } from 'react';

function CategoriesList({ categories, selectedCategory, onCategorySelect, selectedOptions }) {
  // Create ref for the list container
  const listRef = React.useRef(null);
  
  // Scroll selected category into view
  React.useEffect(() => {
    if (listRef.current) {
      const selectedElement = listRef.current.querySelector(`[data-category="${selectedCategory}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'nearest',
          inline: 'start' 
        });
      }
    }
  }, [selectedCategory]);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
        
        const currentIndex = categories.findIndex(cat => cat.name === selectedCategory);
        let newIndex;
        
        if (e.key === 'ArrowUp') {
          // Move up (wrap to bottom if at top)
          newIndex = currentIndex <= 0 ? categories.length - 1 : currentIndex - 1;
        } else {
          // Move down (wrap to top if at bottom)
          newIndex = currentIndex >= categories.length - 1 ? 0 : currentIndex + 1;
        }
        
        onCategorySelect(categories[newIndex].name);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [categories, selectedCategory, onCategorySelect]);

  return (
    <div className="w-full md:w-1/4 overflow-x-auto md:overflow-visible scrollbar-hide" ref={listRef}>
      <ul className="flex md:flex-col font-medium space-x-5 md:space-x-0 md:space-y-1 p-3 md:p-4 whitespace-nowrap min-w-fit pl-4">
        {categories.map((category) => {
          const hasSelectedOptions = selectedOptions[category.name]?.length > 0;
          return (
            <li
              key={category.name}
              data-category={category.name}
              onClick={() => onCategorySelect(category.name)}
              className={`cursor-pointer px-3 text-xl py-2 md:px-2 md:py-1 rounded-lg transition-all duration-200 ease-in-out select-none origin-left ${
                category.name === selectedCategory 
                  ? 'text-green1 font-medium text-xl md:text-2xl bg-prmptrblack/10' 
                  : hasSelectedOptions 
                    ? 'text-green1'
                    : 'text-brown2 hover:text-brown1'
              }`}
            >
              {category.name}
            </li>
          )
        })}
      </ul>
    </div>
  );
}

export default CategoriesList;
  