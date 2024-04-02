import { IconType } from "react-icons";
import { SiFoodpanda } from "react-icons/si";
import { GiThreeFriends } from "react-icons/gi";
import { FaHotjar } from "react-icons/fa";

interface NavItemProps {
  Icon: IconType;
  label: string;
  isActive: boolean;
}

const TopNavItem = ({ Icon, label, isActive }: NavItemProps) => {
  return (
    <div className={`flex items-center flex-col space-x-2`}>
      <Icon className="mb-2" size={24} color={isActive ? "red" : "gray"} />
      {label}
    </div>
  );
};

const TopNav = () => {
  return (
    <nav className="flex justify-around pt-2">
      <TopNavItem Icon={SiFoodpanda} label="Foodies" isActive={false} />
      <TopNavItem Icon={GiThreeFriends} label="Friends" isActive={true} />
      <TopNavItem Icon={FaHotjar} label="Whats Hot" isActive={false} />
    </nav>
  );
};

export default TopNav;
