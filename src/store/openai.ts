import { RefObject } from 'react';
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
      console.error(error);
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

    if (selectedChatId) {
      const res = await dbChatHistory.getByID(selectedChatId);
      await dbChatHistory.update({
        ...res,
        bot_instruction: botInstruction,
      });
      await getChatHistory();
    }
  },
  setModel: (model) => {
    set({ model });
    const { selectedChatId } = get();
    const dbChatHistory = useIndexedDB('chatHistory');

    if (selectedChatId) {
      dbChatHistory.getByID(selectedChatId).then((res) => {
        dbChatHistory.update({
          ...res,
          model,
        });
      });
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
        await get().getMessages(selectedChatId);
      }
    }

    set({
      generatingMessage: '',
      isTyping: false,
    });
  },
  streamChatCompletion: ({ notNewMessage = false, isLimited, userMessage }) => {
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

        await dbMessages.add<Message>(newMessage);

        set((prev) => ({
          messages: [newMessage, ...prev.messages],
          generatingMessage: '',
          isTyping: false,
        }));

        if (chatId) {
          await getMessages(chatId); // to make sure all messages is sync with indexeddb
          dbChatHistory
            .getByID<Chat>(chatId)
            .then((res) => {
              dbChatHistory.update({
                ...res,
                title:
                  res.title === 'New Chat'
                    ? userMessage.content.slice(0, 50)
                    : res.title,
                last_message: content.slice(0, 50),
                updatedAt: getUnixTime(new Date()),
              });
            })
            .finally(getChatHistory);
        }
      } else {
        set({ generatingMessage: content });
      }
    };

    const onError = async (_: Error, status: number) => {
      set({
        isTyping: false,
      });
      switch (status) {
        case 400:
          if (chatId) {
            await dbChatHistory.getByID<Chat>(chatId).then((res) => {
              dbChatHistory.update({
                ...res,
                limited: true,
              });
            });
            await getChatHistory();
          }
          break;

        case 401:
          localStorage.removeItem('OPENAI_KEY');
          window.location.reload();
          break;

        case 429:
          standaloneToast({
            title: 'Oops! Something went wrong. 😕',
            description: `It seems like you're sending requests too quickly. Please slow down and pace your requests\nError status: ${status}`,
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
  },
  getMessages: async (chatId) => {
    localStorage.setItem('lastOpenChatId', String(chatId));
    const filteredMessages = await getMessagesDB(chatId);
    set({ messages: reverse(filteredMessages) });
    return filteredMessages;
  },
  getChatHistory: async () => {
    const db = useIndexedDB('chatHistory');
    const chatHistory = await db.getAll<Chat>();
    set({ chatHistory: reverse(chatHistory) });
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
    await getChatHistory();

    const chatId = get().chatHistory[0]?.id;
    await dbMessages.add<Message>({ ...userMessage, chatId });
    set({
      selectedChatId: chatId,
    });
  },
  selectedChatId: undefined,
  setSelectedChatId: async (chatId) => {
    const { getMessages, setEditingMessage, stopStream } = get();
    const dbChatHistory = useIndexedDB('chatHistory');
    await stopStream();
    setEditingMessage(undefined);
    set({ selectedChatId: chatId });
    if (chatId) {
      await dbChatHistory.getByID(chatId).then((res) => {
        set({
          botInstruction: res.bot_instruction || defaultBotInstruction,
          model: res.model,
        });
        getMessages(chatId);
      });
    }
  },
  resendLastMessage: async () => {
    const { update } = useIndexedDB('messages');
    const { messages, getMessages, streamChatCompletion } = get();

    if (!messages.length) {
      return;
    }

    const lastMessage = messages[0];
    await update(lastMessage);
    if (lastMessage.chatId) {
      await getMessages(lastMessage.chatId);
      streamChatCompletion({
        userMessage: lastMessage,
        notNewMessage: true,
      });
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
    const deleteCandidates = await getMessages(chatId);
    deleteCandidates
      .filter((item: Message) => {
        return !!item.id && item.id > messageId;
      })
      .forEach(async (item) => await deleteRecord(item.id));
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

    await update({
      ...editingMessage,
      content: message,
      updatedAt: getUnixTime(new Date()),
    });
    await deleteTheNextMessages(editingMessage.chatId, editingMessage.id);
    await getMessages(editingMessage.chatId);
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
      await update(newMessage);
      setEditingMessage(newMessage);
      await get().getMessages(editingMessage.chatId);
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

    const userMessage = messages[messageIndex + 1];

    if (!userMessage.chatId || !userMessage.id) {
      return;
    }

    await deleteTheNextMessages(userMessage.chatId, userMessage.id);
    await getMessages(userMessage.chatId);
    streamChatCompletion({ userMessage, notNewMessage: true });
  },
  renameChat: async (chatId, newTitle) => {
    const { update, getByID } = useIndexedDB('chatHistory');
    const chat = await getByID(chatId);
    await update<Chat>({ ...chat, title: newTitle });
    await get().getChatHistory();
  },
}));
