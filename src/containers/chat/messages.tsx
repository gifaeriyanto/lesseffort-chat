import React, { useEffect, useRef } from 'react';
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Tooltip,
  useBoolean,
} from '@chakra-ui/react';
import { Message, OpenAIModel } from 'api/chat';
import { ChatMessage, ChatMessageAction } from 'components/chat/message';
import { RichEditor } from 'components/richEditor';
import { TypingDots } from 'components/typingDots';
import { getUnixTime } from 'date-fns';
import { MdSubdirectoryArrowLeft } from 'react-icons/md';
import { TbChevronDown, TbPlayerStopFilled } from 'react-icons/tb';
import { useIndexedDB } from 'react-indexed-db';
import { useChat } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';

export const ChatMessagesContainer: React.FC = () => {
  const {
    messages,
    generatingMessage,
    richEditorRef,
    streamChatCompletion,
    stopStream,
  } = useChat();
  const { newChat, selectedChatId } = useChat();
  const db = useIndexedDB('messages');
  const [
    isShowJumpToBottomButton,
    { on: showJumpToBottomButton, off: hideJumpToBottomButton },
  ] = useBoolean(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!generatingMessage) {
      richEditorRef?.current?.focus();
    }
  }, [generatingMessage, richEditorRef]);

  useEffect(() => {
    chatAreaRef.current?.addEventListener('scroll', () => {
      if (!chatAreaRef.current) {
        return;
      }
      if (chatAreaRef.current.scrollTop < -100) {
        showJumpToBottomButton();
      } else {
        hideJumpToBottomButton();
      }
    });
  }, [chatAreaRef]);

  const handleJumpToBottom = () => {
    if (chatAreaRef.current?.scrollTop) {
      chatAreaRef.current.scrollTop = 0;
    }
  };

  const handleSubmitChat = async (value: string) => {
    if (selectedChatId) {
      await db.add<Message>({
        chatId: selectedChatId,
        content: value,
        role: 'user',
        timestamp: getUnixTime(new Date()),
      });
    } else {
      await newChat({
        bot_id: 1,
        last_message: value,
        model: OpenAIModel.GPT_3_5,
        title: value,
      });
    }
    streamChatCompletion(value);
  };

  return (
    <>
      <Flex
        w="full"
        h="full"
        align="flex-start"
        borderBottom="1px solid"
        borderColor={CustomColor.border}
        overflow="auto"
        my={4}
        direction="column-reverse"
        ref={chatAreaRef}
      >
        {!!generatingMessage && (
          <ChatMessage message={generatingMessage} noActions />
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.timestamp}
            isMe={message.role === 'user'}
            message={message.content}
          />
        ))}
      </Flex>

      <Flex
        p={2}
        pr={6}
        bgColor={generatingMessage ? 'gray.700' : CustomColor.card}
        borderRadius="2xl"
        border="1px solid"
        borderColor={generatingMessage ? 'blue.500' : CustomColor.border}
        align="center"
        justify="center"
        pos="relative"
      >
        {isShowJumpToBottomButton && (
          <Tooltip label="Jump to the last message" openDelay={500}>
            <IconButton
              icon={<TbChevronDown />}
              aria-label="Jump to bottom"
              onClick={handleJumpToBottom}
              pos="absolute"
              right="1rem"
              top="-100%"
            />
          </Tooltip>
        )}
        <Box w="full">
          {generatingMessage ? (
            <Box p={4}>
              Assistant is typing
              <TypingDots />
            </Box>
          ) : (
            <RichEditor
              onSubmit={generatingMessage ? undefined : handleSubmitChat}
            />
          )}
        </Box>
        {generatingMessage ? (
          <ChatMessageAction
            title="Stop generating"
            icon={<TbPlayerStopFilled />}
            color="red.500"
            onClick={stopStream}
          />
        ) : (
          <Icon
            as={MdSubdirectoryArrowLeft}
            fontSize="2xl"
            color="gray.400"
            title="Press enter to submit"
          />
        )}
      </Flex>
    </>
  );
};
