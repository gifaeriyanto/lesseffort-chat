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
import { useChat } from 'store/openai';
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
  onDelete,
  onSelect,
}) => {
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
            onClick={(e) => e.stopPropagation()}
          />
          <MenuList>
            <MenuItem>Rename</MenuItem>
            <MenuItem
              onClick={(e) => {
                e.stopPropagation();
                id && onDelete(id);
              }}
            >
              Delete
            </MenuItem>
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
  const { deleteChat, selectedChatId, setSelectedChatId } = useChat();

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
          onSelect={setSelectedChatId}
          isActive={selectedChatId === item.id}
        />
      ))}
    </Box>
  );
};
