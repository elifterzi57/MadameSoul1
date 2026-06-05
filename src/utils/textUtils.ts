import { Language } from '../store/useAppStore';

/**
 * Converts a string to uppercase in a locale-sensitive manner.
 * Specifically handles Turkish 'tr' locale mapping ('i' -> 'İ', 'ı' -> 'I').
 */
export const convertToLocaleUppercase = (val: string, lang: Language): string => {
  const locale = lang === 'tr' ? 'tr-TR' : undefined;
  return val.toLocaleUpperCase(locale);
};
