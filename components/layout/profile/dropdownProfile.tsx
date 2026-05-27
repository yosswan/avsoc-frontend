import { Menu, Transition } from "@headlessui/react";
import React, { Fragment } from "react";
import { Typography } from "../../common/typography";
import { Icons } from "consts/icons";
import clsx from "clsx";
import { useUser } from "hooks/user";
import { signOut } from "next-auth/react";
import Link from "next/dist/client/link";
import { get } from "lodash";
import { ValidateImageUser } from "lib/helper";
import { useModal } from "hooks/modal";
import EditProfile from "components/profile/editRole";

export const DropdownProfile = () => {
  const { Modal, hide, isShow, show } = useModal();
  const profile = useUser(true);

  const data = get(profile, "data", []);
  const user = get(data, "user", []);

  return (
    <>
      <div className="text-right">
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-primary focus:outline-none">
              <div className="flex justify-center items-center cursor-pointer md:pr-8">
                <div
                  className={clsx(
                    "inline-flex items-center w-9 h-9 overflow-hidden"
                  )}
                >
                  <img
                    className="w-10 rounded-full"
                    src={ValidateImageUser(user?.foto)}
                    alt=""
                  />
                </div>
                <Typography
                  type="span"
                  className={clsx(
                    "ml-2 text-white",
                    "font-bold text-base hidden md:flex"
                  )}
                >
                  {user?.nombres} {user?.apellidos}
                </Typography>
                <img src={Icons.arrowDown} alt="" className="ml-3" />
              </div>
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 right-0 w-full md:mt-3 mt-2 origin-top-right bg-white divide-y divide-gray-100 shadow-lg  focus:outline-none">
              <div className="px-1 py-1">
                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-transparent text-white" : "text-gray-500"
                      } group flex flex-1 rounded-md items-center w-full  py-5 justify-center text-gray-500 f-18 font-normal hover:text-gray-800`}
                    >
                      <Link href="/dashboard/profile">Mi perfil</Link>
                    </button>
                  )}
                </Menu.Item>
                {user?.verificado && (
                  <>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? "bg-transparent text-white"
                              : "text-gray-500"
                          } group flex flex-1 rounded-md items-center w-full  py-5 justify-center text-gray-500 f-18 font-normal hover:text-gray-800`}
                          onClick={show}
                        >
                          Cambiar rol
                        </button>
                      )}
                    </Menu.Item>
                  </>
                )}

                <Menu.Item>
                  {({ active }) => (
                    <button
                      className={`${
                        active ? "bg-transparent text-white" : "text-gray-500"
                      } group flex flex-1 rounded-md items-center w-full  py-5 justify-center text-gray-500 f-18 font-normal hover:text-gray-800`}
                      onClick={() => {
                        signOut({ callbackUrl: '/auth/signin' });
                      }}
                    >
                      Cerrar sesión
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <Modal isShow={isShow}>
        <EditProfile hide={hide} refetch={profile?.refetch} data={profile} />
      </Modal>
    </>
  );
};
