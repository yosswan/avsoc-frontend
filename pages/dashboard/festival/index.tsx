import { GetServerSideProps } from "next";
import * as React from "react";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import { getSession, routeValidForUser } from "lib/helper";
import { ExtendedTypesSelectEnums } from "consts/typesSelectEnum";
import CamporeeList from "../camporee";

const FestivalList = () => {
  return <CamporeeList type={ExtendedTypesSelectEnums.SOCIEDAD_DE_JOVENES} festival={true} />;
};

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
    ModuleEnums.CLUBES
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

export default FestivalList;
