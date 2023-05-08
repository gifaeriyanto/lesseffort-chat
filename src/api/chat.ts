import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';

export interface Chat {
  id?: number;
  bot_id: number;
  last_message: string;
  model: OpenAIModel;
  title: string;
}

export interface Message {
  role: 'user' | 'system' | 'assistant';
  content: string;
  chatId?: number;
  timestamp?: number;
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
          content:
            'You are a very smart humorous. Respond with casual language but friendly. Use markdown format and if you write a code, please do with maximal 10 words per line. Always use supported emoticon for all devices',
        },
        ...messages.map((message) => ({
          content: message.content,
          role: message.role,
        })),
      ],
    },
    {
      apiKey: localStorage.getItem('OPENAI_KEY') || '',
      handler,
    },
  );
};
