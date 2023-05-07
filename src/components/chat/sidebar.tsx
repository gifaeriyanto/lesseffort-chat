import React from 'react';
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
import { ChatHistory as TChatHistory, OpenAIModel } from 'api/chat';
import { ChatHistory } from 'components/chat/history';
import { getUnixTime } from 'date-fns';
import { TbPlus, TbSearch } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

export const ChatSidebar: React.FC = () => {
  const { isOpen: isShowSearch, onToggle } = useDisclosure();
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  // const { mapChatHistory } = useChatHistory();

  const handleNewChat = () => {
    const chats = localStorage.getItem('chatHistory');
    const parsedChats = chats ? (JSON.parse(chats) as TChatHistory) : {};
    parsedChats[getUnixTime(new Date())] = {
      title: 'New Chat',
      bot_description:
        'You are a very smart humorous. Respond with casual language but friendly. Your name is Dinda. Use markdown format and if you write a code, please do with maximal 10 words per line. Always use bahasa and use supported emoticon for all devices',
      description: 'halo bro',
      messages: [],
      model: OpenAIModel.GPT_3_5,
    };
    localStorage.setItem('chatHistory', JSON.stringify(parsedChats));
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
        {isShowSearch ? (
          <Box p={2}>
            <InputGroup>
              <Input
                placeholder="Search"
                borderRadius="lg"
                bgColor="gray.600"
                autoFocus
                onBlur={onToggle}
              />
              <InputRightElement>
                <Icon as={TbSearch} color={CustomColor.border} />
              </InputRightElement>
            </InputGroup>
          </Box>
        ) : (
          <Flex
            py="10px"
            pr={2}
            pl={4}
            borderBottom="1px solid"
            borderColor={CustomColor.border}
            w="full"
            justify="space-between"
            align="center"
          >
            <Text color="gray.400" fontSize="sm" onClick={onToggle}>
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
              onClick={onToggle}
            />
          </Flex>
        )}

        <ChatHistory data={[]} />
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
            <Avatar name="Ryan Florence" src="https://bit.ly/ryan-florence" />
            <Flex justify="space-between" w="full">
              <Box>
                <Text fontWeight="bold">Ryan Florence</Text>
                <Text fontSize="sm" color="gray.400">
                  ryan@gmail.com
                </Text>
              </Box>
              <AccordionButton w="auto" p={1} transform="rotate(180deg)">
                <AccordionIcon color="gray.400" fontSize="2xl" />
              </AccordionButton>
            </Flex>
          </Flex>
          <AccordionPanel p={0} mt={4}>
            <Box py={2} borderTop="1px solid" borderColor={CustomColor.border}>
              Clear conversations
            </Box>
            <Box py={2} borderTop="1px solid" borderColor={CustomColor.border}>
              Setting
            </Box>
            <Box pt={2} borderTop="1px solid" borderColor={CustomColor.border}>
              Log out
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
