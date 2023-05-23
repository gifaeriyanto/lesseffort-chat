import { ChakraProvider } from '@chakra-ui/react';
import * as Sentry from '@sentry/react';
import ChatContainer from 'containers/chat';
import ReactGA from 'react-ga4';
import { initDB } from 'react-indexed-db';
import { DBConfig } from 'store/db/config';
import { theme } from 'theme';

Sentry.init({
  dsn: 'https://4041f547d61845bfb2242755892a5323@o4505234435276800.ingest.sentry.io/4505234436259840',
  integrations: [new Sentry.BrowserTracing(), new Sentry.Replay()],
  // Performance Monitoring
  tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

ReactGA.initialize('G-5RCYEPQFPF', {
  testMode: true,
});

initDB(DBConfig);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ChatContainer />
    </ChakraProvider>
  );
}

export default App;
