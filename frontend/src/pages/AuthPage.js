import React, { useState } from 'react';
import { Box, Tabs, Tab, Paper, styled } from '@mui/material';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

const AuthContainer = styled(Paper)(({ theme }) => ({
  maxWidth: 500,
  margin: 'auto',
  marginTop: theme.spacing(8),
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius * 2,
}));

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <AuthContainer elevation={3}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} centered>
          <Tab label="Login" />
          <Tab label="Sign Up" />
        </Tabs>
      </Box>
      <Box mt={3}>
        {activeTab === 0 ? <Login /> : <Signup />}
      </Box>
    </AuthContainer>
  );
};

export default AuthPage;