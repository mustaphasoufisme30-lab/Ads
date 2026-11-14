import {createRoot, hydrateRoot} from 'react-dom/client';
import App from './App.tsx';
import { NextIntlClientProvider } from './i18n/next-intl';
import './index.css';

const rootEl = document.getElementById('root')!;
let savedLocale: string | null = null;
let savedTheme: string | null = null;
try {
  savedLocale = localStorage.getItem('techialab_locale');
  savedTheme = localStorage.getItem('techialab_theme');
} catch {
  // Ignore storage access errors
}

const isSsr = rootEl.getAttribute('data-ssr') === 'true';
const canHydrate = isSsr && savedLocale !== 'fr' && savedTheme !== 'dark';

if (canHydrate) {
  hydrateRoot(
    rootEl,
    <NextIntlClientProvider>
      <App />
    </NextIntlClientProvider>
  );
} else {
  createRoot(rootEl).render(
    <NextIntlClientProvider>
      <App />
    </NextIntlClientProvider>
  );
}
