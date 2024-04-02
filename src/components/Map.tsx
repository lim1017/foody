import React, { useEffect, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import useCurrentLocation from "@/utils/hooks/useCurrentLocation";

interface MapProps {}

const containerStyle = {
  width: "100%", // or a specific width like '400px'
  height: "100%",
};

const defaultCenter = {
  lat: -34.397,
  lng: 150.644,
};

const markers = [
  { id: 1, name: "home", lat: 43.76394, lng: -79.26897 },
  { id: 2, name: "store1", lat: 43.81812, lng: -79.1016 },
  { id: 3, name: "store2", lat: 43.71435, lng: -79.35466 },
];

const Map: React.FC<MapProps> = () => {
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
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            onClick={(e) => handleActiveMarker(marker.id)}
            clickable={true}
            position={{ lat: marker.lat, lng: marker.lng }}
          >
            {activeMarker === marker.id && (
              <InfoWindow position={{ lat: marker.lat, lng: -79.26897 }}>
                <div>{marker.name}</div>
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
