export const DBVersion = 6;

export const DBConfig = {
  name: 'effortlesschat',
  version: DBVersion,
  objectStoresMeta: [
    {
      store: 'chatHistory',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'title', keypath: 'title', options: { unique: false } },
        {
          name: 'last_message',
          keypath: 'last_message',
          options: { unique: false },
        },
        { name: 'model', keypath: 'model', options: { unique: false } },
        {
          name: 'bot_instruction',
          keypath: 'bot_instruction',
          options: { unique: false },
        },
        { name: 'locked', keypath: 'locked', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    },
    {
      store: 'messages',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'chatId', keypath: 'chatId', options: { unique: false } },
        { name: 'content', keypath: 'content', options: { unique: false } },
        { name: 'role', keypath: 'role', options: { unique: false } },
        {
          name: 'originalContent',
          keypath: 'originalContent',
          options: { unique: false },
        },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    },
  ],
};
