import { captureException } from '@sentry/react';
import ReactGA from 'react-ga4';

export const DBVersion = 10;

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
        {
          name: 'allContents',
          keypath: 'allContents',
          options: { unique: false },
        },
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

export const upgradeDB = () => {
  const indexedDBName = DBConfig.name;
  const indexedDBVersion = DBConfig.version;

  // Open the connection to IndexedDB
  const request = window.indexedDB.open(indexedDBName, indexedDBVersion);

  // Handle errors when connecting to IndexedDB
  request.onerror = function (event: any) {
    captureException('IndexedDB error:', event.target.error);
  };

  // Handle upgrades needed when opening a connection to IndexedDB
  request.onupgradeneeded = function (event: any) {
    const indexedDB = event.target.result;

    // Check if there was a version change to handle a potential version error
    if (event.oldVersion < indexedDBVersion) {
      // Close the current IndexedDB connection
      indexedDB.close();

      // Open a new connection with the correct version number
      const newRequest = window.indexedDB.open(indexedDBName, indexedDBVersion);

      // Handle errors when opening the new IndexedDB connection
      newRequest.onerror = function (event: any) {
        captureException('IndexedDB error:', event.target.error);
      };

      // Handle success when opening the new IndexedDB connection
      newRequest.onsuccess = function () {
        ReactGA.event({
          action: 'The upgrade to IndexedDB version was successful.',
          category: 'System',
        });
      };
    }
  };
};
