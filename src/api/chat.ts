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
  rules?: Rules;
  createdAt?: number;
  updatedAt?: number;
}

export enum OpenAIModel {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_LEGACY = 'gpt-3.5-turbo-0301',
  GPT_4 = 'gpt-4',
}

export const defaultBotInstruction = 'You are a helpful AI assistant.';

const mandatoryInstruction = `\nPlease always use markdown format.
If you write a code, please tell us the language code.`;

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
