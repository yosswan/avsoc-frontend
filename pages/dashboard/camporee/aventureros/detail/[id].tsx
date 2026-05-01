import { GetServerSideProps } from "next";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import {
  getSession,
  routeValidForUser,
} from "lib/helper";
import CamporeeDetail from "components/camporee/detalle";

const CamporeeAventurerosDetail = () => {
	return <CamporeeDetail />
};

export default CamporeeAventurerosDetail;
