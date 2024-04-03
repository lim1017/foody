import { CiPizza } from "react-icons/ci";
import { BiSushi } from "react-icons/bi";
import { TopNavItem } from "../TopNav";
import { useState } from "react";
import { IconType } from "react-icons";
import { fetchYoutubeData } from "@/utils/api/api";

type FoodiesItem = {
  label: string;
  icon: IconType;
  channelId: string;
};

const foodiesItems = [
  {
    label: "Bar Stool Pizza",
    icon: CiPizza,
    channelId: "UU5PrkGgI_cIaSStOyRmLAKA",
  },
  { label: "Sushi", icon: BiSushi, channelId: "fakeID" },
];

const FoodyModalContent = ({ setMapMarkers }: any) => {
  const [activeFoodie, setActiveFoodie] = useState("");

  const handleSelectFoody = async (item: FoodiesItem) => {
    setActiveFoodie(item.label);
    const data = await fetchYoutubeData(item.channelId);
    setMapMarkers(data);
    console.log(data, "retrieved data");
  };

  return (
    <div>
      <h1>Foodies</h1>
      <div>
        {foodiesItems.map((item) => (
          <TopNavItem
            onClick={() => handleSelectFoody(item)}
            key={item.label}
            Icon={item.icon}
            label={item.label}
            isActive={activeFoodie === item.label}
          />
        ))}
      </div>
    </div>
  );
};

export default FoodyModalContent;
