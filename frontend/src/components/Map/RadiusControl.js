import React from 'react';
import { Box, Slider, Typography } from '@mui/material';

const RadiusControl = ({ radius, onChange }) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '8px 16px',
        borderRadius: '4px',
        boxShadow: 3,
        width: 200,
      }}
    >
      <Typography variant="subtitle2" gutterBottom>
        Search Radius: {radius} km
      </Typography>
      <Slider
        value={radius}
        onChange={(_, value) => onChange(value)}
        min={0.5}
        max={10000}
        step={0.5}
        valueLabelDisplay="auto"
        aria-labelledby="radius-slider"
      />
    </Box>
  );
};

export default RadiusControl;