export enum OpenAIModel {
  GPT_3_5 = 'gpt-3.5-turbo-0613',
  GPT_3_5_16K = 'gpt-3.5-turbo-16k',
  GPT_3_5_LEGACY = 'gpt-3.5-turbo-0301',
  GPT_4 = 'gpt-4-0631',
  GPT_4_32K = 'gpt-4-32k',
}

export const defaultBotInstruction = 'You are a helpful AI assistant.';

export const mandatoryInstruction = `\nPlease always use markdown format.
If you write a code, please tell us the language code.`;
