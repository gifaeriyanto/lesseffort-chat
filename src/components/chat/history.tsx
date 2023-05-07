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
import { MappedChatHistory } from 'api/chat';
import { TbChevronDown } from 'react-icons/tb';
import { CustomColor } from 'theme/foundations/colors';

export interface ChatHistoryItemProps {
  title: string;
  description: string;
}

export const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  title,
  description,
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
      >
        <Box flexGrow={0} overflow="hidden">
          <Text isTruncated>{title}</Text>
          <Text fontSize="sm" color="gray.400" isTruncated>
            {description}
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
            <MenuItem>Delete</MenuItem>
          </MenuList>
        </Menu>
      </HStack>
    </Box>
  );
};

export interface ChatHistoryProps {
  data: MappedChatHistory;
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ data }) => {
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
          title={item.title}
          description={item.description}
        />
      ))}
    </Box>
  );
};
