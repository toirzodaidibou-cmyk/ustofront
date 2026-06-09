import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tg } from '../i18n/dictionaries/tg';
import { ru } from '../i18n/dictionaries/ru';
import { en } from '../i18n/dictionaries/en';

export type Language = 'tg' | 'ru' | 'en';

const dictionaries = {
  tg,
  ru,
  en,
};

interface LanguageState {
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string) => string;
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set, get) => ({
      currentLanguage: 'tg',
      setLanguage: (lang: Language) => set({ currentLanguage: lang }),
      t: (path: string) => {
        const lang = get().currentLanguage;
        const dict = dictionaries[lang] || dictionaries['tg'];
        
        const keys = path.split('.');
        let current: any = dict;
        
        for (const key of keys) {
          if (current && current[key] !== undefined) {
            current = current[key];
          } else {
            // Fallback to English, then to key path itself
            let fallbackDict: any = dictionaries['en'];
            let fallbackVal = fallbackDict;
            for (const fKey of keys) {
              if (fallbackVal && fallbackVal[fKey] !== undefined) {
                fallbackVal = fallbackVal[fKey];
              } else {
                fallbackVal = null;
                break;
              }
            }
            return fallbackVal || path;
          }
        }
        
        return typeof current === 'string' ? current : path;
      },
    }),
    {
      name: 'ustotj-language-storage',
    }
  )
);
