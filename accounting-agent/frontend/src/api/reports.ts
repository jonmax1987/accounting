import apiClient from './client';
import { Client } from './clients';

export interface ReportData {
  totalClients: number;
  totalInvoices: number;
  totalBalance: number;
  totalRevenue: number;
  clientsData?: Client[];
}

export interface BalanceReportItem {
  clientName: string;
  balance: number;
}

export interface RevenueReportItem {
  period: string;
  amount: number;
}

export const getClientsReport = async (): Promise<ReportData> => {
  try {
    const response = await apiClient.get('/report/clients');
    return response.data;
  } catch (error) {
    console.error('Error fetching clients report:', error);
    // החזר נתונים לדוגמה כאשר השרת לא זמין
    return {
      totalClients: 5,
      totalInvoices: 12,
      totalBalance: 25000,
      totalRevenue: 75000,
      clientsData: [
        { id: 1, name: 'לקוח לדוגמה 1', balance: 5000 },
        { id: 2, name: 'לקוח לדוגמה 2', balance: 8000 },
        { id: 3, name: 'לקוח לדוגמה 3', balance: 3000 },
        { id: 4, name: 'לקוח לדוגמה 4', balance: 6000 },
        { id: 5, name: 'לקוח לדוגמה 5', balance: 3000 },
      ],
    };
  }
};

export const getBalanceReport = async (): Promise<BalanceReportItem[]> => {
  try {
    // שינוי הנתיב מ-'/report/balances' ל-'/report/balance' כדי להתאים לשרת
    const response = await apiClient.get('/report/balance');
    return response.data;
  } catch (error) {
    console.error('Error fetching balance report:', error);
    // החזר נתונים לדוגמה כאשר השרת לא זמין
    return [
      { clientName: 'לקוח לדוגמה 1', balance: 5000 },
      { clientName: 'לקוח לדוגמה 2', balance: 8000 },
      { clientName: 'לקוח לדוגמה 3', balance: 3000 },
      { clientName: 'לקוח לדוגמה 4', balance: 10000 },
      { clientName: 'לקוח לדוגמה 5', balance: 7000 },
    ];
  }
};

export const getRevenueReport = async (
  period: 'month' | 'quarter' | 'year' | 'custom' = 'month',
  startDate?: string,
  endDate?: string
): Promise<RevenueReportItem[]> => {
  try {
    // שינוי הנתיב מ-'/report/revenue' ל-'/report/revenues' כדי להתאים לשרת
    let url = `/report/revenues?period=${period}`;
    
    if (period === 'custom' && startDate && endDate) {
      url += `&startDate=${startDate}&endDate=${endDate}`;
    }
    
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching revenue report:', error);
    // החזר נתונים לדוגמה כאשר השרת לא זמין
    if (period === 'month') {
      return [
        { period: 'ינואר', amount: 5000 },
        { period: 'פברואר', amount: 7500 },
        { period: 'מרץ', amount: 8000 },
        { period: 'אפריל', amount: 6000 },
        { period: 'מאי', amount: 9000 },
        { period: 'יוני', amount: 8500 },
        { period: 'יולי', amount: 7000 },
        { period: 'אוגוסט', amount: 8200 },
        { period: 'ספטמבר', amount: 9500 },
        { period: 'אוקטובר', amount: 10000 },
        { period: 'נובמבר', amount: 11000 },
        { period: 'דצמבר', amount: 12000 },
      ];
    } else if (period === 'quarter') {
      return [
        { period: 'Q1', amount: 20500 },
        { period: 'Q2', amount: 23500 },
        { period: 'Q3', amount: 24700 },
        { period: 'Q4', amount: 33000 },
      ];
    } else {
      return [
        { period: '2023', amount: 50000 },
        { period: '2024', amount: 75000 },
        { period: '2025', amount: 101700 },
      ];
    }
  }
};

export const getHtmlReport = async (): Promise<string> => {
  try {
    const response = await apiClient.get('/report/html', {
      headers: {
        Accept: 'text/html',
      },
      responseType: 'text',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML report:', error);
    return '<div>דוח לדוגמה</div>';
  }
};

export const exportReportToPdf = async (reportType: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/report/export/${reportType}`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting PDF report:', error);
    return new Blob([''], { type: 'application/pdf' });
  }
};

export const exportReportToExcel = async (reportType: string): Promise<Blob> => {
  try {
    const response = await apiClient.get(`/report/export/${reportType}?format=excel`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Error exporting Excel report:', error);
    return new Blob([''], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }
};
