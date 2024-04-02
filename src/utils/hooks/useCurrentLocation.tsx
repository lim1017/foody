import { useEffect, useState } from "react";

const useCurrentLocation = (defaultCenter: { lat: number; lng: number }) => {
  const [currentLocation, setCurrentLocation] = useState(defaultCenter);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting the geolocation: ", error);
        }
      );
    }
  }, []);

  return { currentLocation };
};

export default useCurrentLocation;
