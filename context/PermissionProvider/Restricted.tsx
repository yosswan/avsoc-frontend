import React from "react";

import usePermission from "./usePermission";

export type Permission = string;

type Props = {
  typePermisse: Permission;
  module: any;
  fallback?: JSX.Element | string;
  children?: React.ReactNode;
};

// This component is meant to be used everywhere a restriction based on user permission is needed
const Restricted: React.FunctionComponent<Props> = ({
  typePermisse,
  fallback,
  module,
  children,
}) => {
  // We "connect" to the provider thanks to the PermissionContext
  const allowed = usePermission(typePermisse, module);

  // If the user has that permission, render the children
  if (allowed) {
    return <>{children}</>;
  }

  // Otherwise, render the fallback
  return <>{fallback}</>;
};

export default Restricted;
