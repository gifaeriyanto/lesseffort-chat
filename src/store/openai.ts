import { RefObject } from 'react';
import { Chat, generateResponse, Message, OpenAIModel } from 'api/chat';
import { getUsages } from 'api/openai';
import { getUnixTime } from 'date-fns';
import { Editor } from 'draft-js';
import { standaloneToast } from 'index';
import { prepend, reverse } from 'ramda';
import { useIndexedDB } from 'react-indexed-db';
import { filterByChatId } from 'store/utils/parser';
import { create } from 'zustand';

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

export const useChat = create<{
  chatHistory: Chat[];
  editingMessage?: Message;
  generatingMessage: string;
  isTyping: boolean;
  messages: Message[];
  model: OpenAIModel;
  selectedChatId: number | undefined;
  xhr?: XMLHttpRequest;
  richEditorRef: RefObject<Editor> | null;
  deleteChat: (chatId: number) => void;
  deleteTheNextMessages: (chatId: number, messageId: number) => Promise<void>;
  updateMessage: (message: string) => void;
  getMessages: (chatId: number) => Promise<Message[]>;
  getChatHistory: () => Promise<void>;
  newChat: (data: Chat) => Promise<void>;
  regenerateResponse: (messageId: number) => void;
  reset: () => void;
  setEditingMessage: (message?: Message) => void;
  setRichEditorRef: (ref: RefObject<Editor>) => void;
  setSelectedChatId: (chatId: number | undefined) => void;
  stopStream: () => void;
  streamChatCompletion: (value: string, notNewMessage?: boolean) => void;
}>((set, get) => ({
  editingMessage: undefined,
  generatingMessage: '',
  isTyping: false,
  messages: [],
  model: OpenAIModel.GPT_3_5,
  richEditorRef: null,
  setRichEditorRef: (ref) => set({ richEditorRef: ref }),
  stopStream: () => {
    get().xhr?.abort();
    set((prev) => ({
      messages: [
        { role: 'assistant', content: get().generatingMessage },
        ...prev.messages,
      ],
      generatingMessage: '',
    }));
  },
  streamChatCompletion: (value, notNewMessage) => {
    const {
      messages,
      model,
      getChatHistory,
      selectedChatId: chatId,
      getMessages,
      reset,
    } = get();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');

    set({ isTyping: true });

    const userMessage: Message = {
      chatId,
      role: 'user',
      content: value,
      timestamp: getUnixTime(new Date()),
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
          timestamp: getUnixTime(new Date()),
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
              });
            })
            .finally(getChatHistory);
        }
      } else {
        set({ generatingMessage: content });
      }
    };

    const onError = async (_: Error, status: number) => {
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

    const stream = generateResponse(reverse(updatedMessages), model, {
      onContent,
      onError,
    });
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
    const { getAll } = useIndexedDB('messages');
    const filteredMessages = await getAll<Message>().then((messages) =>
      messages.filter(filterByChatId(chatId)),
    );
    set({ messages: reverse(filteredMessages) });
    return filteredMessages;
  },
  getChatHistory: async () => {
    const db = useIndexedDB('chatHistory');
    const chatHistory = await db.getAll<Chat>();
    set({ chatHistory: reverse(chatHistory) });
  },
  newChat: async (data) => {
    get().reset();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');
    dbChatHistory.add<Chat>(data);
    await get().getChatHistory();

    const chatId = get().chatHistory[0]?.id;
    if (data.last_message) {
      dbMessages.add<Message>({
        chatId,
        content: data.last_message,
        role: 'user',
        timestamp: getUnixTime(new Date()),
      });
    }
    set({
      selectedChatId: chatId,
    });
  },
  selectedChatId: undefined,
  setSelectedChatId: (chatId) => {
    set({ selectedChatId: chatId });
    if (chatId) {
      get().getMessages(chatId);
    }
  },
  reset: () => {
    set({
      editingMessage: undefined,
      selectedChatId: undefined,
      messages: [],
      generatingMessage: '',
      isTyping: false,
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

    await update({ ...editingMessage, content: message });
    await deleteTheNextMessages(editingMessage.chatId, editingMessage.id);
    await getMessages(editingMessage.chatId);
    streamChatCompletion(message, true);
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
    streamChatCompletion(userMessage.content, true);
  },
}));
