import {
  defaultBotInstruction,
  mandatoryInstruction,
  OpenAIModel,
} from 'api/constants';
import { Rules } from 'components/chat/rules';
import { ClientStreamChatCompletionConfig, OpenAIExt } from 'openai-ext';
import { mapMessage } from 'store/utils/parser';

export interface Chat {
  id?: number;
  bot_instruction: string;
  last_message: string;
  model: OpenAIModel;
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
  model: OpenAIModel,
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
