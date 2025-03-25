
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import CookieConsent from './components/common/CookieConsent';
import { useEffect } from 'react';

const App = () => {
  // Enhanced logging for debugging
  useEffect(() => {
    console.log('App component mounted');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);
    console.log('Router should be initialized now');
    
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log('Running in development mode');
      
      // Add global debugging object
      try {
        const anyWindow = window as any;
        anyWindow.__APP_DEBUG__ = {
          timestamp: new Date().toISOString(),
          path: window.location.pathname,
          mounted: true
        };
      } catch (e) {
        console.error('Could not set debug info', e);
      }
    }
  }, []);

  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col bg-background">
        <AppRouter />
        <CookieConsent />
      </div>
    </AppProviders>
  );
};

export default App;
