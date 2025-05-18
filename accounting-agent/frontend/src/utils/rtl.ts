import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

// יצירת קונפיגורציית קאש לתמיכה ב-RTL
export const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

// יצירת קונפיגורציית קאש לתמיכה ב-LTR
export const cacheLtr = createCache({
  key: 'muiltr',
  stylisPlugins: [prefixer],
});

/**
 * פונקציה המחזירה את הקאש המתאים לכיוון השפה
 * @param dir כיוון השפה (rtl או ltr)
 * @returns קאש מתאים
 */
export const getDirectionCache = (dir: 'rtl' | 'ltr') => {
  return dir === 'rtl' ? cacheRtl : cacheLtr;
};

/**
 * פונקציה המחזירה את כיוון השפה לפי קוד השפה
 * @param lang קוד השפה
 * @returns כיוון השפה
 */
export const getLanguageDirection = (lang: string): 'rtl' | 'ltr' => {
  const rtlLanguages = ['he', 'ar', 'fa', 'ur'];
  return rtlLanguages.includes(lang) ? 'rtl' : 'ltr';
};

/**
 * פונקציה המחזירה את הפונט המתאים לשפה
 * @param lang קוד השפה
 * @returns שם הפונט
 */
export const getLanguageFont = (lang: string): string => {
  switch (lang) {
    case 'he':
      return [
        'Heebo',
        'Assistant',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(',');
    default:
      return [
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(',');
  }
};

/**
 * פונקציה המחזירה את פורמט התאריך המתאים לשפה
 * @param lang קוד השפה
 * @returns פורמט תאריך
 */
export const getDateFormat = (lang: string): string => {
  switch (lang) {
    case 'he':
      return 'dd/MM/yyyy';
    default:
      return 'MM/dd/yyyy';
  }
};

/**
 * פונקציה המחזירה את פורמט המספרים המתאים לשפה
 * @param lang קוד השפה
 * @returns פורמט מספרים
 */
export const getNumberFormat = (lang: string): Intl.NumberFormatOptions => {
  switch (lang) {
    case 'he':
      return {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
    default:
      return {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      };
  }
};

/**
 * פונקציה המחזירה את סמל המטבע המתאים לשפה
 * @param lang קוד השפה
 * @returns סמל מטבע
 */
export const getCurrencySymbol = (lang: string): string => {
  switch (lang) {
    case 'he':
      return '₪';
    default:
      return '$';
  }
};
