import React from 'react';
import { Box, Button, Container, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home as HomeIcon } from '@mui/icons-material';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={3}
        sx={{
          p: 5,
          mt: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" color="primary" sx={{ fontSize: '8rem', fontWeight: 'bold' }}>
          404
        </Typography>
        
        <Typography variant="h4" gutterBottom>
          {t('notFoundTitle', 'הדף המבוקש לא נמצא')}
        </Typography>
        
        <Typography variant="body1" color="textSecondary" paragraph>
          {t(
            'notFoundDescription',
            'מצטערים, אך הדף שחיפשת אינו קיים. ייתכן שהכתובת שהזנת שגויה או שהדף הוסר.'
          )}
        </Typography>
        
        <Box mt={4}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<HomeIcon />}
            onClick={() => navigate('/')}
          >
            {t('backToHome', 'חזרה לדף הבית')}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NotFound;
