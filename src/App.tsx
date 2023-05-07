import { Box, ChakraProvider } from '@chakra-ui/react';
import ChatContainer from 'containers/chat';
import { theme } from 'theme';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ChatContainer />
    </ChakraProvider>
  );
}

export default App;
