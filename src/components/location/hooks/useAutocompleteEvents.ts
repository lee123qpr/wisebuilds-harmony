
import { RefObject, useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';

interface AutocompleteEventsProps {
  inputRef: RefObject<HTMLInputElement>;
  autocompleteRef: React.MutableRefObject<google.maps.places.Autocomplete | null>;
  form: any;
  fieldName: string;
  eventListenersRef: React.MutableRefObject<google.maps.MapsEventListener[]>;
  isInitialized: boolean;
}

export const useAutocompleteEvents = ({
  inputRef,
  autocompleteRef,
  form,
  fieldName,
  eventListenersRef,
  isInitialized
}: AutocompleteEventsProps) => {
  useEffect(() => {
    if (!isInitialized || !inputRef.current || !autocompleteRef.current) return;

    // When a place is selected, extract and update the form field
    const placeChangedListener = google.maps.event.addListener(
      autocompleteRef.current, 
      'place_changed', 
      () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          const formattedAddress = place.formatted_address;
          
          // Update the form field
          form.setValue(fieldName, formattedAddress, { 
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true
          });
          
          // Directly update input value
          if (inputRef.current) {
            inputRef.current.value = formattedAddress;
            
            // Ensure the input retains focus to prevent dialog closing
            // This is crucial for dialog-based forms
            setTimeout(() => {
              if (inputRef.current) {
                // Set focus to another element briefly then back to prevent
                // the dialog from closing due to focus changes
                document.body.focus();
                // Then return focus to the input (but don't trigger autocomplete)
                setTimeout(() => {
                  if (inputRef.current && document.contains(inputRef.current)) {
                    inputRef.current.focus();
                  }
                }, 50);
              }
            }, 10);
          }
          
          // Force a React change event to update state
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype, 
            "value"
          )?.set;
          
          if (inputRef.current && nativeInputValueSetter) {
            nativeInputValueSetter.call(inputRef.current, formattedAddress);
            
            // Create and dispatch events for React to detect
            const event = new Event('input', { bubbles: true });
            inputRef.current.dispatchEvent(event);
            
            // Also dispatch a change event
            const changeEvent = new Event('change', { bubbles: true });
            inputRef.current.dispatchEvent(changeEvent);
          }
          
          console.log('Place selected and saved:', formattedAddress);
        }
      }
    );
    
    // Store the listener reference for cleanup
    eventListenersRef.current.push(placeChangedListener);

    // Add input listener to handle when user clears the input field
    const inputHandler = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.value === '') {
        // Update the form when input is cleared
        form.setValue(fieldName, '', {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true
        });
      }
    };
    
    if (inputRef.current) {
      inputRef.current.addEventListener('input', inputHandler);
    }

    // Return cleanup function
    return () => {
      google.maps.event.removeListener(placeChangedListener);
      if (inputRef.current) {
        inputRef.current.removeEventListener('input', inputHandler);
      }
    };
  }, [isInitialized, autocompleteRef, fieldName, form, inputRef, eventListenersRef]);
};
