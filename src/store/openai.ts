import { RefObject } from 'react';
import { captureException } from '@sentry/react';
import {
  Chat,
  defaultBotInstruction,
  generateResponse,
  Message,
  OpenAIModel,
} from 'api/chat';
import { getUsages } from 'api/openai';
import { Rules } from 'components/chat/rules';
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
  return (
    template
      .replaceAll('[PROMPT]', prompt)
      .replaceAll('[TARGETLANGUAGE]', rules?.outputLanguage || '')
      .replaceAll('[TONE]', rules?.tone || '') +
    '\n\nAlways use markdown format.'
  );
};

export const useUsage = create<{
  usage: number;
  getUsages: () => Promise<number | void>;
}>((set) => ({
  usage: 0,
  getUsages: async () => {
    try {
      const res = await getUsages();
      const { total_usage } = res.data;
      set({ usage: total_usage });
      return total_usage;
    } catch (error) {
      captureException(error);
    }
  },
}));

export const useProfilePhoto = create<{
  photo: string | null;
  setPhoto: (image: string) => void;
  getPhoto: () => string | null;
}>((set, get) => ({
  photo: null,
  setPhoto: (image: string) => {
    localStorage.setItem('photoProfile', image);
    set({ photo: image });
  },
  getPhoto: () => {
    const { photo } = get();

    const localImage = localStorage.getItem('photoProfile');
    if (localImage && !photo) {
      set({ photo: localImage });
    }

    return photo;
  },
}));

export const useChat = create<{
  botInstruction: string;
  chatHistory: Chat[];
  editingMessage?: Message;
  generatingMessage: string;
  isTyping: boolean;
  messages: Message[];
  model: OpenAIModel;
  selectedChatId: number | undefined;
  xhr?: XMLHttpRequest;
  richEditorRef: RefObject<Editor> | null;
  setBotInstruction: (instruction: string) => Promise<void>;
  setModel: (model: OpenAIModel) => void;
  deleteChat: (chatId: number) => void;
  deleteTheNextMessages: (chatId: number, messageId: number) => Promise<void>;
  updateMessage: (message: string) => void;
  updateMessageTemplate: (template: string) => void;
  selectGeneratedMessage: (message: Message, selectedIndex: number) => void;
  getMessages: (chatId: number) => Promise<Message[]>;
  getChatHistory: () => Promise<void>;
  newChat: (
    data: Omit<Chat, 'bot_instruction' | 'model'>,
    userMessage: Message,
  ) => Promise<void>;
  regenerateResponse: (messageId: number) => void;
  renameChat: (chatId: number, newTitle: string) => void;
  resendLastMessage: () => Promise<void>;
  reset: () => void;
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
  model: OpenAIModel.GPT_3_5,
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
                res.title === 'New Chat'
                  ? userMessage.content.slice(0, 50)
                  : res.title,
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

    const onError = async (error: Error, status: number) => {
      captureException(error);
      set({
        isTyping: false,
      });
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

          standaloneToast({
            title: 'Context length exceeded',
            description:
              "This model's maximum context length is 4097 tokens. However, your messages resulted in 6601 tokens. Please reduce the length of the messages.",
            status: 'error',
          });
          break;

        case 401:
          localStorage.removeItem('OPENAI_KEY');
          window.location.reload();
          break;

        case 429:
          standaloneToast({
            title: 'Oops! Something went wrong. 😕',
            description: `${error.message}\nError status: ${status}`,
            status: 'error',
          });
          break;

        default:
          standaloneToast({
            title: 'Oops! Something went wrong. 😕',
            description: `We're sorry about that. Please try again later.\nError status: ${status}`,
            status: 'error',
          });
          set({
            generatingMessage: '',
            isTyping: false,
          });
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
      },
      {
        botInstruction,
      },
    );
    set({ xhr: stream });
  },
  xhr: undefined,
  chatHistory: [],
  deleteChat: (chatId) => {
    const db = useIndexedDB('chatHistory');
    db.deleteRecord(chatId);
    const { getChatHistory, reset } = get();
    getChatHistory();
    reset();
    localStorage.removeItem('lastOpenChatId');
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
  getChatHistory: async () => {
    const db = useIndexedDB('chatHistory');
    try {
      const chatHistory = await db.getAll<Chat>();
      set({ chatHistory: reverse(chatHistory) });
    } catch (error) {
      captureException(error);
    }
  },
  newChat: async (data, userMessage) => {
    const { reset, getChatHistory } = get();
    reset();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');
    dbChatHistory.add<Chat>({
      ...data,
      createdAt: getUnixTime(new Date()),
      bot_instruction: get().botInstruction,
      model: get().model,
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
  selectedChatId: undefined,
  setSelectedChatId: async (chatId) => {
    const { getMessages, setEditingMessage, stopStream } = get();
    const dbChatHistory = useIndexedDB('chatHistory');

    try {
      await stopStream();
      setEditingMessage(undefined);
      set({ selectedChatId: chatId });
      if (chatId) {
        const res = await dbChatHistory.getByID(chatId);
        set({
          botInstruction: res.bot_instruction || defaultBotInstruction,
          model: res.model,
        });
        await getMessages(chatId);
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
  reset: () => {
    get().stopStream();
    set({
      editingMessage: undefined,
      selectedChatId: undefined,
      messages: [],
      generatingMessage: '',
      isTyping: false,
    });
  },
  resetChatSettings: () => {
    set({
      botInstruction: defaultBotInstruction,
      model: OpenAIModel.GPT_3_5,
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
  updateMessage: async (message) => {
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
