export const DBVersion = 7;

export const DBConfig = {
  name: 'lesseffortchat',
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
        { name: 'limited', keypath: 'limited', options: { unique: false } },
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
          name: 'template',
          keypath: 'template',
          options: { unique: false },
        },
        { name: 'rules', keypath: 'rules', options: { unique: false } },
        { name: 'createdAt', keypath: 'createdAt', options: { unique: false } },
        { name: 'updatedAt', keypath: 'updatedAt', options: { unique: false } },
      ],
    },
  ],
};
