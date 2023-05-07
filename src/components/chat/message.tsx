import React, { PropsWithChildren } from 'react';
import { Avatar, Box, Flex, Icon } from '@chakra-ui/react';
import { CodeBlock } from 'components/chat/codeBlock';
import { TbBrandOpenai } from 'react-icons/tb';
import ReactMarkdown from 'react-markdown';

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
        sx={{
          ['ul, ol']: {
            paddingLeft: '1.25rem',
          },
          ['p, li, pre']: {
            marginBottom: '1rem',
          },
          ['pre']: {
            borderRadius: 'md',
            bgColor: '#000 !important',
            p: 2,
          },
        }}
      >
        <ReactMarkdown
          components={{
            code: ({ className, children, inline }) => (
              <CodeBlock
                language={className?.replace('language-', '')}
                value={String(children)}
                inline={inline}
              />
            ),
          }}
        >
          {message}
        </ReactMarkdown>
      </Box>
    </Flex>
  );
};
