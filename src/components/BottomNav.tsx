"use client";
import Link from "next/link";
import { useRouter } from "next/router";
import { FaMap, FaListUl } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IconType } from "react-icons";

interface NavItemProps {
  Icon: IconType;
  label: string;
  href: string;
}

const NavItem = ({ Icon, label, href }: NavItemProps) => {
  const router = useRouter();
  const currentPath = router.pathname;
  const isActive = currentPath === href;

  return (
    <Link
      href={href}
      className={`flex items-center flex-col space-x-2 ${
        isActive ? "text-red-500" : "text-gray-500"
      }`}
    >
      <Icon className="mb-2" size={24} color={isActive ? "red" : "gray"} />
      {label}
    </Link>
  );
};

const BottomNav = () => {
  return (
    <nav className="flex justify-around py-3">
      <NavItem Icon={FaListUl} label="My List" href="/list" />
      <NavItem Icon={FaMap} label="Explore" href="/" />
      <NavItem Icon={CgProfile} label="Profile" href="/profile" />
    </nav>
  );
};

export default BottomNav;
