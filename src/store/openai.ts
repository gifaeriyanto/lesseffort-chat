import { Chat, generateResponse, Message, OpenAIModel } from 'api/chat';
import { getUsages } from 'api/openai';
import { prepend, reverse } from 'ramda';
import { useIndexedDB } from 'react-indexed-db';
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
      set(() => ({ usage: total_usage }));
      return total_usage;
    } catch (error) {
      console.error(error);
    }
  },
}));

export const useChat = create<{
  generatingMessage: string;
  messages: Message[];
  model: OpenAIModel;
  stopStream: () => void;
  streamChatCompletion: (value: string) => void;
  xhr?: XMLHttpRequest;
}>((set, get) => ({
  generatingMessage: '',
  messages: [],
  model: OpenAIModel.GPT_3_5,
  stopStream: () => get().xhr?.abort(),
  streamChatCompletion: (value) => {
    const { messages, model } = get();

    const assistandMessage: Message = { role: 'user', content: value };
    const updatedMessages = prepend<Message>(assistandMessage, messages);

    set(() => ({ messages: updatedMessages }));

    const onContent = (content: string, isFinal: boolean) => {
      if (isFinal) {
        set((prev) => ({
          messages: [{ role: 'assistant', content }, ...prev.messages],
          generatingMessage: '',
        }));
      } else {
        set(() => ({ generatingMessage: content }));
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
    set(() => ({ xhr: stream }));
  },
  xhr: undefined,
}));

export const useChatHistory = create<{
  chatHistory: Chat[];
  getChatHistory: () => void;
  newChat: (data: Chat) => void;
  deleteChat: (id: number) => void;
}>((set, get) => ({
  chatHistory: [],
  getChatHistory: async () => {
    const db = useIndexedDB('chatHistory');
    const chatHistory = await db.getAll<Chat>();
    set({ chatHistory });
  },
  newChat: (data) => {
    const db = useIndexedDB('chatHistory');
    db.add<Chat>(data);
    get().getChatHistory();
  },
  deleteChat: (id) => {
    const db = useIndexedDB('chatHistory');
    db.deleteRecord(id);
    get().getChatHistory();
  },
}));
