import { Client, Invoice } from '../api/clients';
import { saveAs } from 'file-saver';
import { exportReportToPdf, exportReportToExcel } from '../api/reports';

/**
 * ייצוא נתונים לקובץ CSV
 */
export const exportToCSV = (data: any[], fileName: string) => {
  // המרת נתונים לפורמט CSV
  const headers = Object.keys(data[0]);
  const csvRows = [];
  
  // כותרות העמודות
  csvRows.push(headers.join(','));
  
  // שורות הנתונים
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // טיפול במקרה של מחרוזת עם פסיקים
      return `"${value}"`;
    });
    csvRows.push(values.join(','));
  }
  
  // יצירת קובץ CSV
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `${fileName}.csv`);
};

/**
 * ייצוא לקוחות לקובץ CSV
 */
export const exportClientsToCSV = (clients: Client[]) => {
  const formattedData = clients.map(client => ({
    שם: client.name,
    יתרה: client.balance,
    מספר_חשבוניות: client.invoices?.length || 0
  }));
  
  exportToCSV(formattedData, 'לקוחות');
};

/**
 * ייצוא חשבוניות לקובץ CSV
 */
export const exportInvoicesToCSV = (invoices: Invoice[], clientsMap: Record<number, string>) => {
  const formattedData = invoices.map(invoice => ({
    לקוח: clientsMap[invoice.client_id || 0] || '',
    תאריך: new Date(invoice.date).toLocaleDateString('he-IL'),
    סכום: invoice.amount
  }));
  
  exportToCSV(formattedData, 'חשבוניות');
};

/**
 * ייצוא דוח לקובץ PDF
 */
export const exportToPdf = async (reportType: string) => {
  try {
    const pdfBlob = await exportReportToPdf(reportType);
    saveAs(pdfBlob, `דוח_${reportType}.pdf`);
    return true;
  } catch (error) {
    console.error('שגיאה בייצוא לקובץ PDF:', error);
    return false;
  }
};

/**
 * ייצוא דוח לקובץ Excel
 */
export const exportToExcel = async (reportType: string) => {
  try {
    const excelBlob = await exportReportToExcel(reportType);
    saveAs(excelBlob, `דוח_${reportType}.xlsx`);
    return true;
  } catch (error) {
    console.error('שגיאה בייצוא לקובץ Excel:', error);
    return false;
  }
};
