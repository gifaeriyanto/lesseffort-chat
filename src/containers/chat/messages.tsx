import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  LightMode,
  Link,
  Tag,
  Tooltip,
  useBoolean,
  useDisclosure,
  useMediaQuery,
} from '@chakra-ui/react';
import { Chat, Message } from 'api/chat';
import { ChatMessage, ChatMessageAction } from 'components/chat/message';
import {
  ChatRules,
  chatRulesPrompt,
  defaultRules,
  Rules,
} from 'components/chat/rules';
import SelectedMessage from 'components/chat/selectedMessage';
import { RichEditor } from 'components/richEditor';
import { TypingDots } from 'components/typingDots';
import { StarterContainer } from 'containers/chat/starter';
import { getUnixTime } from 'date-fns';
import { MdSend, MdSubdirectoryArrowLeft } from 'react-icons/md';
import {
  TbChevronDown,
  TbInfoCircle,
  TbMenu,
  TbPencil,
  TbPlayerStopFilled,
  TbTemplate,
} from 'react-icons/tb';
import { useIndexedDB } from 'react-indexed-db';
import { modifyTemplate, useChat, useProfilePhoto } from 'store/openai';
import { Prompt } from 'store/supabase';
import { CustomColor } from 'theme/foundations/colors';
import { sanitizeString } from 'utils/common';

