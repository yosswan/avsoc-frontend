import { GetServerSideProps } from "next";
import * as React from "react";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import { formatDateComplete, getSession, routeValidForUser } from "lib/helper";
import CamporeeList from "components/camporee/listado";

const CamporeeIndex = () => {
  return <CamporeeList />
};

export default CamporeeIndex;
