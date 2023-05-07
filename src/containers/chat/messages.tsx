import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import { ChatMessage } from 'components/chat/message';
import { RichEditor } from 'components/richEditor';
import { useChat } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';

export const ChatMessagesContainer: React.FC = () => {
  const { messages, generatingMessage, streamChatCompletion } = useChat();

  return (
    <>
      <Flex
        w="full"
        h="full"
        align="flex-start"
        borderBottom="1px solid"
        borderColor={CustomColor.border}
        overflow="auto"
        my={4}
        direction="column-reverse"
      >
        {!!generatingMessage && <ChatMessage message={generatingMessage} />}
        {messages.map((message, index) => (
          <ChatMessage
            key={`message-${index}`}
            isMe={message.role === 'user'}
            message={message.content}
          />
        ))}
      </Flex>

      <Box
        p={2}
        bgColor={CustomColor.card}
        borderRadius="2xl"
        border="1px solid"
        borderColor={CustomColor.border}
      >
        <RichEditor onSubmit={streamChatCompletion} />
      </Box>
    </>
  );
};
