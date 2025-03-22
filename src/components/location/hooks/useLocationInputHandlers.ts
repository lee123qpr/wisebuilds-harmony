
import React, { useEffect } from 'react';

interface LocationInputHandlersProps {
  inputRef: React.RefObject<HTMLInputElement>;
  isLoaded: boolean;
  field: any;
}

export const useLocationInputHandlers = ({
  inputRef,
  isLoaded,
  field
}: LocationInputHandlersProps) => {
  // Add global styles for the autocomplete dropdown when component mounts
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .pac-container {
        z-index: 9999 !important;
        position: absolute !important;
        pointer-events: auto !important;
        transform: translateZ(0) !important;
        max-height: 240px !important;
        overflow-y: auto !important;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
        border-radius: 0.375rem !important;
      }
      .pac-item {
        pointer-events: auto !important;
        cursor: pointer !important;
        padding: 0.5rem 1rem !important;
      }
      .pac-item:hover {
        background-color: rgba(243, 244, 246, 1) !important;
      }
      .pac-container:empty {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      // Find and remove any pac-container elements when component unmounts
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach(container => {
        container.remove();
      });
    };
  }, []);

  // Sync inputRef and field.value
  useEffect(() => {
    if (inputRef.current && field.value !== undefined && inputRef.current.value !== field.value) {
      inputRef.current.value = field.value;
      console.log('Syncing input with form value:', field.value);
    }
  }, [field.value, inputRef]);

  // Handle blur with longer delay to prevent premature dialog closing
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      if (field.onBlur) field.onBlur();
    }, 500); // Increased delay time
  };

  // Prevent event propagation to avoid dialog closing
  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Handle change events
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    field.onChange(newValue);
    console.log('Input changed:', newValue);
  };

  // Handle key events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission on Enter
    }
  };

  return {
    handleBlur,
    handleMouseDown,
    handleChange,
    handleKeyDown
  };
};
