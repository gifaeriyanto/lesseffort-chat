import React, { useMemo } from 'react';
import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { HistoryActions } from 'components/chat/historyActions';
import { sort } from 'ramda';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { CustomColor } from 'theme/foundations/colors';

export interface ChatHistoryItemProps {
  id?: number;
  isActive?: boolean;
  title: string;
  description: string;
  onDelete: (id: number) => void;
  onSelect: (id: number) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  id,
  isActive,
  title,
  description,
  onSelect,
}) => {
  const { chatHistoryCount } = useChat((state) => ({
    chatHistoryCount: state.chatHistory.length,
  }));

  return (
    <Box
      borderLeft={isActive ? '1px solid' : undefined}
      borderColor="blue.500"
      borderBottom={`1px solid ${CustomColor.border}`}
      bgColor={isActive ? 'gray.600' : 'transparent'}
      w="full"
      p={4}
      pl={isActive ? 'calc(1rem - 1px)' : 4}
      role="button"
      onClick={() => id && onSelect(id)}
      _last={chatHistoryCount > 8 ? { borderBottom: 0 } : undefined}
    >
      <HStack
        sx={{
          '& > button': {
            display: 'none',
          },
        }}
        _hover={{
          '& > button': {
            display: 'flex',
          },
        }}
        justify="space-between"
      >
        <Box flexGrow={0} overflow="hidden">
          <Text isTruncated fontWeight={isActive ? '600' : '500'}>
            {title}
          </Text>
          <Text fontSize="sm" color="gray.400" isTruncated>
            {description || 'No messages yet'}
          </Text>
        </Box>
        <HistoryActions id={id} />
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
    <Box w="full" overflow="auto">
      {filteredChatHistory.map((item, index) => (
        <ChatHistoryItem
          key={item.id || index}
          id={item.id}
          title={item.title}
          description={item.last_message}
          onDelete={deleteChat}
          onSelect={(id) => {
            setSelectedChatId(id);
            onCloseSidebar();
          }}
          isActive={selectedChatId === item.id}
        />
      ))}
    </Box>
  );
};
