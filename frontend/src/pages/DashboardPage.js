import React, { useState, useEffect } from 'react';
import { Box, Container, Grid, Paper, Typography, Avatar, Chip } from '@mui/material';
import RadiusControl from '../components/Map/RadiusControl';
import ProfileList from '../components/Profile/ProfileList';
import { useAuth } from '../services/auth';
import DeveloperMap from '../components/Map/DeveloperMap';
import Filter from '../components/Filters/Filters'
import UserStatsCards from '../components/Cards/UserStatsCards';
const DashboardPage = () => {
  const { user, getAllUsers, usersData } = useAuth();
  const [developers, setDevelopers] = useState([]);
  const [radius, setRadius] = useState(1); // Default 1km radius
  const [userLocation, setUserLocation] = useState(null);


  useEffect(()=>{
    const getuserdata = async()=>{
       await getAllUsers()
    }
    getuserdata();
  }, []);
  
  // Convert GeoJSON coordinates to lat/lng object
  const getUserCoordinates = () => {
    if (!user?.location?.coordinates) return null;
    
    // GeoJSON format is [longitude, latitude]
    return {
      lng: user.location.coordinates[0],
      lat: user.location.coordinates[1]
    };
  };

  useEffect(() => {
    const currentUserLocation = getUserCoordinates();
    console.log("getcoordinates of current user", currentUserLocation)
    // Try to get user's current location if not available in profile
    if (navigator.geolocation && !currentUserLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newLocation = { lat: latitude, lng: longitude };
          setUserLocation(newLocation);
          filterDevelopers(latitude, longitude, radius);
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (currentUserLocation) {
            setUserLocation(currentUserLocation);
            filterDevelopers(currentUserLocation.lat, currentUserLocation.lng, radius);
          }
        }
      );
    } else if (currentUserLocation) {
      setUserLocation(currentUserLocation);
      filterDevelopers(currentUserLocation.lat, currentUserLocation.lng, radius);
    }
  }, [radius, user]);

  const filterDevelopers = (lat, lng, radiusKm) => {
    if (!lat || !lng) return;
    console.log("usr data:", usersData)
    const filtered = usersData
      ?.filter(dev => dev?._id !== user?._id) // Changed from id to _id
      ?.filter(dev => {
        if (!dev?.location?.coordinates) return false;
        const distance = calculateDistance(
          lat, 
          lng, 
          dev?.location?.coordinates[0], 
          dev?.location?.coordinates[1]
        );
        return distance <= radiusKm;
      })
      .map(dev => ({
  ...dev,
  distance: calculateDistance(
    lat, 
    lng, 
    dev.location.coordinates[1], // lat
    dev.location.coordinates[0]  // lng
  )
}))

    console.log("filtered data:", filtered);
    setDevelopers(filtered);
  };

  // Haversine formula remains the same
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return parseFloat((R * c).toFixed(1));
  };

  const handleRadiusChange = (newRadius) => {
    setRadius(newRadius);
  };

  if (!userLocation) {
    return (
      <Container maxWidth={false} sx={{ mt: 4, height: 'calc(100vh - 64px)' }}>
        <Typography variant="h6" align="center">
          Loading location data...
        </Typography>
      </Container>
    );
  }

  console.log("users data", developers)

  return (
    <Container maxWidth={false} sx={{ mt: 4, height: 'calc(100vh - 64px)' }}>
      <Grid container spacing={3} sx={{ height: '100%' }}>
       
         {/* <Card */}
           <UserStatsCards />
        {/* filter section */}
        <Grid item xs={12} md={12} sx={{ flexGrow: 1 }}>
             <Filter />
        </Grid>
        {/* Map Section */}
        <Grid item xs={12} md={9} sx={{ flexGrow: 1 }}>
          <Paper sx={{ p: 2, height: '100%', position: 'relative' }}>
            <DeveloperMap
              center={userLocation} 
              developers={developers} 
              radius={radius * 1000}
              currentUser={{
                ...user,
                location: {
                  lat: userLocation.lat,
                  lng: userLocation.lng
                }
              }}
              setDevelopers={setDevelopers}
            />
            <RadiusControl
              radius={radius} 
              onChange={handleRadiusChange} 
            />
          </Paper>
        </Grid>
         
        {/* Nearby Developers List */}
        <Grid item xs={12} md={3} sx={{ height: 'calc(100% - 100px)', overflow: 'hidden' }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Developers Nearby ({developers.length} within {radius} km)
            </Typography>
            <ProfileList developers={developers} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;