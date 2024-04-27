import { Marker } from "@react-google-maps/api";

const iconOptions = {
  url: "https://i.imgur.com/zYUGUUB.png",
  scaledSize: new window.google.maps.Size(40, 40),
};

export const PersonalMarker = ({
  currentLocation,
}: {
  currentLocation: { lat: number; lng: number };
}) => {
  return <Marker position={currentLocation} icon={iconOptions} />;
};
