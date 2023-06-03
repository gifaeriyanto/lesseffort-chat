import React, { useLayoutEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Link,
  Select,
  Text,
  Textarea,
  useBoolean,
  VStack,
} from '@chakra-ui/react';
import { captureException } from '@sentry/react';
import { defaultBotInstruction, OpenAIModel } from 'api/constants';
import { TypingDots } from 'components/typingDots';
import ReactGA from 'react-ga4';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useIndexedDB } from 'react-indexed-db';
import { useChat } from 'store/chat';
import { accentColor } from 'theme/foundations/colors';
import { debounce } from 'utils/common';
import { shallow } from 'zustand/shallow';

export interface DBChatSettings {
  chat_model: string;
  chat_bot_instruction: string;
}

interface FormInputs {
  title: string;
  botInstruction: string;
  model: OpenAIModel;
}

export interface ChatSettingsProps {
  isGlobalSetting?: boolean;
}

export const ChatSettings: React.FC<ChatSettingsProps> = ({
  isGlobalSetting,
}) => {
  const {
    model,
    botInstruction,
    setBotInstruction,
    setModel,
    selectedChat,
    renameChat,
  } = useChat((state) => {
    const selectedChat = state.chatHistory.find(
      (item) => item.id === state.selectedChatId,
    );
    return {
      selectedChat,
      model: state.model,
      botInstruction: state.botInstruction,
      setBotInstruction: state.setBotInstruction,
      setModel: state.setModel,
      renameChat: state.renameChat,
    };
  }, shallow);
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm<FormInputs>();
  const dbSettings = useIndexedDB('settings');
  const [indexeddbReady, setIndexeddbReady] = useState(false);
  const [isSaving, { on, off }] = useBoolean();
  const [showSavingState, setShowSavingState] = useState(false);

  const debounceOnChange = debounce(
    (setter: Function, value: unknown) => setter(value),
    2000,
  );

  useLayoutEffect(() => {
    if (indexeddbReady) {
      return;
    }
    dbSettings
      .getByID<DBChatSettings>(1)
      .then((res) => {
        if (res?.chat_model) {
          setModel(res.chat_model as OpenAIModel);
          setValue('model', res.chat_model as OpenAIModel);
        }

        if (res?.chat_bot_instruction) {
          setBotInstruction(res.chat_bot_instruction);
          setValue('botInstruction', botInstruction);
        }
      })
      .finally(() => setIndexeddbReady(true));
  }, [dbSettings, indexeddbReady]);

  useLayoutEffect(() => {
    selectedChat?.title && setValue('title', selectedChat?.title);
    setValue('botInstruction', botInstruction);
    setValue('model', model);
  }, [model, botInstruction]);

  const handleSaveSettings: SubmitHandler<FormInputs> = async ({
    title,
    botInstruction: _botInstruction,
    model: _model,
  }) => {
    ReactGA.event({
      action: `Save chat settings ${isGlobalSetting ? 'globally' : 'locally'}`,
      category: 'Action',
    });

    try {
      await setBotInstruction(_botInstruction);
      setModel(_model);
    } catch (error) {
      captureException(error);
    }

    if (isGlobalSetting) {
      dbSettings.update({
        id: 1,
        chat_bot_instruction: _botInstruction,
        chat_model: _model,
      });
    } else {
      selectedChat?.id && renameChat(selectedChat.id, title);
    }

    off();
    setShowSavingState(true);
  };

  const handleResetToDefault = () => {
    setValue('title', 'New Chat');
    setValue('botInstruction', defaultBotInstruction);
    setValue('model', OpenAIModel.GPT_3_5);
    handleSaveSettings({
      title: 'New Chat',
      botInstruction: defaultBotInstruction,
      model: OpenAIModel.GPT_3_5,
    });
  };

  return (
    <>
      <Box fontSize="xl" fontWeight="bold">
        <Text color={accentColor('500')} as="span">
          Chat
        </Text>{' '}
        Settings
      </Box>

      <Box color="gray.400" fontSize="sm" mb={4}>
        {isGlobalSetting
          ? 'This setting will affect future chats.'
          : 'This setting will not affect future chats.'}
        <Text
          as="span"
          color={accentColor('500')}
          ml={2}
          hidden={!showSavingState || !!Object.keys(errors).length}
        >
          {isSaving ? (
            <>
              Saving
              <TypingDots />
            </>
          ) : (
            'Saved'
          )}
        </Text>
      </Box>

      <form
        onSubmit={handleSubmit(handleSaveSettings)}
        onChange={(e) => {
          if (!showSavingState) {
            setShowSavingState(true);
          }
          on();
          debounceOnChange(handleSubmit(handleSaveSettings), e);
        }}
      >
        <VStack spacing={8}>
          {!isGlobalSetting && (
            <FormControl isInvalid={!!errors['title']}>
              <FormLabel>Title</FormLabel>
              <Input
                defaultValue={selectedChat?.title || 'New Chat'}
                {...register('title', {
                  required: {
                    message: 'Title is required',
                    value: true,
                  },
                })}
              />
              {errors['title'] && (
                <FormErrorMessage>{errors['title']?.message}</FormErrorMessage>
              )}
            </FormControl>
          )}
          <FormControl isInvalid={!!errors['botInstruction']}>
            <FormLabel>Initial System Instruction</FormLabel>
            <Textarea
              defaultValue={botInstruction}
              rows={5}
              {...register('botInstruction', {
                required: {
                  message: 'Initial System Instruction is required',
                  value: true,
                },
              })}
            />
            {errors['botInstruction'] && (
              <FormErrorMessage>
                {errors['botInstruction']?.message}
              </FormErrorMessage>
            )}
            <FormHelperText>
              <Link
                href="https://platform.openai.com/docs/guides/chat/instructing-chat-models"
                target="_blank"
                color={accentColor('500')}
              >
                Learn more
              </Link>{' '}
              about how to create a good instruction
            </FormHelperText>
          </FormControl>
          <FormControl>
            <FormLabel>Model</FormLabel>
            <Select defaultValue={model} {...register('model')}>
              <option value={OpenAIModel.GPT_4}>
                GPT 4 by Open AI (Only for ChatGPT plus users)
              </option>
              <option value={OpenAIModel.GPT_3_5}>GPT 3.5 by Open AI</option>
              <option value={OpenAIModel.GPT_3_5_LEGACY}>
                GPT 3.5 (Legacy) by Open AI
              </option>
            </Select>
          </FormControl>

          <Button onClick={handleResetToDefault}>Reset to Default</Button>
        </VStack>
      </form>
    </>
  );
};
