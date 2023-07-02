import { RefObject } from 'react';
import { captureException } from '@sentry/react';
import { Chat, generateResponse, Message } from 'api/chat';
import {
  defaultBotInstruction,
  defaultModel,
  OpenAIModel,
} from 'api/constants';
import { supabase } from 'api/supabase';
import { getUser } from 'api/supabase/auth';
import { getSavedMessages } from 'api/supabase/chat';
import { chatRulesPrompt, Rules } from 'components/chat/rules';
import { Plan } from 'components/pricingPlans';
import { DBChatSettings } from 'containers/chat/chatSettings';
import { getUnixTime } from 'date-fns';
import { Editor } from 'draft-js';
import { standaloneToast } from 'index';
import { prepend, reverse } from 'ramda';
import { useIndexedDB } from 'react-indexed-db';
import { getMessagesDB } from 'store/db/queries';
import { create } from 'zustand';

export const modifyTemplate = (
  prompt: string,
  template: string,
  rules?: Rules,
) => {
  let rulesText = '';

  if (rules) {
    rulesText = ' ' + chatRulesPrompt(rules, true);
  }

  return (
    template.replaceAll('[PROMPT]', prompt) +
    '\n\nNote:\n\nPlease respond always with markdown format.' +
    rulesText
  );
};

