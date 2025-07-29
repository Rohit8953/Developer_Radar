import React from 'react';
import { Box, Button, Container, Typography, Paper, Grid, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CustomAppBar from '../components/Layout/AppBar';

const HomePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <CustomAppBar />
      <Container maxWidth="lg" sx={{ py: 6, flex: 1 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Connect with Developers Near You
            </Typography>
            <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, color: 'text.secondary' }}>
              Find and collaborate with tech professionals in your area
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/auth')}
                sx={{ px: 4 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/dashboard')}
                sx={{ px: 4 }}
              >
                Demo Preview
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 4 }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                alt="Developers collaborating"
                sx={{
                  width: '100%',
                  borderRadius: 3,
                  boxShadow: theme.shadows[4],
                }}
              />
            </Paper>
          </Grid>
        </Grid>

        {/* Features Section */}
        <Box sx={{ mt: 12, textAlign: 'center' }}>
          <Typography variant="h4" component="h3" gutterBottom sx={{ fontWeight: 600 }}>
            How It Works
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            {[
              {
                title: 'Find Nearby',
                description: 'Discover developers within your selected radius',
                icon: '📍',
              },
              {
                title: 'Connect Easily',
                description: 'View profiles and reach out to potential collaborators',
                icon: '🤝',
              },
              {
                title: 'Collaborate',
                description: 'Work together on projects in your local area',
                icon: '👨‍💻',
              },
            ].map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Paper elevation={2} sx={{ p: 3, height: '100%', borderRadius: 3 }}>
                  <Typography variant="h3" sx={{ mb: 2 }}>
                    {feature.icon}
                  </Typography>
                  <Typography variant="h5" component="h4" gutterBottom sx={{ fontWeight: 500 }}>
                    {feature.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {feature.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', mt: 'auto' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Developer Locator. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default HomePage;