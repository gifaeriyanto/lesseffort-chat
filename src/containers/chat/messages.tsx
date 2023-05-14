import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  LightMode,
  Tooltip,
  useBoolean,
  useMediaQuery,
} from '@chakra-ui/react';
import { Chat, defaultBotInstruction, Message, OpenAIModel } from 'api/chat';
import { ChatMessage, ChatMessageAction } from 'components/chat/message';
import { RichEditor } from 'components/richEditor';
import { TypingDots } from 'components/typingDots';
import { StarterContainer } from 'containers/chat/starter';
import { getUnixTime } from 'date-fns';
import { MdSend, MdSubdirectoryArrowLeft } from 'react-icons/md';
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
    isTyping,
    messages,
    generatingMessage,
    richEditorRef,
    regenerateResponse,
    streamChatCompletion,
    stopStream,
    setEditingMessage,
    updateMessage,
  } = useChat();
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const { newChat, chatHistory, selectedChatId } = useChat();
  const dbMessages = useIndexedDB('messages');
  const [
    isShowJumpToBottomButton,
    { on: showJumpToBottomButton, off: hideJumpToBottomButton },
  ] = useBoolean(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);

  useEffect(() => {
    if (selectedChatId) {
      const chat = chatHistory.find((item) => item.id === selectedChatId);
      setSelectedChat(chat);
    }
  }, [selectedChatId, chatHistory]);

  useEffect(() => {
    if (!isTyping) {
      richEditorRef?.current?.focus();
    }
  }, [isTyping, richEditorRef]);

  const handleJumpToBottomButton = () => {
    if (!chatAreaRef.current) {
      return;
    }
    if (chatAreaRef.current.scrollTop < -100) {
      showJumpToBottomButton();
    } else {
      hideJumpToBottomButton();
    }
  };

  useEffect(() => {
    chatAreaRef.current?.addEventListener('scroll', handleJumpToBottomButton);
    return () => {
      chatAreaRef.current?.removeEventListener(
        'scroll',
        handleJumpToBottomButton,
      );
    };
  }, [chatAreaRef]);

  const handleNewChat = () => {
    newChat({
      bot_instruction: defaultBotInstruction,
      last_message: '',
      model: OpenAIModel.GPT_3_5,
      title: 'New Chat',
    });
    richEditorRef?.current?.focus();
  };

  const handleJumpToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = 0;
    }
  };

  const handleSubmitChat = async (value: string) => {
    handleJumpToBottom();

    if (editingMessage) {
      updateMessage(value);
      return;
    }

    if (selectedChatId) {
      await dbMessages.add<Message>({
        chatId: selectedChatId,
        content: value,
        role: 'user',
        createdAt: getUnixTime(new Date()),
        updatedAt: getUnixTime(new Date()),
      });
    } else {
      await newChat({
        bot_instruction: defaultBotInstruction,
        last_message: value,
        model: OpenAIModel.GPT_3_5,
        title: value,
      });
    }

    streamChatCompletion(value);
  };

  const renderMessageInput = () => {
    if (selectedChat?.locked) {
      return (
        <Box p={4}>
          Hey there! Time to start a new chat as you've reached the limit. 😊
        </Box>
      );
    }

    if (isTyping) {
      return (
        <Box p={4}>
          Assistant is typing
          <TypingDots />
        </Box>
      );
    }

    return (
      <RichEditor
        defaultValue={editingMessage?.content}
        onSubmit={isTyping ? undefined : handleSubmitChat}
        key={editingMessage?.id}
      />
    );
  };

  const renderMessageInputCTA = () => {
    if (selectedChat?.locked) {
      return (
        <LightMode>
          <Button
            borderRadius="lg"
            colorScheme="blue"
            size={{ base: 'md', md: 'sm' }}
            onClick={handleNewChat}
            w={{ base: 'calc(100% - 2rem)', md: 'auto' }}
            mb={{ base: 4, md: 0 }}
          >
            New Chat
          </Button>
        </LightMode>
      );
    }

    if (isTyping) {
      return (
        <ChatMessageAction
          title="Stop generating"
          icon={<TbPlayerStopFilled />}
          color="red.500"
          onClick={stopStream}
        />
      );
    }

    if (isLessThanMd) {
      return (
        <LightMode>
          <IconButton
            icon={<MdSend />}
            borderRadius="full"
            colorScheme="blue"
            fontSize="lg"
            aria-label="Send message"
            onClick={() => {
              if (richEditorRef?.current) {
                const message = richEditorRef.current.props.editorState
                  .getCurrentContent()
                  .getPlainText();
                if (message) {
                  handleSubmitChat(message);
                }
              }
            }}
          />
        </LightMode>
      );
    }

    return (
      <Icon
        as={MdSubdirectoryArrowLeft}
        fontSize="2xl"
        color="gray.400"
        title="Press enter to submit"
        mr={2}
      />
    );
  };

  const renderMessages = () => {
    // if (!messages.length) {
    //   return <StarterContainer />;
    // }

    return (
      <>
        {!!generatingMessage && (
          <ChatMessage message={generatingMessage} noActions />
        )}
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            isMe={message.role === 'user'}
            id={message.id}
            message={message.content}
            onEdit={() => setEditingMessage(message)}
            onRegenerateResponse={() =>
              message.id && regenerateResponse(message.id)
            }
            isLockedChat={selectedChat?.locked}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <Flex
        w="full"
        h="full"
        align="flex-start"
        overflow="auto"
        direction={messages.length ? 'column-reverse' : 'column'}
        ref={chatAreaRef}
        px={{ base: 4, md: 0 }}
        sx={{
          '& > div:last-child': {
            mt: 6,
          },
        }}
      >
        {renderMessages()}
      </Flex>

      {editingMessage && (
        <Flex
          align="center"
          py={2}
          maxW={{ base: 'calc(100vw - 2rem)', md: 'auto' }}
        >
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
        pr={selectedChat?.locked && isLessThanMd ? 2 : 4}
        mx={{ base: 4, md: 0 }}
        bgColor={isTyping ? 'gray.700' : CustomColor.card}
        borderRadius="2xl"
        border="1px solid"
        borderColor={isTyping ? 'blue.500' : CustomColor.border}
        align="center"
        justify="center"
        pos="relative"
        direction={selectedChat?.locked && isLessThanMd ? 'column' : 'row'}
      >
        {isShowJumpToBottomButton && (
          <Tooltip label="Jump to the last message" openDelay={500}>
            <IconButton
              icon={<TbChevronDown />}
              aria-label="Jump to bottom"
              onClick={handleJumpToBottom}
              pos="absolute"
              right={{ base: 0, md: '1rem' }}
              top={editingMessage ? '-200%' : '-100%'}
            />
          </Tooltip>
        )}
        <Box w="full">{renderMessageInput()}</Box>
        {renderMessageInputCTA()}
      </Flex>
    </>
  );
};
