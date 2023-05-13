import { Message } from 'react-hook-form';

export const getMessagesByChatID = (chatId: number): Promise<any> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('effortlesschat', 2);

    request.onsuccess = (event: any) => {
      const db = event.target.result;
      const transaction = db.transaction(['messages'], 'readonly');
      const objectStore = transaction.objectStore('messages');
      const chatIdIndex = objectStore.index('chatId');
      const chatIdRange = IDBKeyRange.only(chatId);
      const request = chatIdIndex.openCursor(chatIdRange);
      const messages: Message[] = [];

      request.onsuccess = (event: any) => {
        const cursor = event.target.result;
        if (cursor) {
          messages.push(cursor.value);
          cursor.continue();
        } else {
          resolve(messages);
        }
      };

      request.onerror = (event: any) => {
        reject(event.target.error);
      };
    };

    request.onerror = (event: any) => {
      reject(event.target.error);
    };
  });
};
