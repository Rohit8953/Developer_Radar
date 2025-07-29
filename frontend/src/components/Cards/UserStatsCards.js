import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  Avatar,
  useTheme
} from '@mui/material';
import {
  People as PeopleIcon,
  Wifi as OnlineIcon,
  WifiOff as OfflineIcon,
  Public as CountryIcon
} from '@mui/icons-material';

const UserStatsCards = () => {
  const theme = useTheme();
  
  // Sample data - in a real app, this would come from an API or state
  const stats = [
    {
      title: 'Total Users',
      value: '1,254',
      icon: <PeopleIcon fontSize="large" />,
      color: theme.palette.primary.main,
      change: '+12% from last month'
    },
    {
      title: 'Online Users',
      value: '876',
      icon: <OnlineIcon fontSize="large" />,
      color: theme.palette.success.main,
      change: '+5% from yesterday'
    },
    {
      title: 'Offline Users',
      value: '378',
      icon: <OfflineIcon fontSize="large" />,
      color: theme.palette.error.main,
      change: '-3% from yesterday'
    },
    {
      title: 'Users from India',
      value: '542',
      icon: <CountryIcon fontSize="large" />,
      color: theme.palette.warning.main,
      change: '+8% from last month'
    }
  ];

  return (
    <Box sx={{ flexGrow: 1, px: 2 }}>
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card 
              sx={{ 
                height: '100%',
                boxShadow: 1,
                borderRadius: 2,
                // transition: 'transform 0.3s',
                // '&:hover': {
                //   transform: 'translateY(-5px)'
                // }
              }}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Avatar
                    sx={{
                      backgroundColor: stat.color + '20',
                      color: stat.color,
                      width: 56,
                      height: 56
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h5" fontWeight="bold">
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                  </Box>
                </Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: stat.change.startsWith('+') ? 
                      theme.palette.success.main : 
                      theme.palette.error.main,
                    display: 'flex',
                    alignItems: 'center',
                    mt: 1
                  }}
                >
                  {stat.change}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UserStatsCards;