export const useChat = create<{
  botInstruction: string;
  chatHistory: Chat[];
  editingMessage?: Message;
  generatingMessage: string;
  isTyping: boolean;
  messages: Message[];
  model: OpenAIModel;
  // note: -1 is saved messages
  selectedChatId: number | undefined;
  xhr?: XMLHttpRequest;
  richEditorRef: RefObject<Editor> | null;
  setBotInstruction: (instruction: string) => Promise<void>;
  setModel: (model: OpenAIModel) => void;
  deleteChat: (chatId: number) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  deleteTheNextMessages: (chatId: number, messageId: number) => Promise<void>;
  updateMessage: (message: string, rules: Rules) => void;
  updateMessageTemplate: (template: string) => void;
  selectGeneratedMessage: (message: Message, selectedIndex: number) => void;
  getMessages: (chatId: number) => Promise<Message[]>;
  getSavedMessages: () => Promise<Message[]>;
  getChatHistory: () => Promise<void>;
  newChat: (
    data: Omit<Chat, 'bot_instruction' | 'model'>,
    userMessage: Message,
  ) => Promise<void>;
  continueChat: (
    data: Omit<Chat, 'bot_instruction' | 'model'>,
    messages: Message[],
  ) => Promise<void>;
  regenerateResponse: (messageId: number) => void;
  renameChat: (chatId: number, newTitle: string) => Promise<void>;
  resendLastMessage: () => Promise<void>;
  reset: () => Promise<void>;
  resetChatSettings: () => void;
  setEditingMessage: (message?: Message) => void;
  setRichEditorRef: (ref: RefObject<Editor>) => void;
  setSelectedChatId: (chatId: number | undefined) => void;
  stopStream: () => Promise<void>;
  streamChatCompletion: (params: {
    notNewMessage?: boolean;
    isLimited?: boolean;
    userMessage: Message;
    allGeneratedMessages?: string[];
  }) => void;
}>((set, get) => ({
  botInstruction: defaultBotInstruction,
  editingMessage: undefined,
  generatingMessage: '',
  isTyping: false,
  messages: [],
  model: defaultModel,
  richEditorRef: null,
  setRichEditorRef: (ref) => set({ richEditorRef: ref }),
  setBotInstruction: async (botInstruction) => {
    set({ botInstruction });
    const { selectedChatId, getChatHistory } = get();
    const dbChatHistory = useIndexedDB('chatHistory');

    try {
      if (selectedChatId) {
        const res = await dbChatHistory.getByID(selectedChatId);
        await dbChatHistory.update({
          ...res,
          bot_instruction: botInstruction,
        });
        await getChatHistory();
      }
    } catch (error) {
      captureException(error);
    }
  },
  setModel: (model) => {
    set({ model });
    const { selectedChatId } = get();
    const dbChatHistory = useIndexedDB('chatHistory');

    if (selectedChatId) {
      dbChatHistory
        .getByID(selectedChatId)
        .then((res) => {
          dbChatHistory.update({
            ...res,
            model,
          });
        })
        .catch(captureException);
    }
  },
  stopStream: async () => {
    const dbMessages = useIndexedDB('messages');
    const { xhr, generatingMessage, selectedChatId } = get();
    xhr?.abort();

    if (generatingMessage) {
      const content =
        generatingMessage + '\n\n> 🚨 This message was interrupted.';
      dbMessages.add<Message>({
        role: 'assistant',
        content,
        chatId: selectedChatId,
        createdAt: getUnixTime(new Date()),
        updatedAt: getUnixTime(new Date()),
      });

      if (selectedChatId) {
        try {
          await get().getMessages(selectedChatId);
        } catch (error) {
          captureException(error);
        }
      }
    }

    set({
      generatingMessage: '',
      isTyping: false,
    });
  },
  streamChatCompletion: ({
    notNewMessage = false,
    isLimited,
    userMessage,
    allGeneratedMessages,
  }) => {
    const {
      botInstruction,
      messages,
      model,
      getChatHistory,
      selectedChatId: chatId,
      getMessages,
    } = get();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');

    set({ isTyping: true });

    const updatedMessages = notNewMessage
      ? messages
      : prepend<Message>(userMessage, messages);

    set({ messages: updatedMessages });

    const onContent = async (content: string, isFinal: boolean) => {
      if (isFinal) {
        const newMessage: Message = {
          chatId,
          content,
          role: 'assistant',
          createdAt: getUnixTime(new Date()),
          updatedAt: getUnixTime(new Date()),
        };

        if (notNewMessage && allGeneratedMessages) {
          newMessage.allContents = [...allGeneratedMessages, content];
        }

        try {
          await dbMessages.add<Message>(newMessage);
        } catch (error) {
          captureException(error);
        }

        set((prev) => ({
          messages: [newMessage, ...prev.messages],
          generatingMessage: '',
          isTyping: false,
        }));

        if (chatId) {
          try {
            await getMessages(chatId); // to make sure all messages is sync with indexeddb
            const res = await dbChatHistory.getByID<Chat>(chatId);
            await dbChatHistory.update({
              ...res,
              title:
                res?.title === 'New Chat'
                  ? userMessage.content.slice(0, 50)
                  : res?.title,
              last_message: content.slice(0, 50),
              updatedAt: getUnixTime(new Date()),
            });
            await getChatHistory();
          } catch (error) {
            captureException(error);
          }
        }
      } else {
        set({ generatingMessage: content });
      }
    };

    const onError = async (
      error: Error,
      status: number,
      xhr: XMLHttpRequest,
    ) => {
      const errorMessage = xhr?.response?.error?.message;

      captureException(error);

      switch (status) {
        case 400:
          if (chatId) {
            try {
              const res = await dbChatHistory.getByID<Chat>(chatId);
              await dbChatHistory.update({
                ...res,
                limited: true,
              });
              await getChatHistory();
            } catch (error) {
              captureException(error);
            }
          }

          if (!standaloneToast.isActive('contextLimit')) {
            standaloneToast({
              id: 'contextLimit',
              title: 'Context length exceeded',
              description:
                "This model's maximum context length is 4097 tokens. However, your messages resulted in 6601 tokens. Please reduce the length of the messages.",
              status: 'error',
            });
          }
          break;

        case 401:
          localStorage.removeItem('OPENAI_KEY');
          window.location.reload();
          break;

        default:
          if (!standaloneToast.isActive('somethingError')) {
            standaloneToast({
              id: 'somethingError',
              title: 'Oops! Something went wrong. 😕',
              description:
                errorMessage ||
                `We're sorry about that. Please try again later.\nError status: ${status}`,
              status: 'error',
            });
          }
          break;
      }
    };

    const stream = generateResponse(
      isLimited
        ? reverse(updatedMessages).slice(-10)
        : reverse(updatedMessages),
      model,
      {
        onContent,
        onError,
        onDone: () => {
          set({
            generatingMessage: '',
            isTyping: false,
          });
        },
      },
      {
        botInstruction,
      },
    );
    set({ xhr: stream });
  },
  xhr: undefined,
  chatHistory: [],
  deleteChat: async (chatId) => {
    const dbChatHistory = useIndexedDB('chatHistory');
    await dbChatHistory.deleteRecord(chatId);
    const { getChatHistory, reset } = get();
    await getChatHistory();
    await reset();
  },
  deleteMessage: async (messageId) => {
    const dbMessages = useIndexedDB('messages');
    await dbMessages.deleteRecord(messageId);
    const { getMessages, selectedChatId } = get();
    if (selectedChatId) {
      await getMessages(selectedChatId);
    }
  },
  getMessages: async (chatId) => {
    localStorage.setItem('lastOpenChatId', String(chatId));
    try {
      const filteredMessages = await getMessagesDB(chatId);
      set({ messages: reverse(filteredMessages) });
      return filteredMessages;
    } catch (error) {
      captureException(error);
    }
  },
  getSavedMessages: async () => {
    const res = await getSavedMessages();
    const messages = res
      .map(
        (item) =>
          ({
            id: item.id,
            content: item.content,
            role: item.role,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            chatId: -1,
          } as Message),
      )
      .reverse();
    set({
      messages,
    });
    return messages;
  },
  getChatHistory: async () => {
    const dbChatHistory = useIndexedDB('chatHistory');
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    try {
      const chatHistory = await dbChatHistory.getAll<Chat>();
      set({
        chatHistory: reverse(
          chatHistory.filter((item) => item.userId === userId),
        ),
      });
    } catch (error) {
      captureException(error);
    }
  },
  newChat: async (data, userMessage) => {
    const { reset, getChatHistory } = get();
    await reset();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    dbChatHistory.add<Chat>({
      ...data,
      title: data.title.replace(/([*_~`])/g, ''),
      last_message: data.last_message.replace(/([*_~`])/g, ''),
      createdAt: getUnixTime(new Date()),
      bot_instruction: get().botInstruction,
      model: get().model,
      userId,
    });

    try {
      await getChatHistory();

      const chatId = get().chatHistory[0]?.id;
      await dbMessages.add<Message>({ ...userMessage, chatId });
      set({
        selectedChatId: chatId,
      });
    } catch (error) {
      captureException(error);
    }
  },
  continueChat: async (data, messages) => {
    const { reset, getChatHistory } = get();
    await reset();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    dbChatHistory.add<Chat>({
      ...data,
      createdAt: getUnixTime(new Date()),
      bot_instruction: get().botInstruction,
      model: get().model,
      userId,
    });

    try {
      await getChatHistory();

      const chatId = get().chatHistory[0]?.id;

      const defaultMessage: Partial<Message> = {
        chatId,
        createdAt: getUnixTime(new Date()),
        updatedAt: getUnixTime(new Date()),
      };

      for await (const message of messages) {
        await dbMessages.add<Message>({
          ...message,
          ...defaultMessage,
        });
      }

      localStorage.setItem('lastOpenChatId', String(chatId));
    } catch (error) {
      captureException(error);
    }
  },
  selectedChatId: undefined,
  setSelectedChatId: async (chatId) => {
    const { getMessages, setEditingMessage, stopStream } = get();
    const userData = await getUser();

    if (userData?.plan === Plan.free && chatId === -1) {
      localStorage.removeItem('lastOpenChatId');
      set({ selectedChatId: undefined });
      return;
    }

    const dbChatHistory = useIndexedDB('chatHistory');

    try {
      await stopStream();
      setEditingMessage(undefined);
      set({ selectedChatId: chatId });
      if (!chatId) {
        return;
      }
      if (chatId > 0) {
        const res = await dbChatHistory.getByID(chatId);
        if (!res) {
          localStorage.removeItem('lastOpenChatId');
          set({ selectedChatId: undefined });
          return;
        }
        set({
          botInstruction: res?.bot_instruction || defaultBotInstruction,
          model: res?.model || defaultModel,
        });
        await getMessages(chatId);
      } else {
        localStorage.setItem('lastOpenChatId', '-1');
        await get().getSavedMessages();
      }
    } catch (error) {
      captureException(error);
    }
  },
  resendLastMessage: async () => {
    const { update } = useIndexedDB('messages');
    const { messages, getMessages, streamChatCompletion } = get();

    if (!messages.length) {
      return;
    }

    const lastMessage = messages[0];

    try {
      await update(lastMessage);
      if (lastMessage.chatId) {
        await getMessages(lastMessage.chatId);
        streamChatCompletion({
          userMessage: lastMessage,
          notNewMessage: true,
        });
      }
    } catch (error) {
      captureException(error);
    }
  },
  reset: async () => {
    await get().stopStream();
    set({
      editingMessage: undefined,
      selectedChatId: undefined,
      messages: [],
      generatingMessage: '',
      isTyping: false,
    });
  },
  resetChatSettings: async () => {
    const dbSettings = useIndexedDB('settings');
    const setting = await dbSettings.getByID<DBChatSettings>(1);

    set({
      botInstruction: setting.chat_bot_instruction || defaultBotInstruction,
      model: setting.chat_model || defaultModel,
    });
  },
  setEditingMessage: (message) => {
    set({ editingMessage: message });
  },
  deleteTheNextMessages: async (chatId, messageId) => {
    const { deleteRecord } = useIndexedDB('messages');
    const { getMessages } = get();

    try {
      const deleteCandidates = await getMessages(chatId);
      deleteCandidates
        .filter((item: Message) => {
          return !!item.id && item.id > messageId;
        })
        .forEach(async (item) => await deleteRecord(item.id));
    } catch (error) {
      captureException(error);
    }
  },
  updateMessage: async (message, rules) => {
    const { update } = useIndexedDB('messages');
    const {
      editingMessage,
      deleteTheNextMessages,
      getMessages,
      streamChatCompletion,
    } = get();

    if (!editingMessage || !editingMessage.chatId || !editingMessage.id) {
      return;
    }

    try {
      await update({
        ...editingMessage,
        rules,
        content: message,
        updatedAt: getUnixTime(new Date()),
      });

      await deleteTheNextMessages(editingMessage.chatId, editingMessage.id);
      await getMessages(editingMessage.chatId);
    } catch (error) {
      captureException(error);
    }

    streamChatCompletion({
      userMessage: editingMessage,
      notNewMessage: true,
    });
    set({ editingMessage: undefined });
  },
  updateMessageTemplate: async (template) => {
    const { update } = useIndexedDB('messages');
    const { editingMessage, setEditingMessage } = get();

    if (editingMessage?.chatId) {
      const newMessage: Message = {
        ...editingMessage,
        template,
      };

      try {
        await update(newMessage);
        setEditingMessage(newMessage);
        await get().getMessages(editingMessage.chatId);
      } catch (error) {
        captureException(error);
      }
    }
  },
  selectGeneratedMessage: async (message, selectedChatId) => {
    const { update } = useIndexedDB('messages');

    if (!message.allContents?.[selectedChatId] || !message.chatId) {
      return;
    }

    try {
      await update({
        ...message,
        content: message.allContents[selectedChatId],
        updatedAt: getUnixTime(new Date()),
      });

      await get().getMessages(message.chatId);
    } catch (error) {
      captureException(error);
    }
  },
  regenerateResponse: async (messageId) => {
    const {
      messages,
      deleteTheNextMessages,
      getMessages,
      streamChatCompletion,
    } = get();
    const messageIndex = messages.findIndex((item) => item.id === messageId);

    if (messageIndex === -1) {
      return;
    }

    const oldMessage = messages[messageIndex];
    const allGeneratedMessages = oldMessage.allContents || [oldMessage.content];
    const userMessage = messages[messageIndex + 1];

    if (!userMessage.chatId || !userMessage.id) {
      return;
    }

    try {
      await deleteTheNextMessages(userMessage.chatId, userMessage.id);
      await getMessages(userMessage.chatId);
      streamChatCompletion({
        userMessage,
        notNewMessage: true,
        allGeneratedMessages,
      });
    } catch (error) {
      captureException(error);
    }
  },
  renameChat: async (chatId, newTitle) => {
    const { update, getByID } = useIndexedDB('chatHistory');
    const chat = await getByID(chatId);
    try {
      await update<Chat>({ ...chat, title: newTitle });
      await get().getChatHistory();
    } catch (error) {
      captureException(error);
    }
  },
}));
