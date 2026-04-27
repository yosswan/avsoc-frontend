import { GetServerSideProps } from "next";
import * as React from "react";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import {
  getSession,
  routeValidForUser,
} from "lib/helper";
import CamporeeDetail from "components/camporee/detalle";

const FestivalDetail = () => {
  return <CamporeeDetail festival={true} />;
};

// AGREGAR VALIDACION DE PERMISOS A ESTA VISTA
export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getSession(context);

	if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const isValid = routeValidForUser(
    session,
    PermissionsEnums.VIEW,
    ModuleEnums.EVENTO_PRECAMPOREE
  );

  if (!isValid) {
    return {
      redirect: {
        destination: "/dashboard/permission-denied",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default FestivalDetail;
