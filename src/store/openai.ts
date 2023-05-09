import { RefObject } from 'react';
import { Chat, generateResponse, Message, OpenAIModel } from 'api/chat';
import { getUsages } from 'api/openai';
import { getUnixTime } from 'date-fns';
import { Editor } from 'draft-js';
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
  messages: Message[];
  model: OpenAIModel;
  selectedChatId: number | undefined;
  xhr?: XMLHttpRequest;
  richEditorRef: RefObject<Editor> | null;
  deleteChat: (id: number) => void;
  updateMessage: (message: string) => void;
  getMessages: (chatId: number) => Promise<Message[]>;
  getChatHistory: () => Promise<void>;
  newChat: (data: Chat) => Promise<void>;
  regenerateResponse: () => void;
  reset: () => void;
  setEditingMessage: (message?: Message) => void;
  setRichEditorRef: (ref: RefObject<Editor>) => void;
  setSelectedChatId: (id: number | undefined) => void;
  stopStream: () => void;
  streamChatCompletion: (value: string) => void;
}>((set, get) => ({
  editingMessage: undefined,
  generatingMessage: '',
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
  streamChatCompletion: (value) => {
    const {
      editingMessage,
      messages,
      model,
      getChatHistory,
      selectedChatId: chatId,
      getMessages,
    } = get();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');

    const userMessage: Message = {
      chatId,
      role: 'user',
      content: value,
      timestamp: getUnixTime(new Date()),
    };

    const updatedMessages = editingMessage
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

    const onError = (_: Error, status: number) => {
      if (status === 401) {
        localStorage.removeItem('OPENAI_KEY');
        window.location.reload();
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
  deleteChat: (id) => {
    const db = useIndexedDB('chatHistory');
    db.deleteRecord(id);
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
  setSelectedChatId: (id) => {
    set({ selectedChatId: id });
    if (id) {
      get().getMessages(id);
    }
  },
  reset: () => {
    set({
      editingMessage: undefined,
      selectedChatId: undefined,
      messages: [],
      generatingMessage: '',
    });
  },
  regenerateResponse: () => {
    const { messages, model } = get();
    const stream = generateResponse(reverse(messages), model, {
      onContent: console.log,
    });
    set({ xhr: stream });
  },
  setEditingMessage: (message) => {
    set({ editingMessage: message });
  },
  updateMessage: async (message) => {
    const { update, deleteRecord } = useIndexedDB('messages');
    const { editingMessage, getMessages, streamChatCompletion } = get();

    if (!editingMessage || !editingMessage.chatId || !editingMessage.id) {
      return;
    }

    await update({ ...editingMessage, content: message });

    const deleteCandidates = await getMessages(editingMessage.chatId);
    deleteCandidates
      .filter((item: Message) => {
        if (item.id && editingMessage.id) {
          return item.id > editingMessage.id;
        }
      })
      .forEach(async (item) => await deleteRecord(item.id));
    await getMessages(editingMessage.chatId);
    streamChatCompletion(message);
    set({ editingMessage: undefined });
  },
}));
