import React, { useMemo } from 'react';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Text,
  useMediaQuery,
} from '@chakra-ui/react';
import { OpenAIModel } from 'api/constants';
import { HistoryActions } from 'components/chat/historyActions';
import { TbBookmark, TbBrandOpenai, TbMenu2 } from 'react-icons/tb';
import { useChat } from 'store/chat';
import { useSidebar } from 'store/sidebar';
import { accentColor, CustomColor } from 'theme/foundations/colors';
import { shallow } from 'zustand/shallow';

export const ChatHeader: React.FC = () => {
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { messagesLength, selectedChat, selectedChatId, model } = useChat(
    (state) => {
      const selectedChat = state.chatHistory.find(
        (item) => item.id === state.selectedChatId,
      );
      return {
        messagesLength: state.messages.length,
        selectedChat,
        selectedChatId: state.selectedChatId,
        model: state.model,
      };
    },
    shallow,
  );
  const onOpen = useSidebar((state) => state.onOpen, shallow);
  const isSavedMessages = useMemo(
    () => selectedChatId === -1,
    [selectedChatId],
  );

  const renderTitle = () => {
    if (isSavedMessages) {
      return 'Saved Messages';
    }

    return selectedChat?.title || 'New Chat';
  };

  const renderIcon = () => {
    let bgColor = '#74AA9C';
    let icon = TbBrandOpenai;

    if (isSavedMessages) {
      bgColor = accentColor('500');
      icon = TbBookmark;
    }

    if ([OpenAIModel['gpt-4'], OpenAIModel['gpt-4-0613']].includes(model)) {
      bgColor = 'pink.500';
    }

    return (
      <>
        {!isLessThanMd && (
          <Flex
            p={4}
            bgColor={bgColor}
            w="2.188rem"
            h="2.188rem"
            align="center"
            justify="center"
            borderRadius="full"
            color="white"
          >
            <Icon as={icon} fontSize="2xl" />
          </Flex>
        )}
      </>
    );
  };

  return (
    <Flex
      justify="space-between"
      align="center"
      borderBottom="1px solid"
      borderColor={CustomColor.border}
      p={{ base: 4, md: 0 }}
      pb={{ base: 3, md: 2 }}
      w={{ base: 'full', md: 'auto' }}
      pos={{ base: 'fixed', md: 'initial' }}
      zIndex={1}
      top={0}
      left={0}
      bgColor="gray.700"
      _light={{
        borderColor: CustomColor.lightBorder,
        bgColor: { base: 'gray.100', md: 'gray.200' },
      }}
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
        {renderIcon()}
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
            {renderTitle()}
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
      {!!messagesLength && !isSavedMessages ? (
        <HistoryActions
          id={selectedChat?.id}
          bgColor="transparent !important"
          isHeader
        />
      ) : (
        // to keep chat title centered
        <Box w="2.188rem" />
      )}
    </Flex>
  );
};
