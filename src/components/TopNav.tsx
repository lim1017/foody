import React, { useState } from "react";
import { IconType } from "react-icons";
import { SiFoodpanda } from "react-icons/si";
import { GiThreeFriends } from "react-icons/gi";
import { FaHotjar } from "react-icons/fa";
import Modal, { useModal } from "./Modal";
import FoodyModalContent from "./ModalContent/FoodyModalContent";

interface NavItemProps {
  Icon: IconType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

export const TopNavItem = ({
  Icon,
  label,
  onClick,
  isActive,
}: NavItemProps) => {
  return (
    <div className={`flex items-center flex-col space-x-2`}>
      <Icon
        onClick={onClick}
        className="mb-2"
        size={24}
        color={isActive ? "red" : "gray"}
      />
      {label}
    </div>
  );
};

export enum NavItemEnum {
  "Foodies" = "FOODIES",
  "Friends" = "FRIENDS",
  "Hot" = "HOT",
}

interface topNavItem {
  label: NavItemEnum;
  icon: IconType;
  content: React.ReactNode;
}

const topNavItems: topNavItem[] = [
  {
    label: NavItemEnum.Foodies,
    icon: SiFoodpanda,
    content: <FoodyModalContent />,
  },
  {
    label: NavItemEnum.Friends,
    icon: GiThreeFriends,
    content: <div>content friends</div>,
  },
  { label: NavItemEnum.Hot, icon: FaHotjar, content: <div>HOT CONTENT</div> },
];
// interface TopNavProps {
//   activeTopNavItem: NavItemEnum;
//   setActiveTopNavItem: React.Dispatch<React.SetStateAction<NavItemEnum>>;
// }

const TopNav = () => {
  const [activeTopNavItem, setActiveTopNavItem] = useState<NavItemEnum>(
    NavItemEnum.Hot
  );

  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  const { isOpen, toggleModal, setIsOpen } = useModal();

  const handleItemClick = (item: topNavItem) => {
    setActiveTopNavItem(item.label);
    setModalContent(item.content);
    toggleModal();
  };

  return (
    <nav className="flex justify-around pt-2">
      {topNavItems.map((item) => (
        <TopNavItem
          key={item.label}
          Icon={item.icon}
          label={item.label}
          isActive={activeTopNavItem === item.label}
          onClick={() => handleItemClick(item)}
        />
      ))}
      <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
        {modalContent}
      </Modal>
    </nav>
  );
};

export default TopNav;
