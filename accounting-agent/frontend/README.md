# מערכת הנהלת חשבונות - Frontend

פרויקט Frontend למערכת הנהלת החשבונות, בנוי עם React, TypeScript ו-Material-UI.

## דרישות מערכת

- Node.js 16 או גבוה יותר
- npm 7 או גבוה יותר

## התקנה

1. התקן את התלויות:

```bash
npm install
```

2. הפעל את שרת הפיתוח:

```bash
npm start
```

האפליקציה תופעל אוטומטית בדפדפן בכתובת [http://localhost:3000](http://localhost:3000)

## סקריפטים זמינים

- `npm start` - מפעיל את האפליקציה במצב פיתוח
- `npm test` - מריץ את בדיקות ה-Jest
- `npm run build` - בונה את האפליקציה לפרודקשן
- `npm run lint` - מריץ את ה-ESLint

## מבנה התיקיות

- `/public` - קבצים סטטיים
- `/src` - קוד המקור של האפליקציה
  - `/api` - שירותי API
  - `/components` - קומפוננטות משותפות
  - `/contexts` - React contexts
  - `/pages` - קומפוננטות עמודים
  - `/types` - הגדרות TypeScript

## סביבות

- פיתוח: `http://localhost:3000`
- בדיקות: `npm test`
- פרודקשן: `npm run build`

## רישיון

פרויקט זה מורשה תחת הרישיון MIT.
