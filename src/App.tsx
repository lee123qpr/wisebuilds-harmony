
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import CookieConsent from './components/common/CookieConsent';
import { useEffect } from 'react';

const App = () => {
  // Enhanced logging for debugging
  useEffect(() => {
    console.log('App component mounted');
    console.log('Router should be initialized now');
    
    // Check if we're in development mode
    if (import.meta.env.DEV) {
      console.log('Running in development mode');
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
