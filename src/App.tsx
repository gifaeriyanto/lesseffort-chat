import { ChakraProvider } from '@chakra-ui/react';
import ChatContainer from 'containers/chat';
import { initDB } from 'react-indexed-db';
import { DBConfig } from 'store/db/config';
import { theme } from 'theme';

initDB(DBConfig);

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ChatContainer />
    </ChakraProvider>
  );
}

export default App;
