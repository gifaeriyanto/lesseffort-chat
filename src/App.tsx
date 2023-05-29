import { useLayoutEffect } from 'react';
import { ChakraProvider, useColorMode } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import { captureException } from '@sentry/react';
import { freeUser, noAuth, withAuth } from 'components/protectedRoute';
import { EmailConfirmationContainer } from 'containers/auth/emailConfirmation';
import { ForgotContainer } from 'containers/auth/forgot';
import { LoginContainer } from 'containers/auth/login';
import PlansContainer from 'containers/auth/plans';
import { SignUpContainer } from 'containers/auth/signup';
import { UpdatePasswordContainer } from 'containers/auth/updatePassword';
import { ChatContainer } from 'containers/chat';
import { SettingsContainer } from 'containers/settings';
import ReactGA from 'react-ga4';
import { initDB } from 'react-indexed-db';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { DBConfig, upgradeDB } from 'store/db/config';
import { getUser } from 'store/supabase/auth';
import { useUserData } from 'store/user';
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
    loader: withAuth,
    element: <ChatContainer />,
  },
  {
    path: '/settings',
    loader: withAuth,
    element: <SettingsContainer />,
  },
  {
    path: '/login',
    loader: noAuth,
    element: <LoginContainer />,
  },
  {
    path: '/signup',
    loader: noAuth,
    element: <SignUpContainer />,
  },
  {
    path: '/forgot',
    loader: noAuth,
    element: <ForgotContainer />,
  },
  {
    path: '/update-password',
    loader: withAuth,
    element: <UpdatePasswordContainer />,
  },
  {
    path: '/email-confirmation',
    loader: noAuth,
    element: <EmailConfirmationContainer />,
  },
  {
    path: '/plans',
    loader: freeUser,
    element: <PlansContainer />,
  },
]);

function App() {
  const { setUser } = useUserData();

  useLayoutEffect(() => {
    upgradeDB();
    getUser().then(setUser).catch(captureException);
  }, []);

  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

export default App;
