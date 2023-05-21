import { Box, ChakraProvider, Flex, Link } from '@chakra-ui/react';
import { Analytics } from '@vercel/analytics/react';
import { initDB } from 'react-indexed-db';
import { DBConfig } from 'store/db/config';
import { theme } from 'theme';

initDB(DBConfig);

function App() {
  return (
    <>
      <Analytics />
      <ChakraProvider theme={theme}>
        <Flex justify="center" align="center" h="100vh" w="full">
          <Box>
            We have moved to{' '}
            <Link href="https://chat.lesseffort.io" as="span" color="blue.500">
              lesseffort.io
            </Link>
          </Box>
        </Flex>
      </ChakraProvider>
    </>
  );
}

export default App;
