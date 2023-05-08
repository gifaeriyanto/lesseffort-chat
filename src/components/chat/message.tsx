import React, { PropsWithChildren } from 'react';
import { Avatar, Box, Flex, Icon } from '@chakra-ui/react';
import { TbBrandOpenai } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeHighlight from 'rehype-highlight';
import remarkBreaks from 'remark-breaks';
import remarkGfm from 'remark-gfm';

export interface ChatMessageProps {
  isMe?: boolean;
  message: string;
}

export const ChatMessage: React.FC<PropsWithChildren<ChatMessageProps>> = ({
  isMe,
  message,
}) => {
  return (
    <Flex py={2} pr={2} w="full" align="flex-start" gap={4}>
      {isMe ? (
        <Avatar
          name="Ryan Florence"
          src="https://bit.ly/ryan-florence"
          w="35px"
          h="35px"
        />
      ) : (
        <Flex
          p={4}
          bgColor="blue.500"
          w="35px"
          h="35px"
          align="center"
          justify="center"
          borderRadius="full"
        >
          <Icon as={TbBrandOpenai} fontSize="2xl" />
        </Flex>
      )}
      <Box
        mt={2}
        color={isMe ? 'gray.300' : 'gray.200'}
        maxW="calc(100% - 70px)"
        w="full"
        sx={{
          ['ul, ol']: {
            paddingLeft: '1.25rem',
          },
          ['p, li, pre']: {
            marginBottom: '1rem',
          },
          ['pre']: {
            maxWidth: 'full',
            borderRadius: 'md',
            bgColor: '#000 !important',
            p: 2,
          },
          table: {
            marginBottom: '1rem',
            w: 'full',
          },
          ['td, th']: {
            p: 2,
            border: '1px solid',
            borderColor: 'gray.400',
          },
          a: {
            color: 'blue.300',
            textDecor: 'underline',
          },
          ['.hljs']: {
            maxWidth: 'full',
            overflow: 'auto',
          },
          ['pre code:not(.hljs)']: {
            maxWidth: 'full',
            overflow: 'auto',
            whiteSpace: 'pre-wrap',
          },
        }}
      >
        <ReactMarkdown
          components={
            {
              // code: ({ className, children, inline }) => (
              //   <CodeBlock
              //     language={className?.replace('language-', '')}
              //     value={String(children)}
              //     inline={inline}
              //   />
              // ),
              // a: ({ children, href }) => {
              //   if (!href) return null;
              //   return (
              //     <a href={href} target="_blank" rel="noopener noreferrer">
              //       {children}
              //     </a>
              //   );
              // },
            }
          }
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[
            [
              rehypeHighlight,
              {
                ignoreMissing: true,
              },
            ],
            [
              rehypeExternalLinks,
              {
                target: '_blank',
                rel: 'noopener noreferrer',
              },
            ],
          ]}
        >
          {message}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
};
