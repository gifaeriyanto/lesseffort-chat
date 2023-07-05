import { defaultBotInstruction, mandatoryInstruction } from 'api/constants';
import { openaiAPI } from 'api/openai';
import { Rules } from 'components/chat/rules';
import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';
import { mapMessage } from 'store/utils/parser';

export interface Chat {
  id?: number;
  bot_instruction: string;
  last_message: string;
  model: string;
  title: string;
  limited?: boolean;
  createdAt?: number;
  updatedAt?: number;
  userId?: string;
}

export interface Message {
  id?: number;
  role: 'user' | 'system' | 'assistant';
  content: string;
  allContents?: string[];
  chatId?: number;
  template?: string;
  templateData?: {
    id: number;
    title: string;
    author?: string;
    type?: string;
  };
  rules?: Rules;
  createdAt?: number;
  updatedAt?: number;
}

export const generateResponse = (
  messages: Message[],
  model: string,
  handler?: ClientStreamChatCompletionConfig['handler'],
  options?: {
    botInstruction: string;
  },
) => {
  return OpenAIExt.streamClientChatCompletion(
    {
      model,
      messages: [
        {
          role: 'system',
          content:
            (options?.botInstruction || defaultBotInstruction) +
            mandatoryInstruction,
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

export const getModels = async (openAIKey?: string) => {
  try {
    const res = await openaiAPI.get('/v1/models', {
      headers: {
        Authorization: `Bearer ${
          openAIKey || localStorage.getItem('OPENAI_KEY') || ''
        }`,
      },
    });
    const allModels: { id: string }[] = res?.data?.data || [];
    return allModels
      .filter((item) => item.id.startsWith('gpt-'))
      .map((item) => item.id);
  } catch (error) {
    console.error(error);
    return [];
  }
};
