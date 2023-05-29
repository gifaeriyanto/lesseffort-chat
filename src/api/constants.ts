export enum OpenAIModel {
  GPT_3_5 = 'gpt-3.5-turbo',
  GPT_3_5_LEGACY = 'gpt-3.5-turbo-0301',
  GPT_4 = 'gpt-4',
}

export const defaultBotInstruction = 'You are a helpful AI assistant.';

export const mandatoryInstruction = `\nPlease always use markdown format.
If you write a code, please tell us the language code.`;
