import React from "react";

import usePermission from "./usePermission";

export type Permission = string;

type Props = {
  typePermisse: Permission;
  module: any;
  or?: any;
  fallback?: JSX.Element | string;
  children?: React.ReactNode;
};

const Restricted: React.FunctionComponent<Props> = ({
  typePermisse,
  module,
  or,
  fallback,
  children,
}) => {
  const allowed = usePermission(typePermisse, module);
  const allowedOr = or ? usePermission(typePermisse, or) : false;
  if (allowed || allowedOr) {
    return <>{children}</>;
  }
  return <>{fallback}</>;
};

export default Restricted;
