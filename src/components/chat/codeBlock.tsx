import { Box } from '@chakra-ui/react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { monokaiSublime } from 'react-syntax-highlighter/dist/cjs/styles/hljs';

export const CodeBlock: React.FC<{
  inline?: boolean;
  language?: string;
  value: string;
}> = ({ language, value, inline }) => {
  if (inline) {
    return (
      <Box
        as="code"
        bgColor="whiteAlpha.200"
        color="yellow.100"
        px="4px"
        mx="2px"
        borderRadius="md"
      >
        {value}
      </Box>
    );
  }

  return (
    <SyntaxHighlighter language={language} style={monokaiSublime}>
      {value}
    </SyntaxHighlighter>
  );
};
