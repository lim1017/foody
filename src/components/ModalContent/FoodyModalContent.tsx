import { CiPizza } from "react-icons/ci";
import { GiDumplingBao } from "react-icons/gi";
import { TopNavItem } from "../TopNav";
import { useState } from "react";
import { IconType } from "react-icons";
import { fetchFoodyData } from "@/utils/api/api";

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
