import { InfoWindow } from "@react-google-maps/api";
import "./Map.css";
import Image from "next/image";

const InformationWindow = ({ marker }) => {
  console.log(marker);
  const lat = marker.geometry.location.lat;
  const lng = marker.geometry.location.lng;

  return (
    <InfoWindow position={{ lat, lng }}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
        <img
          className="info-img"
          src={marker.thumbnail}
          alt={marker.restaurantName}
          onClick={() =>
            window.open(
              `https://www.youtube.com/watch?v=${marker.videoId}', '_blank`
            )
          }
        />

        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">{marker.restaurantName}</div>
          <p className="text-gray-700 text-base">{marker.address}</p>
        </div>

        <div className="px-6 pt-4 pb-2">
          <span className="inline-block bg-teal-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
            Score: {marker.score}
          </span>
        </div>
      </div>
    </InfoWindow>
  );
};

export default InformationWindow;