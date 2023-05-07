import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';

export interface Chat {
  title: string;
  description: string;
  model: OpenAIModel;
  bot_description: string;
  messages: Message[];
}

export type ChatHistory = Record<string, Chat>;

export type MappedChatHistory = Pick<Chat, 'title' | 'description'>[];

export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
}

export enum OpenAIModel {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_LEGACY = 'gpt-3.5-turbo-0301',
  GPT_4 = 'gpt-4',
}

export const generateResponse = (
  messages: Message[],
  model: OpenAIModel,
  handler?: ClientStreamChatCompletionConfig['handler'],
) => {
  return OpenAIExt.streamClientChatCompletion(
    {
      model,
      messages: [
        {
          role: 'system',
          content: `You are a very smart humorous. Respond with casual language but friendly. Your name is Dinda. Use markdown format and if you write a code, please do with maximal 10 words per line. Always use supported emoticon for all devices`,
        },
        ...messages,
      ],
    },
    {
      apiKey: window.localStorage.getItem('OPENAI_KEY') || '',
      handler,
    },
  );
};
