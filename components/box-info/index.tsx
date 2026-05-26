import clsx from "clsx";
import { Icon } from "components/icon";
import ItemIcon from "components/item-icon";
import { Icons } from "consts";
import { ValidateImage } from "lib/helper";
import * as React from "react";
import { PencilAltIcon, PencilIcon } from "@heroicons/react/solid";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import Restricted from "context/PermissionProvider/Restricted";
import { Tooltip } from "antd";
interface BoxInfoProps {
  image: string;
  title: string;
  className?: string;
  items?: any[];
  headItems?: any[];
  withEditButton?: boolean;
  showModal?: any;
  children?: any;
}

const BoxInfo = ({
  image,
  title,
  children,
  className,
  items,
  headItems,
  withEditButton,
  showModal,
}: BoxInfoProps) => {
  return (
    <div className={clsx("flex flex-wrap flex-row", className)}>
      <div className="flex flex-wrap w-full flex-col">
        <div className="flex-1 flex flex-col px-2 sm:px-8">
          <div className="relative container shadow-2xl rounded-lg px-5 py-8 bg-yellow">
            <img
              className="w-32 h-32 flex-shrink-0 mx-auto rounded-full object-cover"
              src={ValidateImage(image)}
              alt=""
            />
            <h3 className="mt-6 text-gray-900 font-semibold text-xl text-center capitalize">
              {title}
            </h3>
            {headItems && (
              <div className="flex gap-4 justify-center items-center text-center mt-3 border border-[black] bg-white py-2 rounded-md">
                {headItems.map((item, index) => (
                  <div key={index} className="flex-col justify-center items-center text-center text-[black]">
                    <h5>{item?.title}</h5>
                    <>{item?.content}</>
                  </div>
                ))}
              </div>
            )}
            {items && (
              <div className="mt-8 flex-grow flex flex-col justify-between gap-y-4">
                {items.map((item: any, index: any) => {
                  return (
                    <ItemIcon
                      key={index}
                      icon={item?.icon}
                      // title={item?.title}
                      content={item?.content}
                    />
                  );
                })}
              </div>
            )}
            <Restricted
              module={ModuleEnums.CAMPOREE}
              typePermisse={PermissionsEnums.EDIT}
              or={ModuleEnums.FESTIVAL_SJ}
            >
              {withEditButton && (
                <Tooltip title="Editar">
                  <div className="absolute top-3 right-3">
                    <PencilIcon
                      fill="text-black"
                      className={`w-8 cursor-pointer p-1 rounded-full shadow-sm shadow-primary bg-white`}
                      onClick={showModal}
                    />
                  </div>
                </Tooltip>
              )}
            </Restricted>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
export default BoxInfo;
