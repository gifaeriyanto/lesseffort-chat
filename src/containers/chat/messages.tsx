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
import {
  TbChevronDown,
  TbInfoCircle,
  TbPencil,
  TbPlayerStopFilled,
  TbX,
} from 'react-icons/tb';
import { useIndexedDB } from 'react-indexed-db';
import { useChat } from 'store/openai';
import { CustomColor } from 'theme/foundations/colors';

export const ChatMessagesContainer: React.FC = () => {
  const {
    editingMessage,
    messages,
    generatingMessage,
    richEditorRef,
    streamChatCompletion,
    stopStream,
    setEditingMessage,
    updateMessage,
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
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0;
    }

    if (editingMessage) {
      updateMessage(value);
      return;
    }

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
        overflow="auto"
        mt={4}
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
            onEdit={() => setEditingMessage(message)}
          />
        ))}
      </Flex>

      {editingMessage && (
        <Flex align="center" py={2}>
          <Box w="4rem" textAlign="center" flexGrow="0" flexShrink="0">
            <Icon as={TbPencil} fontSize="2xl" color="blue.500" />
          </Box>
          <Box
            w="full"
            maxW="calc(100% - 8.25rem)"
            pl={4}
            borderLeft="1px solid"
            borderColor="blue.500"
            flexGrow="0"
            flexShrink="0"
          >
            <Flex align="center" color="blue.500">
              Edit Message
              <Tooltip
                label="Note: All subsequent messages will be deleted after you submit an edit."
                placement="top"
              >
                <IconButton
                  icon={<TbInfoCircle />}
                  aria-label="Edit info"
                  variant="link"
                  fontSize="xl"
                  color="blue.500"
                  mt="-2px"
                />
              </Tooltip>
            </Flex>
            <Box isTruncated maxW="100%">
              {editingMessage.content}
            </Box>
          </Box>
          <IconButton
            icon={<TbX />}
            aria-label="Cancel edit"
            variant="ghost"
            mx={4}
            fontSize="xl"
            onClick={() => setEditingMessage(undefined)}
          />
        </Flex>
      )}

      <Box h="1px" bgColor={CustomColor.border} mb={4} />

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
              top={editingMessage ? '-200%' : '-100%'}
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
              defaultValue={editingMessage?.content}
              onSubmit={generatingMessage ? undefined : handleSubmitChat}
              key={editingMessage?.id}
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
