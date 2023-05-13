import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';
import { mapMessage } from 'store/utils/parser';

export interface Chat {
  id?: number;
  bot_id: number;
  last_message: string;
  model: OpenAIModel;
  title: string;
  locked?: boolean;
  createdAt?: number;
  updatedAt?: number;
}

export interface Message {
  id?: number;
  role: 'user' | 'system' | 'assistant';
  content: string;
  chatId?: number;
  createdAt?: number;
  updatedAt?: number;
}

export enum OpenAIModel {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_LEGACY = 'gpt-3.5-turbo-0301',
  // GPT_4 = 'gpt-4', coming soon
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
            'You are a very smart humorous. Respond with casual language but friendly. Use markdown format and if you write a code, please tell us the languange code in markdown format. Always use supported emoticon for all devices',
        },
        ...messages.map(mapMessage),
      ],
    },
    {
      apiKey: localStorage.getItem('OPENAI_KEY') || '',
      handler,
    },
  );
};
