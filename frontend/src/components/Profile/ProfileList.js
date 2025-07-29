import React from 'react';
import { Box, Typography } from '@mui/material';
import DeveloperCard from './DeveloperCard';

const ProfileList = ({ developers }) => {
  return (
    <Box sx={{ overflowY: 'auto', flex: 1 }}>
      {developers?.length === 0 ? (
        <Box textAlign="center" mt={4}>
          <Typography variant="body1">
            No developers found in this area. Try increasing the search radius.
          </Typography>
        </Box>
      ) : (
        developers?.map((developer) => (
          <DeveloperCard key={developer?._id} developer={developer} />
        ))
      )}
    </Box>
  );
};

export default ProfileList;