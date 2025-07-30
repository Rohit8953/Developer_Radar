import React, { useEffect, useState } from 'react';
import { useAuth } from '../../services/auth';
import { Button, TextField, Typography, Box, Link, CircularProgress } from '@mui/material';

const Login = () => {
  const { login, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: 'tsha4rlal@gmail.com',
    password: '123456789',
  });
  const [userLocation, setUserLocation] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 // Get user's current coordinates
  const getUserCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { latitude, longitude };
          setUserLocation(newLocation);
        },
        (error) => {
          console.error('Geolocation error:', error.message);
          setUserLocation(null); // Optional fallback
        }
      );
    } else {
      console.warn('Geolocation is not supported by this browser.');
    }
  };

  useEffect(() => {
    getUserCoordinates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      location: userLocation, // include location in login data
    };

    console.log("Logging in with payload:", payload);

    await login(payload); // Make sure your login function handles `location` in the backend
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <TextField
        fullWidth
        margin="normal"
        label="Password"
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
      />
      {error && (
        <Typography color="error" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
      <Button
        fullWidth
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        sx={{ mt: 3 }}
        disabled={loading || userLocation === null }
      >
        {loading ? <CircularProgress size={24} /> : 'Login'}
      </Button>
      <Box mt={2} textAlign="center">
        <Link href="#" variant="body2">
          Forgot password?
        </Link>
      </Box>
    </Box>
  );
};

export default Login;