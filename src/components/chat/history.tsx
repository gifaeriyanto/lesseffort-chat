import React from 'react';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from '@chakra-ui/react';
import { Chat } from 'api/chat';
import { TbChevronDown } from 'react-icons/tb';
import { useIndexedDB } from 'react-indexed-db';
import { useChatHistory } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';

export interface ChatHistoryItemProps {
  id?: number;
  title: string;
  description: string;
  onDelete: (id: number) => void;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  id,
  title,
  description,
  onDelete,
}) => {
  return (
    <Box
      borderBottom="1px solid"
      borderColor={CustomColor.border}
      w="full"
      p={4}
      role="button"
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
          <Text isTruncated>{title}</Text>
          <Text fontSize="sm" color="gray.400" isTruncated>
            {description || 'No messages yet'}
          </Text>
        </Box>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<TbChevronDown />}
            aria-label="Action menu"
            variant="ghost"
            color="gray.400"
            fontSize="xl"
            borderRadius="xl"
            size="sm"
          />
          <MenuList>
            <MenuItem>Rename</MenuItem>
            <MenuItem onClick={() => id && onDelete(id)}>Delete</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
};

export interface ChatHistoryProps {
  data: Chat[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ data }) => {
  const { deleteChat } = useChatHistory();

  if (!data.length) {
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
      {data.map((item, index) => (
        <ChatHistoryItem
          key={index}
          id={item.id}
          title={item.title}
          description={item.last_message}
          onDelete={deleteChat}
        />
      ))}
    </Box>
  );
};
