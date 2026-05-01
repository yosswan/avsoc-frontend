import { GetServerSideProps } from "next";
import * as React from "react";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import { getSession, routeValidForUser } from "lib/helper";
import { ExtendedTypesSelectEnums } from "consts/typesSelectEnum";
import CamporeeList from "components/camporee/listado";

const CamporeeAventurerosList = () => {
  return <CamporeeList type={ExtendedTypesSelectEnums.AVENTUREROS} />
};

export default CamporeeAventurerosList;