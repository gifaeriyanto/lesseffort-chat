import React from 'react';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { HistoryActions } from 'components/chat/historyActions';
import { TbBrandOpenai, TbMenu2 } from 'react-icons/tb';
import { useChat } from 'store/openai';
import { useSidebar } from 'store/sidebar';
import { CustomColor } from 'theme/foundations/colors';

export const ChatHeader: React.FC = () => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { messagesLength, selectedChat } = useChat((state) => {
    const selectedChat = state.chatHistory.find(
      (item) => item.id === state.selectedChatId,
    );
    return {
      messagesLength: state.messages.length,
      selectedChat,
    };
  });
  const { onOpen } = useSidebar();

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid"
      borderColor={CustomColor.border}
      bgColor={CustomColor.background}
      p={{ base: 4, md: 0 }}
      pb={{ base: 3, md: 2 }}
      w={{ base: 'full', md: 'auto' }}
      pos={{ base: 'fixed', md: 'initial' }}
      zIndex={1}
      top={0}
      left={0}
    >
      {isLessThanMd && (
        <IconButton
          icon={<TbMenu2 />}
          aria-label="Menu"
          variant="ghost"
          fontSize="xl"
          onClick={onOpen}
        />
      )}
      <Flex
        align="center"
        justify={{ base: 'center', md: 'initial' }}
        gap={4}
        minW="0"
      >
        {!isLessThanMd && (
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
        )}
        <Box
          w={{ base: '60vw', md: '90%' }}
          maxW={{ base: 'full', md: 'calc(100% - 3.188rem)' }}
        >
          <Text
            fontWeight="bold"
            fontSize="xl"
            lineHeight="1.2"
            isTruncated
            textAlign={{ base: 'center', md: 'initial' }}
          >
            {selectedChat?.title || 'New Chat'}
          </Text>
          <Text
            fontSize="sm"
            color="gray.400"
            textAlign={{ base: 'center', md: 'initial' }}
          >
            {messagesLength ? `${messagesLength} messages` : 'No messages'}
          </Text>
        </Box>
      </Flex>
      {!!messagesLength ? (
        <HistoryActions id={selectedChat?.id} />
      ) : (
        // to keep chat title centered
        <Box w="2.188rem" />
      )}
    </Flex>
  );
};
