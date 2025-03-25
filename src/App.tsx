
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import CookieConsent from './components/common/CookieConsent';
import { useEffect } from 'react';

const App = () => {
  // Log initialization for debugging
  useEffect(() => {
    console.log('App initialized - router should be working');
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
