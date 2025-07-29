import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Box } from '@mui/material';
import useLocationTracker from '../../hooks/useLocationTracker';
import socket from '../../services/socket';

const defaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const currentUserIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DeveloperMap = ({ center, developers, radius, currentUser, setDevelopers }) => {
  console.log('Rendering DeveloperMap with center:', currentUser);
  
  useLocationTracker(); // Start tracking on mount

    useEffect(() => {
    // Listen for other users' updates
    socket.on('location-update', ({ userId, location }) => {
      setDevelopers(prev => prev.map(dev => 
        dev?._id === userId ? { ...dev, location } : dev
      ));
    });

    return () => {
      socket.off('location-update');
    };
  }, []);

  return (
    <Box sx={{ height: '100%', width: '100%' }}>
      <MapContainer
        center={[center?.lat, center?.lng]}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '4px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {/* Current User Marker */}
        {currentUser && (
          <Marker
            position={[currentUser?.location?.lat, currentUser?.location?.lng]}
            icon={currentUserIcon}
          >
            <Popup>
              <div>
                <strong>You ({currentUser?.name})</strong>
                <p>{currentUser?.title}</p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Search Radius Circle */}
        <Circle
          center={[center?.lat, center?.lng]}
          radius={radius}
          fillOpacity={0.1}
          color="#3f51b5"
        />
        
        {/* Nearby Developers */}
        {developers?.map((dev) => (
          <Marker
            key={dev?._id}
            position={[dev?.location?.coordinates[0], dev?.location?.coordinates[1]]}
            icon={defaultIcon}
          >
            <Popup>
              <div>
                <strong>{dev?.name}</strong>
                <p>{dev?.jobtitle}</p>
                <p>Distance: {dev?.distance} km</p>
                <p>Skills: {dev?.skills?.join(', ')}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default DeveloperMap;