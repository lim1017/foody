import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import useCurrentLocation from "@/utils/hooks/useCurrentLocation";
import InformationWindow from "./InformationWindow";
import { PersonalMarker } from "./PersonalMarker";

const lib = ["places"];

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

  const handleActiveMarker = (placeId: number) => {
    if (placeId === activeMarker) {
      setActiveMarker(null);
    } else {
      setActiveMarker(placeId);
    }
  };

  const openInGoogleMaps = ({
    name,
    address,
    lat,
    lng,
  }: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => {
    console.log({ name, address });
    const mapsQuery = name
      ? encodeURIComponent(name)
      : address
      ? encodeURIComponent(address)
      : `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mapsQuery}`;

    // Open in a new tab
    window.open(url, "_blank");
  };

  const onMapLoad = () => {};
  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setMapOptions({
        streetViewControl: false,
        mapTypeControl: !mobile,
        zoomControl: false,
        fullscreenControl: !isMobile,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <LoadScript
      lib={lib}
      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""}
    >
      <GoogleMap
        onLoad={onMapLoad}
        clickableIcons={false}
        onClick={() => setActiveMarker(null)}
        mapContainerStyle={containerStyle}
        options={mapOptions}
        center={currentLocation}
        zoom={12}
      >
        <PersonalMarker currentLocation={currentLocation} />
        {mapMarkers.map((video) => {
          return video.locations.map((marker) => {
            console.log(marker, "marker");
            const lat = marker.geolocation.geometry.location.lat;
            const lng = marker.geolocation.geometry.location.lng;
            return (
              <Marker
                key={marker.place_id}
                onClick={(e) => handleActiveMarker(marker.geolocation.place_id)}
                clickable={true}
                position={{ lat, lng }}
              >
                {activeMarker === marker.geolocation.place_id && (
                  <InformationWindow
                    marker={marker}
                    videoId={video.videoId}
                    thumbnail={video.thumbnail}
                    handleDirections={openInGoogleMaps}
                  />
                )}
              </Marker>
            );
          });
        })}
      </GoogleMap>
    </LoadScript>
  );
};

export default Map;
