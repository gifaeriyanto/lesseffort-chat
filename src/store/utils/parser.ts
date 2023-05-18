import { Message } from 'api/chat';
import { modifyTemplate } from 'store/openai';

export const mapMessage = (message: Message) => {
  return {
    content: message.template
      ? modifyTemplate(message.content, message.template)
      : message.content,
    role: message.role,
  };
};
