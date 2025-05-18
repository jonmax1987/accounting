import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // שימוש ב-backend לטעינת קבצי תרגום
  .use(Backend)
  // זיהוי שפת הדפדפן
  .use(LanguageDetector)
  // חיבור ל-react
  .use(initReactI18next)
  // אתחול i18next
  .init({
    fallbackLng: 'he',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // לא צריך escape עם React
    },
    
    // שפות נתמכות
    supportedLngs: ['he', 'en'],
    
    // ברירת מחדל
    ns: ['common', 'validation', 'errors'],
    defaultNS: 'common',
    
    // כיוון שפה
    dir: {
      he: 'rtl',
      en: 'ltr',
    },
    
    // זיהוי שפה
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
    
    // תרגומים בסיסיים (יטענו מיידית)
    resources: {
      he: {
        common: {
          dashboard: 'לוח בקרה',
          clients: 'לקוחות',
          invoices: 'חשבוניות',
          reports: 'דוחות',
          settings: 'הגדרות',
          darkMode: 'מצב כהה',
          lightMode: 'מצב בהיר',
          add: 'הוסף',
          edit: 'ערוך',
          delete: 'מחק',
          save: 'שמור',
          cancel: 'ביטול',
          search: 'חיפוש',
          filter: 'סינון',
          export: 'ייצוא',
          print: 'הדפסה',
          total: 'סה"כ',
          name: 'שם',
          date: 'תאריך',
          amount: 'סכום',
          balance: 'יתרה',
          actions: 'פעולות',
          noData: 'אין נתונים להצגה',
          loading: 'טוען...',
          error: 'שגיאה',
          success: 'הצלחה',
          warning: 'אזהרה',
          info: 'מידע',
        },
        validation: {
          required: 'שדה חובה',
          invalidEmail: 'כתובת אימייל לא תקינה',
          minLength: 'אורך מינימלי: {{length}} תווים',
          maxLength: 'אורך מקסימלי: {{length}} תווים',
          passwordMismatch: 'הסיסמאות אינן תואמות',
          invalidNumber: 'מספר לא תקין',
        },
        errors: {
          general: 'אירעה שגיאה. אנא נסה שוב מאוחר יותר.',
          network: 'שגיאת תקשורת. אנא בדוק את החיבור לאינטרנט.',
          notFound: 'המשאב המבוקש לא נמצא.',
          unauthorized: 'אין לך הרשאה לבצע פעולה זו.',
          forbidden: 'הגישה נדחתה.',
          validation: 'אנא תקן את השגיאות בטופס.',
        },
      },
      en: {
        common: {
          dashboard: 'Dashboard',
          clients: 'Clients',
          invoices: 'Invoices',
          reports: 'Reports',
          settings: 'Settings',
          darkMode: 'Dark Mode',
          lightMode: 'Light Mode',
          add: 'Add',
          edit: 'Edit',
          delete: 'Delete',
          save: 'Save',
          cancel: 'Cancel',
          search: 'Search',
          filter: 'Filter',
          export: 'Export',
          print: 'Print',
          total: 'Total',
          name: 'Name',
          date: 'Date',
          amount: 'Amount',
          balance: 'Balance',
          actions: 'Actions',
          noData: 'No data to display',
          loading: 'Loading...',
          error: 'Error',
          success: 'Success',
          warning: 'Warning',
          info: 'Info',
        },
        validation: {
          required: 'Required field',
          invalidEmail: 'Invalid email address',
          minLength: 'Minimum length: {{length}} characters',
          maxLength: 'Maximum length: {{length}} characters',
          passwordMismatch: 'Passwords do not match',
          invalidNumber: 'Invalid number',
        },
        errors: {
          general: 'An error occurred. Please try again later.',
          network: 'Network error. Please check your internet connection.',
          notFound: 'The requested resource was not found.',
          unauthorized: 'You are not authorized to perform this action.',
          forbidden: 'Access denied.',
          validation: 'Please fix the errors in the form.',
        },
      },
    },
  });

export default i18n;
