import React from 'react';
import { Flex } from '@chakra-ui/react';
import { Message } from 'api/chat';
import { ChatHeader } from 'components/chat/header';
import { ChatMessagesContainer } from 'containers/chat/messages';

export interface ChatProps {
  generatingMessage: string;
  messages: Message[];
  onSend: (value: string) => void;
}

export const Chat: React.FC = () => {
  return (
    <Flex
      w="full"
      maxW="60rem"
      direction="column"
      h={{ base: 'auto', md: 'calc(100vh - 2rem)' }}
      m="auto"
    >
      <ChatHeader />
      <ChatMessagesContainer />
    </Flex>
  );
};
