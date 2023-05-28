import React, {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { captureException } from '@sentry/react';
import { Chat, Message } from 'api/chat';
import { ChatMessage, ChatMessageAction } from 'components/chat/message';
import { ChatRules, defaultRules, Rules } from 'components/chat/rules';
import { SelectedMessage } from 'components/chat/selectedMessage';
import { RichEditor } from 'components/richEditor';
import { TypingDots } from 'components/typingDots';
import { StarterContainer } from 'containers/chat/starter';
import { getUnixTime } from 'date-fns';
import ReactGA from 'react-ga4';
import {
  MdOutlineChecklist,
  MdSend,
  MdSubdirectoryArrowLeft,
} from 'react-icons/md';
import {
  TbChevronDown,
  TbInfoCircle,
  TbPencil,
  TbPlayerStopFilled,
  TbTemplate,
} from 'react-icons/tb';
import { useIndexedDB } from 'react-indexed-db';
import { useChat, useProfilePhoto } from 'store/openai';
import { Prompt } from 'store/supabase';
import { saveMessage } from 'store/supabase/chat';
import { accentColor, CustomColor } from 'theme/foundations/colors';
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
    resendLastMessage,
    richEditorRef,
    selectedChatId,
    getSavedMessages,
    setEditingMessage,
    stopStream,
    streamChatCompletion,
    updateMessage,
    updateMessageTemplate,
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
    onOpen: showRuleOptions,
    onToggle: toggleShowRuleOptions,
    onClose: hideRuleOptions,
  } = useDisclosure();
  const isSavedMessages = useMemo(
    () => selectedChatId === -1,
    [selectedChatId],
  );

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
    if (!isTyping) {
      richEditorRef?.current?.focus();
    } else {
      hideRuleOptions();
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

  const handleSendMessage = async (message: string) => {
    if (isSavedMessages) {
      await saveMessage({
        content: message,
        role: 'user',
      });
      await getSavedMessages();
      return;
    }

    handleJumpToBottom();

    if (editingMessage) {
      updateMessage(message);
      return;
    }

    const userMessage: Message = {
      chatId: selectedChatId,
      role: 'user',
      createdAt: getUnixTime(new Date()),
      updatedAt: getUnixTime(new Date()),
      content: message,
      template: template?.Prompt || '',
      rules: chatRules,
    };

    try {
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
    } catch (error) {
      captureException(error);
    }

    streamChatCompletion({
      isLimited: selectedChat?.limited,
      userMessage,
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
        onSubmit={isTyping ? undefined : handleSendMessage}
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
          _light={{
            // TODO: find where style that replace this
            color: 'red.500',
          }}
        />
      );
    }

    if (isLessThanMd) {
      return (
        <LightMode>
          <IconButton
            icon={<MdSend />}
            borderRadius="full"
            colorScheme={accentColor()}
            fontSize="lg"
            aria-label="Send message"
            onClick={() => {
              if (richEditorRef?.current) {
                const message = richEditorRef.current.props.editorState
                  .getCurrentContent()
                  .getPlainText();
                if (message) {
                  handleSendMessage(message);
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

  const renderMessages = useCallback(() => {
    if (!messages.length) {
      return <StarterContainer onSelectPrompt={setTemplate} />;
    }

    return (
      <>
        {messages.map((message) => (
          <ChatMessage
            key={message.id || message.createdAt}
            message={message}
            onResend={() => {
              ReactGA.event({
                action: 'Resend last message',
                category: 'Action',
              });
              resendLastMessage();
            }}
            onEdit={() => {
              ReactGA.event({
                action: 'Edit message',
                category: 'Action',
              });
              setEditingMessage(message);
              message.rules && setChatRules(message.rules);
            }}
            onRegenerateResponse={() => {
              ReactGA.event({
                action: 'Regenerate response',
                category: 'Action',
              });
              message.id && regenerateResponse(message.id);
            }}
          />
        ))}
      </>
    );
  }, [messages]);

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
        {!!generatingMessage && (
          <ChatMessage
            key="message-0"
            message={{ content: generatingMessage, role: 'assistant' }}
            noActions
          />
        )}
        {renderMessages()}
      </Flex>

      <Box
        pos={{ base: 'fixed', md: 'relative' }}
        bottom={0}
        left={0}
        w="full"
        zIndex={1}
        bgColor="gray.700"
        _light={{ bgColor: 'gray.200' }}
      >
        {!!editingMessage && (
          <SelectedMessage
            icon={TbPencil}
            onClose={() => {
              setEditingMessage(undefined);
              hideRuleOptions();
              handleClearRules();
            }}
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
                    color={accentColor('500')}
                    mt="-2px"
                  />
                </Tooltip>
              </>
            }
            template={editingMessage.template}
            onSaveTemplate={updateMessageTemplate}
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
          hidden={isTyping || isLessThanMd || selectedChatId === -1}
        >
          <Button
            leftIcon={<MdOutlineChecklist />}
            aria-label="Show rule options"
            size="sm"
            pointerEvents="initial"
            borderBottomRadius="0"
            bgColor="gray.500"
            onClick={toggleShowRuleOptions}
            border="1px solid"
            borderBottom={0}
            borderColor={CustomColor.border}
            _hover={{ bgColor: 'gray.600' }}
            _light={{
              bgColor: 'gray.100',
              border: '1px solid',
              borderBottom: 0,
              borderColor: CustomColor.lightBorder,
            }}
          >
            {isShowRuleOptions ? 'Hide' : 'Show'} Rules
            {!!chatRulesCount && !isShowRuleOptions && (
              <Tag
                ml={2}
                size="sm"
                borderRadius="full"
                _light={{ bgColor: 'gray.200' }}
              >
                {chatRulesCount}
              </Tag>
            )}
          </Button>
        </Flex>

        {!isLessThanMd && (
          <Box
            h="1px"
            bgColor={CustomColor.border}
            _light={{ bgColor: CustomColor.lightBorder }}
            mb={4}
          />
        )}

        <Box mb={4} hidden={!isShowRuleOptions || isTyping || isLessThanMd}>
          <ChatRules
            value={chatRules}
            onChange={setChatRules}
            hidden={template ? ['format', 'writingStyle'] : []}
            onClose={handleClearRules}
            getActiveRules={(count) => {
              setChatRulesCount(count);
              if (editingMessage) {
                showRuleOptions();
              }
            }}
          />
        </Box>

        <Flex
          p={2}
          pb={{ base: 6, md: 2 }}
          pr={selectedChat?.limited && isLessThanMd ? 2 : 4}
          bgColor={isTyping ? 'gray.700' : CustomColor.card}
          borderRadius={{ base: 0, md: '2xl' }}
          border="1px solid"
          borderColor={{
            base: 'transparent',
            md: isTyping ? accentColor('500') : CustomColor.border,
          }}
          align="center"
          justify="center"
          direction={selectedChat?.limited && isLessThanMd ? 'column' : 'row'}
          _light={{
            bgColor: isTyping ? 'gray.100' : CustomColor.lightCard,
            borderColor: {
              base: 'transparent',
              md: isTyping ? accentColor('500') : CustomColor.lightBorder,
            },
          }}
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
                _light={{
                  border: '1px solid',
                  borderColor: CustomColor.lightBorder,
                }}
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
