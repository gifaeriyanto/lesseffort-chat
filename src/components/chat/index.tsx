import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  LightMode,
  Text,
} from '@chakra-ui/react';
import { defaultBotInstruction, Message, OpenAIModel } from 'api/chat';
import { ChatHeader } from 'components/chat/header';
import { ChatHistory } from 'components/chat/history';
import { Search } from 'components/search';
import { ChatMessagesContainer } from 'containers/chat/messages';
import { TbPlus } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { CustomColor } from 'theme/foundations/colors';

export interface ChatProps {
  generatingMessage: string;
  messages: Message[];
  onSend: (value: string) => void;
}

export const Chat: React.FC = () => {
  const { richEditorRef, newChat } = useChat();
  const { isOpen, onClose } = useSidebar();
  const [search, setSearch] = useState('');

  const handleNewChat = () => {
    newChat({
      bot_instruction: defaultBotInstruction,
      last_message: '',
      model: OpenAIModel.GPT_3_5,
      title: 'New Chat',
    });
    onClose();
    richEditorRef?.current?.focus();
  };

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
          <DrawerHeader>
            <Flex align="center" justify="space-between">
              <Text fontWeight="bold">
                Effortless{' '}
                <Text color="blue.500" as="span">
                  AI
                </Text>
              </Text>
              <LightMode>
                <IconButton
                  icon={<TbPlus />}
                  aria-label="New chat"
                  colorScheme="blue"
                  fontSize="xl"
                  onClick={handleNewChat}
                  size="sm"
                  borderRadius="full"
                />
              </LightMode>
            </Flex>
          </DrawerHeader>

          <DrawerBody p={0}>
            <Box p={2} h="3.571rem" flexShrink={0}>
              <Search
                onSearch={setSearch}
                borderRadius="lg"
                bgColor="gray.600"
              />
            </Box>
            <Box overflowY="auto" h="calc(100% - 11rem)">
              <ChatHistory search={search} />
            </Box>
            <Flex gap={4} p={4} borderTop={`1px solid ${CustomColor.border}`}>
              <Avatar name="Demo" src="https://bit.ly/ryan-florence" />
              <Flex justify="space-between" w="full">
                <Box>
                  <Text fontWeight="bold">Demo</Text>
                  <Text fontSize="sm" color="gray.400">
                    Trial user
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};
