import React from 'react';
import { AppBar, Toolbar, Typography, Button, Avatar, Box } from '@mui/material';
import { useAuth } from '../../services/auth';
import { useNavigate } from 'react-router-dom';

const CustomAppBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <AppBar position="static" elevation={0}>
      <Toolbar>
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Developer Locator
        </Typography>
        {user ? (
          <Box display="flex" alignItems="center">
            <Avatar sx={{ mr: 1 }}>{user?.name?.charAt(0)}</Avatar>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Button color="inherit" onClick={() => navigate('/auth')}>
            Login
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default CustomAppBar;