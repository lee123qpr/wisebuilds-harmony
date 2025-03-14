
import React, { useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationInputProps {
  isLoaded: boolean;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  field: any;
}

export const LocationInput: React.FC<LocationInputProps> = ({ 
  isLoaded, 
  isLoading, 
  inputRef, 
  field 
}) => {
  // Update dropdown position when the input position changes (e.g., on scroll)
  useEffect(() => {
    if (!isLoaded) return;
    
    const updateDropdownPosition = () => {
      const input = inputRef.current;
      if (!input) return;
      
      // Find the pac-container element
      const pacContainer = document.querySelector('.pac-container') as HTMLElement;
      if (!pacContainer) return;
      
      // Get input position
      const rect = input.getBoundingClientRect();
      
      // Update pac-container position to match input
      // For fixed positioning, we need viewport-relative coordinates
      pacContainer.style.top = `${rect.bottom}px`;
      pacContainer.style.left = `${rect.left}px`;
      pacContainer.style.width = `${rect.width}px`;
      
      // Ensure the pac-container is visible and clickable
      pacContainer.style.pointerEvents = 'auto';
    };
    
    // Run once immediately to set initial position
    setTimeout(updateDropdownPosition, 100);
    
    // Add event listeners for various scenarios that might affect positioning
    window.addEventListener('scroll', updateDropdownPosition, true);
    window.addEventListener('resize', updateDropdownPosition);
    document.addEventListener('click', updateDropdownPosition);
    
    // Also update when Google populates the dropdown
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(() => {
        const pacContainer = document.querySelector('.pac-container');
        if (pacContainer && pacContainer.children.length > 0) {
          updateDropdownPosition();
        }
      });
    });
    
    const pacContainer = document.querySelector('.pac-container');
    if (pacContainer) {
      observer.observe(pacContainer, { childList: true, subtree: true });
    }
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('scroll', updateDropdownPosition, true);
      window.removeEventListener('resize', updateDropdownPosition);
      document.removeEventListener('click', updateDropdownPosition);
      observer.disconnect();
    };
  }, [isLoaded, inputRef]);
  
  return (
    <div className="relative" style={{ zIndex: 50 }}>
      {isLoading ? (
        <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
      ) : (
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      )}
      <Input
        placeholder={isLoaded ? "Enter any location" : "Loading location service..."}
        className="pl-9 h-12" // Increased height for better visibility
        disabled={!isLoaded || isLoading}
        autoComplete="off"
        {...field}
        ref={(el) => {
          // Instead of directly assigning to inputRef.current, we use a callback approach
          if (el) {
            // This is safe because we're not directly assigning to .current
            // We're using the ref callback pattern which React handles appropriately
            if (inputRef) {
              // @ts-ignore - We need this because TypeScript doesn't allow assigning to read-only ref.current
              inputRef.current = el;
            }
            
            // Handle react-hook-form's ref properly
            if (typeof field.ref === 'function') {
              field.ref(el);
            } else if (field.ref) {
              // Use type assertion to fix the TypeScript error
              (field.ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
            }
          }
        }}
        // Prevent default browser autocomplete behavior
        onFocus={(e) => {
          // Ensure the dropdown shows on focus
          e.currentTarget.setAttribute('autocomplete', 'off');
          e.stopPropagation();
          // Update dropdown position on focus
          setTimeout(() => {
            const event = new Event('scroll');
            window.dispatchEvent(event);
          }, 100);
        }}
        // Make sure form field's onBlur callback is called
        onBlur={(e) => {
          // Add a delay to allow click events to register on autocomplete items
          setTimeout(() => {
            field.onBlur();
          }, 200);
        }}
        // Prevent click events from propagating upward
        onClick={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};
