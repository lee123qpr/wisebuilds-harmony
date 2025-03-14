
import React, { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  isLoaded: boolean;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
  field: {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
  };
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export const LocationInput: React.FC<LocationInputProps> = ({
  isLoaded,
  isLoading,
  inputRef,
  field,
  className,
  placeholder = 'Enter location',
  disabled = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const blurTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Function to position the pac-container correctly
  useEffect(() => {
    if (!isLoaded || !inputRef.current) return;
    
    const updatePosition = () => {
      // Wait for the pac-container to be appended to the DOM
      const pacContainer = document.querySelector('.pac-container') as HTMLElement;
      if (!pacContainer || !inputRef.current) return;
      
      const rect = inputRef.current.getBoundingClientRect();
      
      // Apply styles to position the dropdown
      pacContainer.style.top = `${rect.bottom}px`;
      pacContainer.style.left = `${rect.left}px`;
      pacContainer.style.width = `${rect.width}px`;
      pacContainer.style.position = 'fixed';
      pacContainer.style.zIndex = '9999';
      pacContainer.style.pointerEvents = 'auto';
    };
    
    // Run once immediately to set initial position
    updatePosition();
    
    // Update position when window is resized
    window.addEventListener('resize', updatePosition);
    
    // When input is focused, ensure the dropdown is positioned correctly
    inputRef.current.addEventListener('focus', updatePosition);
    
    // Clean up event listeners
    return () => {
      window.removeEventListener('resize', updatePosition);
      if (inputRef.current) {
        inputRef.current.removeEventListener('focus', updatePosition);
      }
    };
  }, [isLoaded, inputRef]);
  
  // Add global click handler to manage focus properly
  useEffect(() => {
    if (!isLoaded) return;
    
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Check if the click is on a pac-item
      if (target.classList.contains('pac-item') || target.closest('.pac-item')) {
        // If clicking on autocomplete item, clear any queued blur
        if (blurTimeoutRef.current) {
          clearTimeout(blurTimeoutRef.current);
          blurTimeoutRef.current = null;
        }
        e.stopPropagation();
      }
    };
    
    document.addEventListener('click', handleGlobalClick, true);
    
    return () => {
      document.removeEventListener('click', handleGlobalClick, true);
    };
  }, [isLoaded]);
  
  return (
    <div className="relative">
      <Input
        ref={inputRef}
        type="text"
        value={field.value}
        placeholder={placeholder}
        disabled={disabled || !isLoaded}
        className={cn(
          "pr-8",
          className
        )}
        onChange={(e) => {
          field.onChange(e.target.value);
        }}
        onFocus={() => {
          setIsFocused(true);
          
          // If there was a pending blur, cancel it
          if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
            blurTimeoutRef.current = null;
          }
        }}
        onBlur={(e) => {
          // Add a longer delay to allow click events to register on autocomplete items
          blurTimeoutRef.current = setTimeout(() => {
            setIsFocused(false);
            field.onBlur();
          }, 300);
        }}
        onClick={(e) => {
          // Prevent click events from propagating upward
          e.stopPropagation();
        }}
      />
      
      {isLoading && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2">
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
      )}
    </div>
  );
};