export const ChatMessagesContainer: React.FC = () => {
  const {
    chatHistory,
    editingMessage,
    generatingMessage,
    isTyping,
    messages,
    newChat,
    regenerateResponse,
    richEditorRef,
    selectedChatId,
    setEditingMessage,
    stopStream,
    streamChatCompletion,
    updateMessage,
  } = useChat();
  const { getPhoto } = useProfilePhoto();
  const [isLessThanMd] = useMediaQuery('(max-width: 48em)');
  const dbMessages = useIndexedDB('messages');
  const [
    isShowJumpToBottomButton,
    { on: showJumpToBottomButton, off: hideJumpToBottomButton },
  ] = useBoolean(false);
  const chatAreaRef = useRef<HTMLDivElement>(null);
  const [selectedChat, setSelectedChat] = useState<Chat | undefined>(undefined);
  const [readyToUse, setReadyToUse] = useState(false);
  const [watchGeneratingMessage, setWatchGeneratingMessage] = useState(false);
  const [template, setTemplate] = useState<Prompt | undefined>(undefined);
  const [chatRulesCount, setChatRulesCount] = useState(0);
  const [chatRules, setChatRules] = useState<Rules>(defaultRules);
  const {
    isOpen: isShowRuleOptions,
    onToggle: toggleShowRuleOptions,
    onClose: hideRuleOptions,
  } = useDisclosure();

  useLayoutEffect(() => {
    getPhoto();
  }, []);

  useLayoutEffect(() => {
    if (messages.length && !readyToUse) {
      setReadyToUse(true);
    }
    return () => {
      setReadyToUse(false);
    };
  }, [messages, selectedChatId]);

  const jumpToBottomMobile = () => {
    if (!isLessThanMd) {
      return;
    }
    window.scrollTo({
      top: window.document.body.scrollHeight,
    });
  };

  useLayoutEffect(() => {
    if (watchGeneratingMessage) {
      jumpToBottomMobile();
    }
  }, [generatingMessage, watchGeneratingMessage]);

  useLayoutEffect(() => {
    if (readyToUse) {
      jumpToBottomMobile();
    }
  }, [readyToUse]);

  useLayoutEffect(() => {
    if (selectedChatId) {
      const chat = chatHistory.find((item) => item.id === selectedChatId);
      setSelectedChat(chat);
    }

    setTemplate(undefined);
  }, [selectedChatId, chatHistory]);

  useLayoutEffect(() => {
    hideRuleOptions();
    if (!isTyping) {
      richEditorRef?.current?.focus();
    }
  }, [isTyping, richEditorRef]);

  const handleClearRules = () => {
    setChatRules(defaultRules);
  };

  const handleJumpToBottom = () => {
    chatAreaRef?.current?.scrollTo(0, 0);
    if (isLessThanMd) {
      setWatchGeneratingMessage(true);
    }
  };

  const handleShowJumpToBottom = () => {
    if (!chatAreaRef.current) {
      return;
    }

    let isScrollNotInBottom = chatAreaRef.current.scrollTop < -100;
    if (isLessThanMd) {
      const bodyElement = document.body;
      const scrollTopBody =
        bodyElement.scrollTop || document.documentElement.scrollTop;
      isScrollNotInBottom =
        scrollTopBody + bodyElement.clientHeight <
        bodyElement.scrollHeight - 500;

      const userStartToScrollToTop =
        scrollTopBody + bodyElement.clientHeight < bodyElement.scrollHeight - 1;
      setWatchGeneratingMessage(!userStartToScrollToTop);
    }

    if (isScrollNotInBottom) {
      showJumpToBottomButton();
    } else {
      hideJumpToBottomButton();
    }
  };

  useLayoutEffect(() => {
    chatAreaRef.current?.addEventListener('scroll', handleShowJumpToBottom);
    return () => {
      chatAreaRef.current?.removeEventListener(
        'scroll',
        handleShowJumpToBottom,
      );
    };
  }, [chatAreaRef]);

  useLayoutEffect(() => {
    if (!isLessThanMd) {
      return;
    }
    window.document.addEventListener('scroll', handleShowJumpToBottom);
    return () => {
      window.document.removeEventListener('scroll', handleShowJumpToBottom);
    };
  }, [isLessThanMd]);

  const handleSubmitChat = async (message: string) => {
    handleJumpToBottom();

    const messageWithRules = message + chatRulesPrompt(chatRules);

    if (editingMessage) {
      updateMessage(messageWithRules);
      return;
    }

    const prompt = template
      ? {
          content: modifyTemplate(message, template.Prompt, chatRules),
          originalContent: message,
        }
      : {
          content: messageWithRules,
        };

    const userMessage: Message = {
      chatId: selectedChatId,
      role: 'user',
      createdAt: getUnixTime(new Date()),
      updatedAt: getUnixTime(new Date()),
      ...prompt,
    };

    if (selectedChatId) {
      await dbMessages.add<Message>(userMessage);
    } else {
      await newChat(
        {
          last_message: message,
          title: message,
        },
        userMessage,
      );
    }

    streamChatCompletion({
      value: template ? message : messageWithRules,
      template: template ? prompt.content : undefined,
      isLocked: selectedChat?.locked,
    });
    setTemplate(undefined);
  };

  const renderMessageInput = () => {
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
        placeholder={
          template?.PromptHint
            ? sanitizeString(template?.PromptHint)
            : undefined
        }
      />
    );
  };

  const renderMessageInputCTA = () => {
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
            alignSelf="flex-end"
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
    if (!messages.length) {
      return <StarterContainer onSelectPrompt={setTemplate} />;
    }

    return (
      <>
        {!!generatingMessage && (
          <ChatMessage key="message-0" message={generatingMessage} noActions />
        )}
        {messages.map((message) => (
          <ChatMessage
            key={message.id || message.createdAt}
            isMe={message.role === 'user'}
            id={message.id}
            message={message.originalContent || message.content}
            onEdit={() => setEditingMessage(message)}
            onRegenerateResponse={() =>
              message.id && regenerateResponse(message.id)
            }
          />
        ))}
      </>
    );
  };

  return (
    <>
      <Flex
        w="full"
        h={{ base: 'auto', md: 'full' }}
        align="flex-start"
        overflow={{ base: 'initial', md: 'auto' }}
        direction={messages.length ? 'column-reverse' : 'column'}
        ref={chatAreaRef}
        px={{ base: 4, md: 0 }}
        pt={{ base: '5rem', md: 0 }}
        pb={{ base: '6rem', md: '2rem' }}
        sx={{
          '& > div:last-child': {
            mt: 6,
          },
        }}
      >
        {renderMessages()}
      </Flex>

      <Box
        pos={{ base: 'fixed', md: 'relative' }}
        bottom={0}
        left={0}
        w="full"
        zIndex={1}
        bgColor="gray.700"
      >
        {!!editingMessage && (
          <SelectedMessage
            icon={TbPencil}
            onClose={() => setEditingMessage(undefined)}
            title={editingMessage.content}
            info={
              <>
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
              </>
            }
          />
        )}

        {!!template && (
          <SelectedMessage
            icon={TbTemplate}
            onClose={() => setTemplate(undefined)}
            title={template.Title}
            info={
              <>
                By{' '}
                <Link
                  href={template.AuthorURL}
                  target="_blank"
                  ml={1}
                  isTruncated
                >
                  {template.AuthorName}
                </Link>
              </>
            }
          />
        )}

        <Flex
          justify="center"
          w="full"
          h="2rem"
          top="-2rem"
          pointerEvents="none"
          className="rules"
          pos="absolute"
          hidden={isTyping || isLessThanMd}
        >
          <Button
            leftIcon={<TbMenu />}
            aria-label="Show rule options"
            size="sm"
            pointerEvents="initial"
            borderBottomRadius="0"
            bgColor="gray.500"
            onClick={toggleShowRuleOptions}
            _hover={{ bgColor: 'gray.600' }}
          >
            {isShowRuleOptions ? 'Hide' : 'Show'} Rules
            {!!chatRulesCount && !isShowRuleOptions && (
              <Tag ml={2} size="sm" borderRadius="full">
                {chatRulesCount}
              </Tag>
            )}
          </Button>
        </Flex>

        {!isLessThanMd && <Box h="1px" bgColor={CustomColor.border} mb={4} />}

        <Box mb={4} hidden={!isShowRuleOptions || isTyping || isLessThanMd}>
          <ChatRules
            onChange={setChatRules}
            hidden={template ? ['format', 'writingStyle'] : []}
            onClose={handleClearRules}
            getActiveRules={setChatRulesCount}
            key={selectedChatId}
          />
        </Box>

        <Flex
          p={2}
          pb={{ base: 6, md: 2 }}
          pr={selectedChat?.locked && isLessThanMd ? 2 : 4}
          bgColor={isTyping ? 'gray.700' : CustomColor.card}
          borderRadius={{ base: 0, md: '2xl' }}
          border="1px solid"
          borderColor={{
            base: 'transparent',
            md: isTyping ? 'blue.500' : CustomColor.border,
          }}
          align="center"
          justify="center"
          direction={selectedChat?.locked && isLessThanMd ? 'column' : 'row'}
        >
          {isShowJumpToBottomButton && (
            <Tooltip label="Jump to the last message" openDelay={500}>
              <IconButton
                icon={<TbChevronDown />}
                aria-label="Jump to bottom"
                onClick={handleJumpToBottom}
                pos="absolute"
                right="1rem"
                top="-4rem"
              />
            </Tooltip>
          )}
          <Box w="full">{renderMessageInput()}</Box>
          {renderMessageInputCTA()}
        </Flex>
      </Box>
    </>
  );
};
