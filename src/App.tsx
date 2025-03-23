
import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './routes/AppRouter';
import CookieConsent from './components/common/CookieConsent';

const App = () => (
  <AppProviders>
    <AppRouter />
    <CookieConsent />
  </AppProviders>
);

export default App;
