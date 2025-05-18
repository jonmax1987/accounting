import apiClient from './client';
import { Invoice } from './clients';

export const getInvoices = async (): Promise<Invoice[]> => {
  try {
    const response = await apiClient.get('/invoices');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching invoices:', error);
    // החזר נתונים לדוגמה כאשר השרת לא זמין
    return [
      { id: 1, amount: 1200, date: '2025-01-15', client_id: 1 },
      { id: 2, amount: 2500, date: '2025-02-20', client_id: 1 },
      { id: 3, amount: 3000, date: '2025-03-10', client_id: 2 },
      { id: 4, amount: 1800, date: '2025-04-05', client_id: 3 },
    ];
  }
};

export const getInvoice = async (id: number): Promise<Invoice> => {
  const response = await apiClient.get(`/invoices/${id}`);
  return response.data;
};

export const createInvoice = async (clientId: number, invoice: Omit<Invoice, 'id' | 'client_id'>): Promise<Invoice> => {
  const response = await apiClient.post(`/clients/${clientId}/invoices`, invoice);
  return response.data;
};

export const updateInvoice = async (id: number, invoice: Partial<Invoice>): Promise<Invoice> => {
  const response = await apiClient.put(`/invoices/${id}`, invoice);
  return response.data;
};

export const deleteInvoice = async (id: number): Promise<void> => {
  await apiClient.delete(`/invoices/${id}`);
};

export const getInvoicesByClient = async (clientId: number): Promise<Invoice[]> => {
  const response = await apiClient.get(`/clients/${clientId}/invoices`);
  return response.data;
};

export const getInvoicesByDateRange = async (startDate: string, endDate: string): Promise<Invoice[]> => {
  const response = await apiClient.get(`/invoices/range?start=${startDate}&end=${endDate}`);
  return response.data;
};
