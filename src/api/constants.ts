export enum OpenAIModel {
  'gpt-3.5-turbo' = 'gpt-3.5-turbo',
  'gpt-3.5-turbo-0613' = 'gpt-3.5-turbo-0613',
  'gpt-3.5-turbo-0301' = 'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo-16k' = 'gpt-3.5-turbo-16k',
  'gpt-3.5-turbo-16k-0613' = 'gpt-3.5-turbo-16k-0613',
  'gpt-4' = 'gpt-4',
  'gpt-4-0613' = 'gpt-4-0613',
  'gpt-4-0314' = 'gpt-4-0314',
}

export const defaultModel = OpenAIModel['gpt-3.5-turbo-16k'];

export const defaultBotInstruction = 'You are a helpful AI assistant.';

export const mandatoryInstruction = `\nPlease always use markdown format.
If you write a code, please tell us the language code.`;
