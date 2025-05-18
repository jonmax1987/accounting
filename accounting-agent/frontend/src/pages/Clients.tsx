import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from '../contexts/SnackbarContext';
import { getClients, createClient, updateClient, deleteClient, Client } from '../api/clients';

const Clients: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({ name: '', balance: 0 });
  const { showMessage } = useSnackbar();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: getClients,
  });

  // וודא שclients הוא מערך
  const clients = Array.isArray(data) ? data : [];

  const createMutation = useMutation({
    mutationFn: createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showMessage('לקוח נוצר בהצלחה', 'success');
      handleClose();
    },
    onError: () => {
      showMessage('שגיאה ביצירת לקוח', 'error');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, client }: { id: number; client: Partial<Client> }) => updateClient(id, client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showMessage('לקוח עודכן בהצלחה', 'success');
      handleClose();
    },
    onError: () => {
      showMessage('שגיאה בעדכון לקוח', 'error');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      showMessage('לקוח נמחק בהצלחה', 'success');
    },
    onError: () => {
      showMessage('שגיאה במחיקת לקוח', 'error');
    },
  });

  const handleOpen = (client: Client | null = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name, balance: client.balance });
    } else {
      setEditingClient(null);
      setFormData({ name: '', balance: 0 });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingClient(null);
    setFormData({ name: '', balance: 0 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id!, client: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleDelete = (id: number) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק לקוח זה?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
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
          ניהול לקוחות
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpen()}
        >
          הוסף לקוח חדש
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>שם</TableCell>
              <TableCell align="right">יתרה</TableCell>
              <TableCell align="right">פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell align="right">{client.balance.toLocaleString()} ₪</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(client)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(client.id!)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {clients.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  לא נמצאו לקוחות
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <form onSubmit={handleSubmit}>
          <DialogTitle>{editingClient ? 'ערוך לקוח' : 'הוסף לקוח חדש'}</DialogTitle>
          <DialogContent>
            <Box mt={2} mb={2}>
              <TextField
                fullWidth
                label="שם הלקוח"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                margin="normal"
              />
              <TextField
                fullWidth
                label="יתרה התחלתית"
                name="balance"
                type="number"
                value={formData.balance}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ step: '0.01' }}
              />
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
              ) : editingClient ? (
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

export default Clients;
