import React, { useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Box,
} from '@mui/material';

const Filters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistance, setSelectedDistance] = useState('');

  const states = ['Uttar Pradesh', 'Maharashtra', 'Bihar', 'Delhi', 'Karnataka'];
  const distances = [50, 100, 150, 200, 300, 500, 1000];

  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        borderRadius: 2,
        backgroundColor: '#f9fafb',
      }}
    >
      <Grid container spacing={2} alignItems="center">
        {/* Search Field */}
        <Grid item xs={12} md={4}>
          <TextField
            size="small"
            fullWidth
            label="Search Developer"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Grid>

        {/* State Dropdown */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="state-select-label">Select State</InputLabel>
            <Select
              labelId="state-select-label"
              value={selectedState}
              label="Select State"
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {states.map((state) => (
                <MenuItem key={state} value={state}>
                  {state}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* Distance Dropdown */}
        <Grid item xs={12} md={4}>
          <FormControl fullWidth size="small">
            <InputLabel id="distance-select-label">Select Distance</InputLabel>
            <Select
              labelId="distance-select-label"
              value={selectedDistance}
              label="Select Distance"
              onChange={(e) => setSelectedDistance(e.target.value)}
            >
              {distances.map((distance) => (
                <MenuItem key={distance} value={distance}>
                  {distance} meters
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Filters;
