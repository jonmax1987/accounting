import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { getClients } from '../api/clients';
import CommandBox from '../components/CommandBox';

const Dashboard: React.FC = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['clients'],
    queryFn: getClients,
    refetchOnWindowFocus: true,
    staleTime: 10000, // 10 שניות
  });

  // וודא שclients הוא מערך
  const clients = Array.isArray(data) ? data : [];

  // Calculate dashboard metrics
  const totalClients = clients.length;
  const totalInvoices = clients.reduce((sum, client) => sum + (client.invoices?.length || 0), 0);
  const totalBalance = clients.reduce((sum, client) => sum + (client.balance || 0), 0);
  const totalRevenue = clients.reduce((sum, client) => 
    sum + (client.invoices?.reduce((invSum, invoice) => invSum + (invoice.amount || 0), 0) || 0),
    0
  );

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon,
    color = 'primary' 
  }: { 
    title: string; 
    value: string | number;
    icon: React.ElementType;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
  }) => (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography color="textSecondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {typeof value === 'number' && value.toLocaleString()}
              {typeof value === 'string' && value}
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: (theme) => theme.palette[color].light,
              color: (theme) => theme.palette[color].main,
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon fontSize="large" />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

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
      <Typography variant="h4" component="h1" gutterBottom>
        לוח בקרה
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title="סך כל הלקוחות" 
            value={totalClients} 
            icon={PeopleIcon} 
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={"סה\"כ חשבוניות"} 
            value={totalInvoices} 
            icon={ReceiptIcon} 
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={"סה\"כ יתרות"} 
            value={`${totalBalance.toLocaleString()} ₪`} 
            icon={AccountBalanceIcon} 
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard 
            title={"סה\"כ הכנסות"} 
            value={`${totalRevenue.toLocaleString()} ₪`} 
            icon={AttachMoneyIcon} 
            color="warning"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              מערכת פקודות חכמה
            </Typography>
            <Typography color="textSecondary" paragraph>
              הקלד פקודות בעברית כדי לבצע פעולות במערכת החשבונאות. לדוגמה: "הפק חשבונית על 500 ש"ח לדני", "מה היתרה של יוסי?", "הוסף לקוח חדש בשם משה"
            </Typography>
            <CommandBox onCommandExecuted={(result) => {
              console.log('Command executed:', result);
              // רענון הנתונים לאחר ביצוע פעולה
              if (result && !result.error) {
                setTimeout(() => refetch(), 1000);
              }
            }} />
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              לקוחות אחרונים
            </Typography>
            {clients.length > 0 ? (
              <Box>
                {clients.slice(0, 5).map((client) => (
                  <Box key={client.id} display="flex" justifyContent="space-between" mb={2}>
                    <Typography>{client.name}</Typography>
                    <Typography>{client.balance.toLocaleString()} ₪</Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography color="textSecondary">אין לקוחות להצגה</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              פעילות אחרונה
            </Typography>
            <Typography color="textSecondary">
              פונקציונליות זו תתווסף בגרסאות הבאות
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
