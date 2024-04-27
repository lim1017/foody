import { Marker } from "@react-google-maps/api";

export const PersonalMarker = ({
  currentLocation,
}: {
  currentLocation: { lat: number; lng: number };
}) => {
  // Check if window is available before accessing it
  const iconOptions =
    typeof window !== "undefined"
      ? {
          url: "https://i.imgur.com/zYUGUUB.png",
          scaledSize: new window.google.maps.Size(50, 50),
        }
      : {};

  return <Marker position={currentLocation} icon={iconOptions} />;
};
