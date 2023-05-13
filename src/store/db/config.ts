export const DBConfig = {
  name: 'effortlesschat',
  version: 2,
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
          name: 'bot_id',
          keypath: 'bot_id',
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
        {
          name: 'role',
          keypath: 'role',
          options: { unique: false },
        },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    },
    {
      store: 'bot',
      storeConfig: { keyPath: 'id', autoIncrement: true },
      storeSchema: [
        { name: 'name', keypath: 'name', options: { unique: true } },
        {
          name: 'instruction',
          keypath: 'instruction',
          options: { unique: false },
        },
      ],
    },
  ],
};
