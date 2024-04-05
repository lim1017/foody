import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import useCurrentLocation from "@/utils/hooks/useCurrentLocation";
import InformationWindow from "./InformationWindow";

interface MapProps {
  mapMarkers: any[];
}

const containerStyle = {
  width: "100%", // or a specific width like '400px'
  height: "100%",
};

const defaultCenter = {
  lat: -34.397,
  lng: 150.644,
};

const Map: React.FC<MapProps> = ({ mapMarkers }: MapProps) => {
  const [isMobile, setIsMobile] = useState(true);

  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>({
    streetViewControl: !isMobile,
    mapTypeControl: !isMobile,
    zoomControl: !isMobile,
    fullscreenControl: !isMobile,
  });

  const { currentLocation } = useCurrentLocation(defaultCenter);

  const handleActiveMarker = (markerId: number) => {
    if (markerId === activeMarker) {
      setActiveMarker(null);
    } else {
      setActiveMarker(markerId);
    }
  };

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

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
        center={currentLocation}
        zoom={12}
      >
        {mapMarkers.map((marker) => {
          const lat = marker.geometry.location.lat;
          const lng = marker.geometry.location.lng;
          return (
            <Marker
              key={marker.id}
              onClick={(e) => handleActiveMarker(marker.videoId)}
              clickable={true}
              position={{ lat, lng }}
            >
              {activeMarker === marker.videoId && (
                <InformationWindow marker={marker} />
              )}
            </Marker>
          );
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
