import {
  ChatHistory,
  generateResponse,
  MappedChatHistory,
  Message,
  OpenAIModel,
} from 'api/chat';
import { getUsages } from 'api/openai';
import { prepend, reverse } from 'ramda';
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
  chatHistory: ChatHistory;
  mapChatHistory: () => MappedChatHistory;
  setChatHistory: () => void;
}>((set, get) => ({
  chatHistory: {},
  mapChatHistory: () => {
    get().setChatHistory();
    return Object.entries(get().chatHistory).map(([key, value]) => ({
      title: value.title,
      description: value.description,
    }));
  },
  setChatHistory: () => {
    if (typeof window !== 'undefined') {
      if (!Object.keys(get().chatHistory).length) {
        const savedChatHistory = window.localStorage.getItem('chatHistory');
        const chatHistory = savedChatHistory
          ? (JSON.parse(savedChatHistory) as ChatHistory)
          : {};
        set(() => ({ chatHistory }));
      }
    }
  },
}));
