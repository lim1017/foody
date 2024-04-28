import { CiPizza } from "react-icons/ci";
import { GiDumplingBao } from "react-icons/gi";
import { TopNavItem } from "../TopNav";
import { useState } from "react";
import { IconType } from "react-icons";
import { fetchFoodyData } from "@/utils/api/api";
import { IoFastFoodOutline } from "react-icons/io5";

type FoodiesItem = {
  label: string;
  icon: IconType;
  handle: string;
};

const foodiesItems = [
  {
    label: "Bar Stool Pizza",
    icon: CiPizza,
    handle: "BarStoolPizza",
  },
  { label: "Mark Chen", icon: GiDumplingBao, handle: "StrictlyDumping" },
  {
    label: "Phil's Food Review",
    icon: IoFastFoodOutline,
    handle: "PhilsFoodReview",
  },
  {
    label: "Traveling Foodie",
    icon: IoFastFoodOutline,
    handle: "TravelingFoodie",
  },
];

const FoodyModalContent = ({ setMapMarkers }: any) => {
  const [activeFoodie, setActiveFoodie] = useState("");

  const handleSelectFoody = async (item: FoodiesItem) => {
    setActiveFoodie(item.label);
    const res = await fetchFoodyData(item.handle);
    //TODO duplicate markers are being created with no score when the reviewers mention them. need to filter them out
    setMapMarkers(res.data);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Follow Your Favorite Foodies</h1>
      <div className="flex flex-wrap justify-between">
        {foodiesItems.map((item) => (
          <div key={item.label} className="p-4 w-1/3 lg:flex-grow">
            <TopNavItem
              onClick={() => handleSelectFoody(item)}
              Icon={item.icon}
              label={item.label}
              isActive={activeFoodie === item.label}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodyModalContent;
