import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  LightMode,
  Text,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { getUsages } from 'api/openai';
import { ChatHistory } from 'components/chat/history';
import { Search } from 'components/search';
import { getUnixTime } from 'date-fns';
import { TbPlus, TbSearch } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { CustomColor } from 'theme/foundations/colors';

export const ChatSidebar: React.FC = () => {
  const { isOpen: isOpenSidebar, onClose: onCloseSidebar } = useSidebar();
  const { isOpen: isShowSearch, onToggle } = useDisclosure();
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { richEditorRef, getChatHistory, newChat } = useChat();
  const [search, setSearch] = useState('');
  const [usages, setUsages] = useState({
    total: 0,
    today: 0,
  });

  const fetchUsages = () => {
    getUsages().then((res) => {
      const todayUsageItems = res.data.daily_costs[
        new Date().getDate() - 1
      ].line_items.reduce((prev, curr) => {
        return prev + curr.cost;
      }, 0);

      setUsages({
        total: res.data.total_usage * 0.01,
        today: todayUsageItems * 0.01,
      });
    });
  };

  useEffect(() => {
    getChatHistory();
    fetchUsages();

    const intervalId = setInterval(fetchUsages, 60000); // 1 minute

    return () => clearInterval(intervalId);
  }, []);

  const handleNewChat = () => {
    newChat({
      last_message: '',
      title: 'New Chat',
    });
    onCloseSidebar();
    richEditorRef?.current?.focus();
  };

  if (isLessThanMd) {
    return (
      <Drawer isOpen={isOpenSidebar} placement="left" onClose={onCloseSidebar}>
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
            <Box overflowY="auto" h="calc(100% - 9.75rem)">
              <ChatHistory search={search} />
            </Box>
            <Flex gap={4} p={4} borderTop={`1px solid ${CustomColor.border}`}>
              <Flex justify="space-between" w="full">
                <Box>
                  <Text fontWeight="bold">Usages</Text>
                  <Text fontSize="sm" color="gray.300">
                    This month:{' '}
                    <Box as="b" color="blue.500">
                      ${usages.total.toFixed(2)}
                    </Box>
                  </Text>
                </Box>
              </Flex>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    );
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
          <Box
            p={2}
            h="3.571rem"
            flexShrink={0}
            borderBottom="1px solid"
            borderColor={CustomColor.border}
          >
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
            <Flex justify="space-between" w="full">
              <Box>
                <Text fontWeight="bold">Usages</Text>
                <Text fontSize="sm" color="gray.300">
                  This month:{' '}
                  <Box as="b" color="blue.500">
                    ${usages.total.toFixed(2)}
                  </Box>
                </Text>
              </Box>
              <AccordionButton w="auto" p={1} transform="rotate(180deg)">
                <AccordionIcon color="gray.400" fontSize="2xl" />
              </AccordionButton>
            </Flex>
          </Flex>
          <AccordionPanel p={0} mt={4}>
            <Box
              pt={4}
              borderTop="1px solid"
              color="gray.300"
              borderColor={CustomColor.border}
            >
              Today usage is{' '}
              <Box as="b" color="blue.500">
                ${usages.today.toFixed(2)}
              </Box>
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};
