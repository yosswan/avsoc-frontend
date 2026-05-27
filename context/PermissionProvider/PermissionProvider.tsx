import { PermissionByRol } from "consts/permissionByRol";
import { useUser } from "hooks/user";
import { get, isNil } from "lodash";
import React, { useCallback, useMemo } from "react";
import PermissionContext from "./PermissionContext";

export type Permission = string;

const PermissionProvider: React.FunctionComponent<any> = ({ children }) => {
  const profile = useUser();
  const data = get(profile, "data", undefined);
  const rol = get(data, "scope_actual", undefined);

  const isAllowedTo = useCallback((permission: Permission, module: string) => {
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
  }, [data, rol]);

  const contextValue = useMemo(() => ({ isAllowedTo }), [isAllowedTo]);

  return (
    <PermissionContext.Provider value={contextValue}>
      {children}
    </PermissionContext.Provider>
  );
};

export default PermissionProvider;
