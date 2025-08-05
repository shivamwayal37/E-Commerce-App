import React, { ReactNode } from 'react';
import { Box, Container, Paper, Typography } from '@mui/material';

interface AuthPageLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ 
  children, 
  title = 'Welcome to E-Commerce' 
}) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            {title}
          </Typography>
          {children}
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthPageLayout;
