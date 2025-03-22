
import { RefObject, useEffect } from 'react';

interface DomObserverProps {
  inputRef: RefObject<HTMLInputElement>;
  isInitialized: boolean;
}

export const useAutocompleteDomObserver = ({ inputRef, isInitialized }: DomObserverProps) => {
  useEffect(() => {
    if (!isInitialized || !inputRef.current) return;
    
    // Create a mutation observer to adjust the position of pac-container
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'childList') {
          const pacContainers = document.querySelectorAll('.pac-container');
          pacContainers.forEach(container => {
            // Find the position of the input field
            if (inputRef.current) {
              const rect = inputRef.current.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
              
              // Position the dropdown directly under the input
              (container as HTMLElement).style.top = `${rect.bottom + scrollTop}px`;
              (container as HTMLElement).style.left = `${rect.left + scrollLeft}px`;
              (container as HTMLElement).style.width = `${rect.width}px`;
            }
          });
        }
      });
    });
    
    // Start observing the document for added pac-container
    observer.observe(document.body, { childList: true, subtree: true });
    
    // Handle blur events to hide the autocomplete when input loses focus
    const blurHandler = () => {
      // Add a delay to allow for autocomplete selection
      setTimeout(() => {
        // Find any pac-container elements and hide them when not needed
        const pacContainers = document.querySelectorAll('.pac-container');
        pacContainers.forEach(container => {
          container.setAttribute('style', 'display: none !important;');
        });
      }, 500); // Longer delay to ensure selection completes
    };
    
    // Handle focus events to show the autocomplete when input gains focus
    const focusHandler = () => {
      const pacContainers = document.querySelectorAll('.pac-container');
      pacContainers.forEach(container => {
        container.removeAttribute('style');
        
        // Reposition the dropdown when focus is gained
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          
          (container as HTMLElement).style.top = `${rect.bottom + scrollTop}px`;
          (container as HTMLElement).style.left = `${rect.left + scrollLeft}px`;
          (container as HTMLElement).style.width = `${rect.width}px`;
        }
      });
    };
    
    if (inputRef.current) {
      inputRef.current.addEventListener('blur', blurHandler);
      inputRef.current.addEventListener('focus', focusHandler);
    }

    return () => {
      observer.disconnect();
      if (inputRef.current) {
        inputRef.current.removeEventListener('blur', blurHandler);
        inputRef.current.removeEventListener('focus', focusHandler);
      }
    };
  }, [isInitialized, inputRef]);
};
