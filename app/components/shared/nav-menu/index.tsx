import React, { useState, useEffect } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import type { MenuProps } from "antd";
import {
  AppstoreFilled,
  BankFilled,
  CalendarFilled,
  TagsFilled,
  TrophyFilled,
  StarFilled,
} from "@ant-design/icons";

interface NavMenuPropTypes {
  collapsed: boolean;
}
type MenuItem = Required<MenuProps>["items"][number];

const NavMenu: React.FC<NavMenuPropTypes> = (collapsed) => {
  const [current, setCurrent] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrent(localStorage.getItem("activeMenu") || "Products");
    }
  }, []);

  function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: "group"
  ) {
    return {
      key,
      icon,
      children,
      label,
    };
  }

  const items = [
    getItem(<Link to="/">Products</Link>, "Products", <AppstoreFilled />),
    getItem(<Link to="/tags">Tags</Link>, "Tags", <TagsFilled />),
    getItem(<Link to="/variants">Variants</Link>, "Variants", <StarFilled />),
    getItem(<Link to="/coupons">Coupons</Link>, "Coupons", <TrophyFilled />),
    getItem(<Link to="/booking">Booking</Link>, "Booking", <CalendarFilled />),
    getItem(
      <Link to="/business/profile">Business Profile</Link>,
      "Business Profile",
      <BankFilled />
    ),
  ];

  return (
    <Menu
      onClick={(e) => {
        if (typeof window !== "undefined") {
          localStorage.setItem("activeMenu", e.key);
          if (e.key !== "") setCurrent(e.key);
        }
      }}
      selectedKeys={[current]}
      mode="inline"
      theme="light"
      items={items}
    />
  );
};

export default NavMenu;
