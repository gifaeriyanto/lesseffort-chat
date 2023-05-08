import React from 'react';
import { Box, Flex, Icon, IconButton, Text } from '@chakra-ui/react';
import { OpenAIModel } from 'api/chat';
import { TbBrandOpenai, TbSettings } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';

export const ChatHeader: React.FC = () => {
  const { isTyping, messagesLength } = useChat((state) => ({
    messagesLength: state.messages.length,
    isTyping: !!state.generatingMessage,
  }));

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid"
      borderColor={CustomColor.border}
      py={4}
    >
      <Flex align="center" gap={4}>
        <Flex
          p={4}
          bgColor="blue.500"
          w="2.188rem"
          h="2.188rem"
          align="center"
          justify="center"
          borderRadius="full"
        >
          <Icon as={TbBrandOpenai} fontSize="2xl" />
        </Flex>
        <Box>
          <Text fontWeight="bold" fontSize="xl">
            Quick Chat
          </Text>
          {isTyping ? (
            <Text fontSize="sm" color="gray.400" fontStyle="italic">
              AI is typing...
            </Text>
          ) : (
            <Text fontSize="sm" color="gray.400">
              {messagesLength ? `${messagesLength} messages` : 'No messages'}
            </Text>
          )}
        </Box>
      </Flex>
      <IconButton
        icon={<TbSettings />}
        aria-label="Settings"
        variant="ghost"
        fontSize="xl"
        color="gray.400"
      />
    </Flex>
  );
};
