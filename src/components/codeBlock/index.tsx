import { memo, useLayoutEffect, useRef, useState } from 'react';
import { Box, HStack, IconButton } from '@chakra-ui/react';
import { DownloadTextButton } from 'components/downloadTextButton';
import { TbCopy, TbDownload } from 'react-icons/tb';
import { CodeProps } from 'react-markdown/lib/ast-to-react';

export const CodeBlock = memo(({ node, inline, ...props }: CodeProps) => {
  const textInput = useRef<HTMLElement>(null);
  const [lang, setLang] = useState('');

  useLayoutEffect(() => {
    let className = props.className;
    setLang(className?.replace('hljs language-', '') || '');
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(textInput?.current?.textContent || '');
  };

  if (inline) {
    return <code {...props} />;
  }

  return (
    <Box pos="relative">
      {!!lang && (
        <Box fontSize="sm" color="gray.400" mb={4}>
          {lang}
        </Box>
      )}
      <Box as="code" ref={textInput} {...props} />
      <HStack pos="absolute" top={-2} right={-2}>
        <DownloadTextButton
          aria-label="Download text button"
          icon={<TbDownload />}
          text={textInput?.current?.textContent || ''}
          lang={lang}
          size="sm"
          fontSize="md"
          _light={{
            color: 'white',
            bgColor: 'whiteAlpha.400',
          }}
        />
        <IconButton
          icon={<TbCopy />}
          aria-label="Copy code"
          onClick={handleCopy}
          size="sm"
          fontSize="md"
          _light={{
            color: 'white',
            bgColor: 'whiteAlpha.400',
          }}
        />
      </HStack>
    </Box>
  );
});
