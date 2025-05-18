import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSnackbar } from '../contexts/SnackbarContext';
import { getClients, Client, Invoice } from '../api/clients';
import { getInvoices, createInvoice, updateInvoice, deleteInvoice } from '../api/invoices';

type InvoiceWithClient = Invoice & {
  clientName: string;
};

const Invoices: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceWithClient | null>(null);
  const [formData, setFormData] = useState<Omit<Invoice, 'id'>>({ 
    client_id: 0, 
    amount: 0, 
    date: new Date().toISOString().split('T')[0] 
  });
  const { showMessage } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, isLoading: isLoadingClients } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // וודא שclients הוא מערך
  const clients = Array.isArray(data) ? data : [];

  const { data: invoicesData = [], isLoading, isError } = useQuery<InvoiceWithClient[]>({
    queryKey: ['invoices'],
    queryFn: async () => {
      try {
        // נסה להשתמש בפונקציית API ייעודית לחשבוניות
        const fetchedInvoices = await getInvoices();
        const allInvoices: InvoiceWithClient[] = [];
        
        // הוסף את שם הלקוח לכל חשבונית
        for (const invoice of fetchedInvoices) {
          const client = clients.find(c => c.id === invoice.client_id);
          allInvoices.push({
            ...invoice,
            clientName: client ? client.name : 'לקוח לא ידוע'
          });
        }
        
        return allInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      } catch (error) {
        console.error('Error fetching invoices:', error);
        
        // אם הייתה שגיאה, נסה להשתמש בנתונים מהלקוחות
        const allInvoices: InvoiceWithClient[] = [];
        for (const client of clients) {
          if (client.invoices) {
            client.invoices.forEach(invoice => {
              allInvoices.push({
                ...invoice,
                clientName: client.name
              });
            });
          }
        }
        return allInvoices.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      }
    },
    enabled: clients.length > 0
  });
  
  // וודא שinvoices הוא מערך
  const invoices = Array.isArray(invoicesData) ? invoicesData : [];

  const createMutation = useMutation({
    mutationFn: ({ clientId, invoice }: { clientId: number; invoice: Omit<Invoice, 'id' | 'client_id'> }) => {
      // נשתמש בפונקציית API ליצירת חשבונית
      return createInvoice(clientId, invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      showMessage('חשבונית נוצרה בהצלחה', 'success');
      handleClose();
    },
    onError: () => {
      showMessage('שגיאה ביצירת חשבונית', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, invoice }: { id: number; invoice: Partial<Invoice> }) => {
      // נשתמש בפונקציית API לעדכון חשבונית
      return updateInvoice(id, invoice);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      showMessage('חשבונית עודכנה בהצלחה', 'success');
      handleClose();
    },
    onError: () => {
      showMessage('שגיאה בעדכון חשבונית', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      // נשתמש בפונקציית API למחיקת חשבונית
      return deleteInvoice(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      showMessage('חשבונית נמחקה בהצלחה', 'success');
    },
    onError: () => {
      showMessage('שגיאה במחיקת חשבונית', 'error');
    },
  });

  const handleOpen = (invoice: InvoiceWithClient | null = null) => {
    if (invoice) {
      setEditingInvoice(invoice);
      setFormData({ 
        client_id: invoice.client_id || 0, 
        amount: invoice.amount, 
        date: invoice.date 
      });
    } else {
      setEditingInvoice(null);
      setFormData({ 
        client_id: 0, 
        amount: 0, 
        date: new Date().toISOString().split('T')[0] 
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingInvoice(null);
    setFormData({ 
      client_id: 0, 
      amount: 0, 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      updateMutation.mutate({ id: editingInvoice.id!, invoice: formData });
    } else {
      createMutation.mutate({ 
        clientId: formData.client_id!, 
        invoice: { 
          amount: formData.amount, 
          date: formData.date 
        } 
      });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    setFormData(prev => ({
      ...prev,
      client_id: e.target.value as number
    }));
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date: date.toISOString().split('T')[0]
      }));
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק חשבונית זו?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading || isLoadingClients) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error">
        אירעה שגיאה בטעינת הנתונים. אנא נסה שוב מאוחר יותר.
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          ניהול חשבוניות
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          הוסף חשבונית חדשה
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>לקוח</TableCell>
              <TableCell>תאריך</TableCell>
              <TableCell align="right">סכום</TableCell>
              <TableCell align="right">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{new Date(invoice.date).toLocaleDateString('he-IL')}</TableCell>
                <TableCell align="right">{invoice.amount.toLocaleString()} ₪</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(invoice)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(invoice.id!)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {invoices.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  לא נמצאו חשבוניות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingInvoice ? 'ערוך חשבונית' : 'הוסף חשבונית חדשה'}</DialogTitle>
          <DialogContent>
            <Box mt={2} mb={2}>
              <FormControl fullWidth margin="normal">
                <InputLabel id="client-select-label">לקוח</InputLabel>
                <Select
                  labelId="client-select-label"
                  id="client-select"
                  value={formData.client_id}
                  label="לקוח"
                  onChange={handleSelectChange}
                  disabled={!!editingInvoice}
                  required
                >
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="סכום"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ step: '0.01' }}
              />

              <Box mt={2}>
                <DatePicker
                  label="תאריך"
                  value={formData.date ? new Date(formData.date) : null}
                  onChange={handleDateChange}
                  slotProps={{ textField: { fullWidth: true, margin: 'normal' } }}
                />
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              ביטול
            </Button>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircularProgress size={24} />
              ) : editingInvoice ? (
                'עדכן'
              ) : (
                'הוסף'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Invoices;
