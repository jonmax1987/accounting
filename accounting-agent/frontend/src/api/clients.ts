import apiClient from './client';

export interface Client {
  id?: number;
  name: string;
  balance: number;
  invoices?: Invoice[];
}

export interface Invoice {
  id?: number;
  amount: number;
  date: string;
  client_id?: number;
}

export const getClients = async (): Promise<Client[]> => {
  try {
    const response = await apiClient.get('/report/clients');
    return response.data.clients || [];
  } catch (error) {
    console.error('Error fetching clients:', error);
    // החזר נתונים לדוגמה כאשר השרת לא זמין
    return [
      { id: 1, name: 'לקוח לדוגמה 1', balance: 1500 },
      { id: 2, name: 'לקוח לדוגמה 2', balance: 2500 },
      { id: 3, name: 'לקוח לדוגמה 3', balance: 3500 },
    ];
  }
};

export const getClient = async (id: number): Promise<Client> => {
  const response = await apiClient.get(`/clients/${id}`);
  return response.data;
};

export const createClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const response = await apiClient.post('/clients', client);
  return response.data;
};

export const updateClient = async (id: number, client: Partial<Client>): Promise<Client> => {
  const response = await apiClient.put(`/clients/${id}`, client);
  return response.data;
};

export const deleteClient = async (id: number): Promise<void> => {
  await apiClient.delete(`/clients/${id}`);
};

export const createInvoice = async (clientId: number, invoice: Omit<Invoice, 'id' | 'client_id'>): Promise<Invoice> => {
  const response = await apiClient.post(`/clients/${clientId}/invoices`, invoice);
  return response.data;
};

export const getClientInvoices = async (clientId: number): Promise<Invoice[]> => {
  const response = await apiClient.get(`/clients/${clientId}/invoices`);
  return response.data;
};
