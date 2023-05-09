import React from 'react';
import { createStandaloneToast } from '@chakra-ui/react';
import ReactDOM from 'react-dom/client';

import App from './App';
import reportWebVitals from './reportWebVitals';

const { ToastContainer, toast } = createStandaloneToast({
  defaultOptions: {
    position: 'bottom-right',
    containerStyle: {
      p: '1rem',
    },
    duration: 5000,
    isClosable: true,
  },
});

export const standaloneToast = toast;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ToastContainer />
    <App />
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
