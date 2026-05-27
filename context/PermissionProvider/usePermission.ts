import { useContext, useMemo } from "react";
import PermissionContext from "./PermissionContext";

export type Permission = string;

const usePermission = (permission: Permission, module: string) => {
  const { isAllowedTo } = useContext(PermissionContext);
  return useMemo(
    () => isAllowedTo(permission, module),
    [isAllowedTo, permission, module]
  );
};

export default usePermission;
