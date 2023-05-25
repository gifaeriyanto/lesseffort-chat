import { useLayoutEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { LoginContainer } from 'containers/auth/login';
import { ChatContainer } from 'containers/chat';
import { SettingsContainer } from 'containers/settings';
import ReactGA from 'react-ga4';
import { initDB } from 'react-indexed-db';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DBConfig, upgradeDB } from 'store/db/config';
import { theme } from 'theme';
import { env } from 'utils/env';

Sentry.init({
  dsn: env.SENTRY_DSN,
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactGA.initialize(env.GA_KEY);

initDB(DBConfig);

const router = createBrowserRouter([
  {
    path: '/',
    element: <ChatContainer />,
  },
  {
    path: '/settings',
    element: <SettingsContainer />,
  },
  {
    path: '/login',
    element: <LoginContainer />,
  },
]);

function App() {
  useLayoutEffect(() => {
    upgradeDB();
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
