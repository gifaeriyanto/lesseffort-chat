import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  LightMode,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { defaultBotInstruction, OpenAIModel } from 'api/chat';
import { ChatHistory } from 'components/chat/history';
import { Search } from 'components/search';
import { TbPlus, TbSearch, TbX } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';
import { debounce } from 'utils/common';

export const ChatSidebar: React.FC = () => {
  const { isOpen: isShowSearch, onToggle } = useDisclosure();
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { richEditorRef, getChatHistory, newChat } = useChat();
  const [search, setSearch] = useState('');

  const debounceOnChange = debounce(
    (setter: Function, value: unknown) => setter(value),
    300,
  );

  useEffect(() => {
    getChatHistory();
    // botDb.add({
    //   name: 'Dinda',
    //   instruction:
    //     'You are a very smart humorous. Respond with casual language but friendly. Your name is Dinda. Use markdown format and if you write a code, please do with maximal 10 words per line. Always use bahasa and use supported emoticon for all devices',
    // });
  }, []);

  const handleNewChat = () => {
    newChat({
      bot_instruction: defaultBotInstruction,
      last_message: '',
      model: OpenAIModel.GPT_3_5,
      title: 'New Chat',
    });
    richEditorRef?.current?.focus();
  };

  if (isLessThanMd) {
    return null;
  }

  return (
    <Flex direction="column" gap={4} h="calc(100vh - 2rem)">
      <LightMode>
        <Box>
          <Button
            colorScheme="blue"
            w="full"
            borderRadius="2xl"
            onClick={handleNewChat}
          >
            <TbPlus />
            <Text ml={2}>New Chat</Text>
          </Button>
        </Box>
      </LightMode>
      <Flex
        h="full"
        bgColor={CustomColor.card}
        borderRadius="2xl"
        border="1px solid"
        borderColor={CustomColor.border}
        overflow="hidden"
        direction="column"
      >
        {isShowSearch || search.length ? (
          <Box p={2} h="3.571rem" flexShrink={0}>
            <Search
              borderRadius="lg"
              bgColor="gray.600"
              autoFocus
              onBlur={onToggle}
              onSearch={setSearch}
            />
          </Box>
        ) : (
          <Flex
            h="3.571rem"
            flexShrink={0}
            pr={2}
            pl={4}
            borderBottom="1px solid"
            borderColor={CustomColor.border}
            w="full"
            justify="space-between"
            align="center"
            onClick={onToggle}
            cursor="text"
          >
            <Text color="gray.400" fontSize="sm">
              Chat History
            </Text>
            <IconButton
              icon={<TbSearch />}
              aria-label="Search"
              variant="ghost"
              size="sm"
              color="gray.400"
              borderRadius="2xl"
              fontSize="md"
            />
          </Flex>
        )}

        <ChatHistory search={search} />
      </Flex>
      <Accordion allowToggle>
        <AccordionItem
          bgColor={CustomColor.card}
          borderRadius="2xl"
          p={4}
          border="1px solid"
          borderColor={CustomColor.border}
        >
          <Flex gap={4}>
            <Avatar name="Demo" src="https://bit.ly/ryan-florence" />
            <Flex justify="space-between" w="full">
              <Box>
                <Text fontWeight="bold">Demo</Text>
                <Text fontSize="sm" color="gray.400">
                  Trial user
                </Text>
              </Box>
              <AccordionButton w="auto" p={1} transform="rotate(180deg)">
                <AccordionIcon color="gray.400" fontSize="2xl" />
              </AccordionButton>
            </Flex>
          </Flex>
          <AccordionPanel p={0} mt={4}>
            <Box py={2} borderTop="1px solid" borderColor={CustomColor.border}>
              Your usage for today: $0.5
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
