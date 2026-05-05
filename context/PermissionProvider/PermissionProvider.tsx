import { PermissionByRol } from "consts/permissionByRol";
import { useUser } from "hooks/user";
import { get, isNil } from "lodash";
import { useRouter } from "next/router";
import React from "react";
import PermissionContext from "./PermissionContext";

export type Permission = string;

// type Props = {
//   permissions: Permission[];
// };

// This provider is intended to be surrounding the whole application.
// It should receive the users permissions as parameter

const PermissionProvider: React.FunctionComponent<any> = ({ children }) => {
  const profile = useUser();
  const data = get(profile, "data", undefined);
  const rol = get(data, "scope_actual", undefined);

  // Creates a method that returns whether the requested permission is available in the list of permissions
  // passed as parameter
  const isAllowedTo = (permission: Permission, module: string) => {
    if (data?.user?.verificado === false) {
      return false;
    }

    const findUserRole = PermissionByRol.find((item) => item.role === rol);

    if (!isNil(findUserRole)) {
      const findModule = findUserRole.modules.find(
        (item) => item.name === module
      );

      if (!isNil(findModule)) {
        return findModule.permissionsActions.includes(permission as any);
      }
    }

    return false;
  };

  return (
    <PermissionContext.Provider value={{ isAllowedTo }}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
