import clsx from "clsx";
import { Icon } from "components/icon";
import { ModuleEnums, ModuleMap } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import Restricted from "context/PermissionProvider/Restricted";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { Fragment } from "react";

export interface itemNavbarsProps {
  item: any;
  isMobile?: boolean;
  setNavigation: any;
  showSubmenu: any;
  positionMenu: any;
}

export const ItemNavbar: React.FC<itemNavbarsProps> = ({
  item,
  isMobile,
  setNavigation,
  showSubmenu,
  positionMenu,
}) => {
  const router = useRouter();
  return (
    <Fragment key={`nav-${isMobile ? "mobile" : "desktop"}-${item.id}`}>
      <p className="text-white f-18 font-semibold px-3 pt-7">{item.label}</p>
      {item?.subNavigation?.map((subItem: any, positionSubMenu: any) => {
        return (
          <Fragment key={subItem.id}>
            {subItem.dropdown ? (
              ModuleMap[subItem.name as ModuleEnums] ? (
                <Restricted
                  module={ModuleMap[subItem.name as ModuleEnums]}
                  typePermisse={PermissionsEnums.VIEW}
                >
                  <div
                    className={clsx(
                      router.pathname.includes(subItem.href)
                        ? "bg-active text-white font-bold opacity-100 "
                        : "text-white hover:bg-active font-light  opacity-70",
                      "group flex items-center px-3 pt-7 hover:opacity-90 text-base rounded-md f-18 cursor-pointer"
                    )}
                    onClick={() =>
                      showSubmenu(subItem, positionMenu, positionSubMenu)
                    }
                  >
                    <Icon
                      src={subItem.icon}
                      fill="var(--color-white)"
                      className="mr-4 flex-shrink-0 h-7 w-7"
                    />
                    {subItem.label}
                  </div>
                </Restricted>
              ) : (
                <div
                  className={clsx(
                    router.pathname.includes(subItem.href)
                      ? "bg-active text-white font-bold opacity-100 "
                      : "text-white hover:bg-active font-light  opacity-70",
                    "group flex items-center px-3 pt-7 hover:opacity-90 text-base rounded-md f-18 cursor-pointer"
                  )}
                  onClick={() =>
                    showSubmenu(subItem, positionMenu, positionSubMenu)
                  }
                >
                  <Icon
                    src={subItem.icon}
                    fill="var(--color-white)"
                    className="mr-4 flex-shrink-0 h-7 w-7"
                  />
                  {subItem.label}
                </div>
              )
            ) : (
              <Restricted
                key={positionSubMenu}
                module={ModuleMap[subItem.name as ModuleEnums]}
                typePermisse={PermissionsEnums.VIEW}
              >
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className={clsx(
                    router.pathname.includes(subItem.href)
                      ? "bg-active text-white font-bold opacity-100 "
                      : "text-white hover:bg-active font-light  opacity-70",
                    "group flex items-center px-3 pt-7 hover:opacity-90 text-base rounded-md f-18"
                  )}>

                  <Icon
                    src={subItem.icon}
                    fill="var(--color-white)"
                    className="mr-5 flex-shrink-0 h-7 w-7"
                  />
                  {subItem.label}

                </Link>
              </Restricted>
            )}
            {subItem.dropdown &&
              subItem.dropdownVisible &&
              subItem.dropdown.map((dropdown: any, index: any) => {
                return (
                  <Restricted
                    key={index}
                    module={ModuleMap[dropdown.name as ModuleEnums]}
                    typePermisse={PermissionsEnums.VIEW}
                  >
                    <Link
                      key={dropdown.name}
                      href={"/dashboard" + dropdown.href}
                      className={clsx(
                        router.pathname.includes(dropdown.href)
                          ? "bg-active text-yellow opacity-100 "
                          : "text-white hover:bg-active font-light  opacity-70",
                        "group flex items-center px-3 pt-3 hover:opacity-90 text-base rounded-md f-16"
                      )}>

                      <div
                        className="mr-5 flex-shrink-0 h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                      {dropdown.label}

                    </Link>
                  </Restricted>
                );
              })}
          </Fragment>
        );
      })}
      <div className="divider mx-3 mt-7"></div>
    </Fragment>
  );
};
