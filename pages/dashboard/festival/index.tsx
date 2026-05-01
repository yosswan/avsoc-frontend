import { GetServerSideProps } from "next";
import * as React from "react";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import { getSession, routeValidForUser } from "lib/helper";
import { ExtendedTypesSelectEnums } from "consts/typesSelectEnum";
import CamporeeList from "components/camporee/listado";

const FestivalList = () => {
  return <CamporeeList type={ExtendedTypesSelectEnums.SOCIEDAD_DE_JOVENES} festival={true} />;
};

export default FestivalList;
