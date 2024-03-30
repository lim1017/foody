// components/Map.tsx
import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript } from "@react-google-maps/api";

// Define types for the component props if needed
// For now, we don't have specific props, so we'll just use an empty interface
interface MapProps {}

// Define the style and initial center position for the map
const containerStyle = {
  width: "100%", // or a specific width like '400px'
  height: "100%",
};

const center = {
  lat: -34.397,
  lng: 150.644,
};

const Map: React.FC<MapProps> = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({
    streetViewControl: !isMobile,
    mapTypeControl: !isMobile,
    zoomControl: !isMobile,
    fullscreenControl: !isMobile,
  });

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setMapOptions({
        streetViewControl: !mobile,
        mapTypeControl: !mobile,
        zoomControl: !mobile,
        fullscreenControl: !isMobile,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <LoadScript
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        options={mapOptions}
        center={center}
        zoom={10}
      >
        {/* Child components like markers can go here */}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
