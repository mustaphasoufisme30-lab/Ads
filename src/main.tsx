import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { NextIntlClientProvider } from './i18n/next-intl';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <NextIntlClientProvider>
    <App />
  </NextIntlClientProvider>
);
