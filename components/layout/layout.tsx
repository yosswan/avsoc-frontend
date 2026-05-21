import React, { useState } from "react";
import clsx from "clsx";
import { MenuIcon } from "@heroicons/react/outline";
import { Typography } from "components/common/typography";
import { Notifications } from "components/layout/notifications";
import { SidebarMobile } from "components/layout/sidebars/mobile";
import { SidebarDesktop } from "components/layout/sidebars/desktop";
import { DropdownProfile } from "components/layout/profile/dropdownProfile";
import { Icons } from "consts/icons";
import { navigation as menu } from "consts/navigation";
import Styles from "./styles.module.scss";

interface LayoutDashboardProps {
  title?: string;
  isLoading?: boolean;
  children?: React.ReactNode;
}
export const LayoutDashboard: React.FC<LayoutDashboardProps> = ({
  title,
  children,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  let refNotifications = React.useRef(null);
  let refSidebarMobile = React.useRef(null);

  //Menu
  const [navigation, setNavigation] = React.useState(menu);
  const [updateShowSubMenu, setUpdateShowSubMenu] = React.useState(false);

  React.useEffect(() => {
    if (updateShowSubMenu) {
      setUpdateShowSubMenu(false);
    }
  }, [updateShowSubMenu]);

  const showSubmenu = (item: any, positionMenu: any, positionSubMenu: any) => {
    let auxMenu = navigation;
    // console.log("posicion menu:", positionMenu);
    // console.log("posicion SubMenu:", positionSubMenu);
    // console.log(
    //   "LOO",
    //   auxMenu[positionMenu].subNavigation[positionSubMenu].dropdownVisible
    // );

    auxMenu[positionMenu].subNavigation[positionSubMenu].dropdownVisible =
      !auxMenu[positionMenu].subNavigation[positionSubMenu].dropdownVisible;

    // console.log("sin: ", auxMenu);
    // console.log("con: ", [...auxMenu]);

    return [...auxMenu];
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* inicio Sidebar mobile */}
      <SidebarMobile
        initialFocus={refSidebarMobile}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
        navigation={navigation}
        setNavigation={setNavigation}
        showSubmenu={showSubmenu}
      />
      {/* Fin Sidebar mobile */}

      {/*inicio Menu notifications */}
      <Notifications
        title="algo"
        initialFocus={refNotifications}
        setSidebarOpen={setNotifications}
        sidebarOpen={notifications}
      ></Notifications>
      {/*fin Menu notifications */}

      <SidebarDesktop
        navigation={navigation}
        setNavigation={setNavigation}
        showSubmenu={showSubmenu}
      />

      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="pl-1 py-1 sm:pl-3 sm:py-3 flex justify-between md:justify-end bg-primary border-l-05">
          {/* Button mobile sidebar */}
          <button
            className="md:hidden -ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-white hover:text-active focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          {/* fin Button mobile sidebar */}

          {/* Nombre seccion */}
          <div className="flex items-center flex-1 hidden md:flex">
            <Typography
              type="subTitle"
              className={clsx("text-white", " font-semibold f-36")}
            >
              {title}
            </Typography>
          </div>
          {/* fin Nombre seccion */}

          {/* Notifications button */}
          {/* <button
						ref={refNotifications}
						className="flex justify-center items-center focus:outline-none group cursor-pointer pr-8"
						onClick={() => setNotifications(true)}
					>
						<div
							className={clsx('notification relative', 'active', Styles.active)}
						>
							<img src={Icons.notification} alt="" className="ml-3" />
						</div>
					</button> */}

          {/* fin Notifications button */}

          {/* Dropdown profile */}
          <div className="flex">
            <DropdownProfile />
          </div>
          {/* fin Dropdown profile  */}
        </div>
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-18 px-2 sm:px-6 md:px-16">
            <div className="mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
};
