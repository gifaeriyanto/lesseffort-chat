import { RefObject } from 'react';
import { Chat, generateResponse, Message, OpenAIModel } from 'api/chat';
import { getUsages } from 'api/openai';
import { getUnixTime } from 'date-fns';
import { Editor } from 'draft-js';
import { prepend, reverse } from 'ramda';
import { useIndexedDB } from 'react-indexed-db';
import { filterByChatId, mapMessage } from 'store/utils/parser';
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
  generatingMessage: string;
  messages: Message[];
  model: OpenAIModel;
  selectedChatId: number | undefined;
  xhr?: XMLHttpRequest;
  richEditorRef: RefObject<Editor> | null;
  deleteChat: (id: number) => void;
  getChatHistory: () => Promise<void>;
  newChat: (data: Chat) => Promise<void>;
  regenerateResponse: () => void;
  reset: () => void;
  setRichEditorRef: (ref: RefObject<Editor>) => void;
  setSelectedChatId: (id: number | undefined) => void;
  stopStream: () => void;
  streamChatCompletion: (value: string) => void;
}>((set, get) => ({
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
    const { messages, model, getChatHistory, selectedChatId: chatId } = get();
    const dbChatHistory = useIndexedDB('chatHistory');
    const dbMessages = useIndexedDB('messages');

    const assistandMessage: Message = {
      role: 'user',
      content: value,
      timestamp: getUnixTime(new Date()),
    };
    const updatedMessages = prepend<Message>(
      assistandMessage,
      messages.map(mapMessage),
    );

    set({ messages: updatedMessages });

    const onContent = (content: string, isFinal: boolean) => {
      if (isFinal) {
        set((prev) => ({
          messages: [{ role: 'assistant', content }, ...prev.messages],
          generatingMessage: '',
        }));

        dbMessages.add<Message>({
          chatId,
          content,
          role: 'assistant',
          timestamp: getUnixTime(new Date()),
        });

        if (chatId) {
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
    const { getAll } = useIndexedDB('messages');
    set({ selectedChatId: id });
    getAll<Message>()
      .then((messages) => messages.filter(filterByChatId(id)).map(mapMessage))
      .then((messages) => set({ messages: reverse(messages) }));
  },
  reset: () => {
    set({
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
}));
