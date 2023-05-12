import React from 'react';
import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Input,
  useDisclosure,
} from '@chakra-ui/react';
import { Message } from 'api/chat';
import { ChatHeader } from 'components/chat/header';
import { ChatHistory } from 'components/chat/history';
import { ChatMessagesContainer } from 'containers/chat/messages';
import { useSidebar } from 'store/sidebar';

export interface ChatProps {
  generatingMessage: string;
  messages: Message[];
  onSend: (value: string) => void;
}

export const Chat: React.FC = () => {
  const { isOpen, onClose } = useSidebar();

  return (
    <Flex
      w="full"
      maxW="50rem"
      direction="column"
      h="calc(100vh - 2rem)"
      m="auto"
    >
      <ChatHeader />
      <ChatMessagesContainer />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Chat History</DrawerHeader>

          <DrawerBody p={0}>
            <ChatHistory search="" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
