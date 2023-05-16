import React, { useMemo, useRef } from 'react';
import { Box, Flex, HStack, Icon, Text, useMediaQuery } from '@chakra-ui/react';
import { HistoryActions } from 'components/chat/historyActions';
import { sort } from 'ramda';
import { TbLock } from 'react-icons/tb';
import LazyLoad from 'react-lazyload';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { CustomColor } from 'theme/foundations/colors';

export interface ChatHistoryItemProps {
  id?: number;
  isActive?: boolean;
  title: string;
  description: string;
  isLocked?: boolean;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  id,
  isActive,
  title,
  description,
  isLocked,
  onSelect,
}) => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');

  return (
    <Box
      borderLeft={isActive ? '1px solid' : undefined}
      borderColor="blue.500"
      borderBottom={`1px solid ${CustomColor.border}`}
      bgColor={isActive ? 'gray.600' : 'transparent'}
      w="full"
      h="5.125rem"
      p={4}
      pl={isActive ? 'calc(1rem - 1px)' : 4}
      role="button"
      onClick={() => id && onSelect(id)}
      pos="relative"
    >
      <HStack
        _hover={{
          '& > .history-actions': {
            opacity: '1',
          },
        }}
        justify="space-between"
      >
        <Box flexGrow={0} overflow="hidden">
          <Text isTruncated fontWeight={isActive ? '600' : '500'}>
            {isLocked && <Icon as={TbLock} color="gray.400" mr={2} />}
            {title}
          </Text>
          <Text fontSize="sm" color="gray.400" isTruncated>
            {description || 'No messages yet'}
          </Text>
        </Box>
        <Box
          onClick={(e) => e.stopPropagation()}
          className="history-actions"
          pos="absolute"
          right="0.5rem"
          opacity={0}
          hidden={isLessThanMd}
        >
          <HistoryActions id={id} />
        </Box>
      </HStack>
    </Box>
  );
};

export interface ChatHistoryProps {
  search: string;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ search }) => {
  const { chatHistory, deleteChat, selectedChatId, setSelectedChatId } =
    useChat();
  const { onClose: onCloseSidebar } = useSidebar();

  const filteredChatHistory = useMemo(() => {
    return sort(
      (a, b) => {
        if (a.updatedAt && b.updatedAt) {
          return b.updatedAt - a.updatedAt;
        } else {
          return (b.id || 0) - (a.id || 0);
        }
      },
      chatHistory.filter((item) => item.title.match(new RegExp(search, 'i'))),
    );
  }, [chatHistory, search]);

  if (!filteredChatHistory.length) {
    return (
      <Flex
        justify="center"
        align="center"
        h="full"
        color="gray.400"
        p={8}
        textAlign="center"
      >
        You don't have any chat history yet
      </Flex>
    );
  }

  return (
    <Box
      w="full"
      overflow="auto"
      className="history-scroll-container"
      mb="-1px"
    >
      {filteredChatHistory.map((item, index) => (
        <LazyLoad
          key={item.id || index}
          height="5.125rem"
          scrollContainer=".history-scroll-container"
          offset={200}
        >
          <ChatHistoryItem
            id={item.id}
            title={item.title}
            description={item.last_message}
            onDelete={deleteChat}
            onSelect={(id) => {
              setSelectedChatId(id);
              onCloseSidebar();
            }}
            isActive={selectedChatId === item.id}
            isLocked={item.locked}
          />
        </LazyLoad>
      ))}
    </Box>
  );
};
