import { Message } from 'api/chat';

export const mapMessage = (message: Message) => {
  return {
    content: message.content,
    role: message.role,
  };
};
