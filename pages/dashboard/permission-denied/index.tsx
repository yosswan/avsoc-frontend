import * as React from "react";
import { GetServerSideProps } from "next";

import PermissionDeniedComponent from "components/permission-denied";
import { getSession } from "lib/helper";

const PermissionDenied = () => {
  return <PermissionDeniedComponent></PermissionDeniedComponent>;
};

export default PermissionDenied;
