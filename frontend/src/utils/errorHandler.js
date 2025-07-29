export const handleLocationError = (error) => {
  switch(error.code) {
    case error.PERMISSION_DENIED:
      return "Location access denied";
    case error.POSITION_UNAVAILABLE:
      return "Location unavailable";
    case error.TIMEOUT:
      return "Location request timed out";
    default:
      return "Unknown location error";
  }
};