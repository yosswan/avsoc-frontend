import React, { Fragment } from "react";
import clsx from "clsx";
import Link from "next/link";
import { Typography } from "components/common/typography";
import { useRouter } from "next/router";
import { Icons } from "consts/icons";
import { signOut } from "next-auth/client";
import { Images } from "consts";
// import { appRouter } from "consts/router";
import { Icon } from "components/icon";
import { ItemNavbar } from "./item";
import { useUser } from "hooks/user";
import { get } from "lodash";

interface LayoutDashboardProps {
  navigation: any;
  setNavigation: any;
  showSubmenu: any;
}
export const SidebarDesktop: React.FC<LayoutDashboardProps> = ({
  navigation,
  setNavigation,
  showSubmenu,
}) => {
  const user = useUser();
  const profile = get(user, "data.user", []);
  return (
    <>
      {/*  Sidebar desktop */}
      <div className="hidden md:flex md:flex-shrink-0 bg-primary">
        <div className="flex flex-col flex-auto">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1">
            <div className="flex-1 flex flex-col pt-8 pb-4 overflow-y-auto scroll-custom">
              <div className="flex items-center flex-shrink-0 px-7 justify-center">
                <Link href="/">
                  <a
                    className={clsx(
                      "cursor-pointer flex items-center justify-center"
                    )}
                  >
                    <img
                      className="max-w-[184px]"
                      src={Images.logoWithColor}
                      alt=""
                    />
                  </a>
                </Link>
              </div>
              {profile?.verificado && (
                <nav className="mt-5 flex-1 px-7">
                  {navigation.map((item: any, positionMenu: any) => {
                    return (
                      <ItemNavbar
                        key={positionMenu}
                        item={item}
                        positionMenu={positionMenu}
                        setNavigation={setNavigation}
                        showSubmenu={showSubmenu}
                      />
                    );
                  })}
                </nav>
              )}
            </div>
            <div className="flex-shrink-0 flex border-t border-white px-7 py-4">
              <div className="flex-1 flex items-center px-3 cursor-pointer">
                <div
                  className={clsx(
                    "inline-flex items-center w-9 h-9 overflow-hidden"
                  )}
                >
                  <img
                    src={Icons.logout}
                    className="mr-4 flex-shrink-0 h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <Typography
                  type="span"
                  className="text-white font-semibold  f-18 "
                  onClick={() => {
                    signOut({ callbackUrl: '/auth/signin' });
                  }}
                >
                  Salir del sistema
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
