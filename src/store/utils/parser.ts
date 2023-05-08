import { Message } from 'api/chat';

export const mapMessage = (message: Message) => {
  return {
    content: message.content,
    role: message.role,
    timestamp: message.timestamp,
  };
};

export const filterByChatId = (id: number | undefined) => (message: Message) =>
  message.chatId === id;
