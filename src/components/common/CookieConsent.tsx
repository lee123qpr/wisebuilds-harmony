
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

// Cookie categories with descriptions
const cookieCategories = [
  {
    id: 'necessary',
    name: 'Necessary',
    description: 'These cookies are required for the website to function and cannot be disabled.',
    required: true,
  },
  {
    id: 'functional',
    name: 'Functional',
    description: 'These cookies enable personalized features and functionality.',
    required: false,
  },
  {
    id: 'analytics',
    name: 'Analytics',
    description: 'These cookies help us analyze how the website is used to improve its performance.',
    required: false,
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'These cookies are used to deliver relevant advertisements and track their effectiveness.',
    required: false,
  },
];

interface CookiePreferences {
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true, // Always true as these are required
  functional: false,
  analytics: false,
  marketing: false,
};

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  // Check if consent has been given on component mount
  useEffect(() => {
    const consentGiven = localStorage.getItem('cookieConsent');
    if (!consentGiven) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(localStorage.getItem('cookiePreferences') || '{}');
        setPreferences({
          ...defaultPreferences,
          ...savedPreferences,
        });
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
        setPreferences(defaultPreferences);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      functional: true,
      analytics: true,
      marketing: true,
    };
    
    saveConsent(allAccepted);
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveConsent(preferences);
    setShowBanner(false);
    setShowPreferences(false);
  };

  const handleRejectAll = () => {
    saveConsent(defaultPreferences);
    setShowBanner(false);
  };

  const saveConsent = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', 'true');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    setPreferences(prefs);
    
    // Here you would implement actual cookie handling based on preferences
    applyPreferences(prefs);
  };

  const applyPreferences = (prefs: CookiePreferences) => {
    // This is where you would implement the actual enabling/disabling of cookies
    // based on the user's preferences
    console.log('Applied cookie preferences:', prefs);
    
    // Example: If analytics is disabled, you might want to disable Google Analytics
    if (!prefs.analytics) {
      // window['ga-disable-GA_MEASUREMENT_ID'] = true;
    }
  };

  const handleTogglePreference = (id: keyof CookiePreferences) => {
    if (id === 'necessary') return; // Can't toggle necessary cookies
    
    setPreferences((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const openPreferences = () => {
    setShowPreferences(true);
  };

  // Function to manage cookies manually after the initial consent
  const manageCookies = () => {
    setShowPreferences(true);
  };

  if (!showBanner && !showPreferences) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={manageCookies}
          className="text-xs opacity-70 hover:opacity-100"
        >
          Cookie Settings
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Cookie Banner */}
      {showBanner && !showPreferences && (
        <div className="fixed bottom-0 left-0 right-0 bg-background z-50 p-4 shadow-lg border-t">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-lg font-semibold mb-2">Cookie Notice</h2>
                <p className="text-sm text-muted-foreground">
                  We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 md:mt-0">
                <Button variant="outline" size="sm" onClick={openPreferences}>
                  Cookie Preferences
                </Button>
                <Button variant="outline" size="sm" onClick={handleRejectAll}>
                  Reject All
                </Button>
                <Button size="sm" onClick={handleAcceptAll}>
                  Accept All
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Preferences Dialog */}
      <AlertDialog open={showPreferences} onOpenChange={setShowPreferences}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Cookie Preferences</AlertDialogTitle>
            <AlertDialogDescription>
              You can customize your cookie preferences below. Necessary cookies cannot be disabled as they are required for the website to function properly.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="mt-4 space-y-4">
            {cookieCategories.map((category) => (
              <div key={category.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={category.id} 
                      checked={preferences[category.id as keyof CookiePreferences]} 
                      onCheckedChange={() => handleTogglePreference(category.id as keyof CookiePreferences)}
                      disabled={category.required}
                    />
                    <label 
                      htmlFor={category.id} 
                      className={`text-sm font-medium ${category.required ? 'text-muted-foreground' : ''}`}
                    >
                      {category.name} {category.required && <span className="text-xs italic">(Required)</span>}
                    </label>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground pl-6">{category.description}</p>
                <Separator className="mt-2" />
              </div>
            ))}
          </div>
          
          <AlertDialogFooter className="mt-4">
            <AlertDialogCancel onClick={() => setShowPreferences(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAcceptSelected}>Save Preferences</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CookieConsent;
