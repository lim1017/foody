import { InfoWindow } from "@react-google-maps/api";
import "./Map.css";
import Button from "../Button";

const InformationWindow = ({
  marker,
  videoId,
  thumbnail,
  handleDirections,
}) => {
  const lat = marker.geolocation.geometry.location.lat;
  const lng = marker.geolocation.geometry.location.lng;

  return (
    <InfoWindow position={{ lat, lng }}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
        <img
          className="hover:cursor-pointer info-img"
          src={thumbnail}
          alt={marker.restaurantName}
          onClick={() =>
            window.open(`https://www.youtube.com/watch?v=${videoId}', '_blank`)
          }
        />

        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2 flex justify-between">
            {marker.restaurantName}
            <span className="inline-block bg-teal-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
              Score: {marker.score}
            </span>
          </div>
          <p className="text-gray-700 text-base">
            {marker.geolocation.formatted_address}
          </p>
        </div>
        <div className="px-6 pt-4 pb-2">
          <Button onClick={() => handleDirections(lat, lng)}>Directions</Button>
        </div>
      </div>
    </InfoWindow>
  );
};

export default InformationWindow;
