import React from 'react';
import { Card, CardContent, Typography, Avatar, Chip, Box, Badge } from '@mui/material';

const DeveloperCard = ({ developer }) => {
  return (
    <Card sx={{ mb: 2, ':hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Badge
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            variant="dot"
            color={developer?.online ? 'success' : 'default'}
            sx={{
              '& .MuiBadge-badge': {
                right: 8,
                bottom: 8,
                height: 14,
                minWidth: 14,
                borderRadius: '50%',
                border: '2px solid white',
              },
            }}
          >
            <Avatar
              src={developer?.profilePicture}
              alt={developer?.name}
              sx={{ width: 56, height: 56, mr: 2 }}
            >
              {developer?.name.charAt(0)}
            </Avatar>
          </Badge>
          <Box>
            <Typography variant="h6">{developer?.name}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {developer?.jobtitle}
            </Typography>
            <Typography variant="caption" color={developer.online ? 'success.main' : 'text.secondary'}>
              {developer?.online ? 'Online' : 'Offline'}
            </Typography>
          </Box>
        </Box>
        <Box mb={2} sx={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <Typography variant="body2" color="text.secondary">
            {developer?.experience} years of experience
          </Typography>
          <Typography variant="body2" color="text.secondary">
           📍 {developer?.address} 
          </Typography>
        </Box>
        <Box>
          {developer?.skills?.slice(0, 4).map((skill) => (
            <Chip
              key={skill}
              label={skill}
              size="small"
              sx={{ mr: 1, mb: 1 }}
              color="primary"
              variant="outlined"
            />
          ))}
          {developer?.skills?.length > 4 && (
            <Chip
              label={`+${developer?.skills?.length - 4}`}
              size="small"
              sx={{ mb: 1 }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DeveloperCard;