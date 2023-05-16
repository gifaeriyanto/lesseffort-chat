import { RefObject } from 'react';
import {
  Chat,
  defaultBotInstruction,
  generateResponse,
  Message,
  OpenAIModel,
} from 'api/chat';
import { getUsages } from 'api/openai';
import { getUnixTime } from 'date-fns';
import { Editor } from 'draft-js';
import { standaloneToast } from 'index';
import { prepend, reverse } from 'ramda';
import { useIndexedDB } from 'react-indexed-db';
import { getMessagesByChatID } from 'store/db/queries';
import { create } from 'zustand';

export const modifyTemplate = (prompt: string, template: string) => {
  return (
    template
      .replaceAll('[PROMPT]', prompt)
      .replaceAll('[TARGETLANGUAGE]', 'English') +
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
  getMessages: (chatId: number) => Promise<Message[]>;
  getChatHistory: () => Promise<void>;
  newChat: (data: Omit<Chat, 'bot_instruction' | 'model'>) => Promise<void>;
  regenerateResponse: (messageId: number) => void;
  renameChat: (chatId: number, newTitle: string) => void;
  reset: () => void;
  setEditingMessage: (message?: Message) => void;
  setRichEditorRef: (ref: RefObject<Editor>) => void;
  setSelectedChatId: (chatId: number | undefined) => void;
  stopStream: () => void;
  streamChatCompletion: (params: {
    value: string;
    notNewMessage?: boolean;
    template?: string;
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
  stopStream: () => {
    const dbMessages = useIndexedDB('messages');
    const { xhr, generatingMessage, selectedChatId } = get();
    xhr?.abort();
    set({
      generatingMessage: '',
      isTyping: false,
    });

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
      set((prev) => ({
        messages: generatingMessage
          ? [{ role: 'assistant', content }, ...prev.messages]
          : prev.messages,
      }));
    }
  },
  streamChatCompletion: ({
    value = '',
    notNewMessage = false,
    template = '',
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

    const userContent = template
      ? {
          content: modifyTemplate(value, template),
          originalContent: value,
        }
      : {
          content: value,
        };

    const userMessage: Message = {
      chatId,
      role: 'user',
      createdAt: getUnixTime(new Date()),
      updatedAt: getUnixTime(new Date()),
      ...userContent,
    };

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
                title: res.title === 'New Chat' ? value : res.title,
                last_message: content,
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
                locked: true,
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
      reverse(updatedMessages),
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
    const filteredMessages = await getMessagesByChatID(chatId);
    set({ messages: reverse(filteredMessages) });
    return filteredMessages;
  },
  getChatHistory: async () => {
    const db = useIndexedDB('chatHistory');
    const chatHistory = await db.getAll<Chat>();
    set({ chatHistory: reverse(chatHistory) });
  },
  newChat: async (data) => {
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
    if (data.last_message) {
      dbMessages.add<Message>({
        chatId,
        content: data.last_message,
        role: 'user',
        createdAt: getUnixTime(new Date()),
        updatedAt: getUnixTime(new Date()),
      });
    }
    set({
      selectedChatId: chatId,
    });
  },
  selectedChatId: undefined,
  setSelectedChatId: (chatId) => {
    const { getMessages, setEditingMessage, stopStream } = get();
    const dbChatHistory = useIndexedDB('chatHistory');
    stopStream();
    setEditingMessage(undefined);
    set({ selectedChatId: chatId });
    if (chatId) {
      dbChatHistory.getByID(chatId).then((res) => {
        set({ botInstruction: res.bot_instruction, model: res.model });
        getMessages(chatId);
      });
    }
  },
  reset: () => {
    set({
      editingMessage: undefined,
      selectedChatId: undefined,
      messages: [],
      generatingMessage: '',
      isTyping: false,
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
      value: message,
      notNewMessage: true,
    });
    set({ editingMessage: undefined });
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
    streamChatCompletion({ value: userMessage.content, notNewMessage: true });
  },
  renameChat: async (chatId, newTitle) => {
    const { update, getByID } = useIndexedDB('chatHistory');
    const chat = await getByID(chatId);
    await update<Chat>({ ...chat, title: newTitle });
    await get().getChatHistory();
  },
}));
