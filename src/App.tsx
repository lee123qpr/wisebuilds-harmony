
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import CookieConsent from './components/common/CookieConsent';

const App = () => (
  <AppProviders>
    <div className="min-h-screen flex flex-col bg-background">
      <AppRouter />
      <CookieConsent />
    </div>
  </AppProviders>
);

export default App;
