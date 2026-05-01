import { GetServerSideProps } from "next";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import {
  getSession,
  routeValidForUser,
} from "lib/helper";
import CamporeeDetail from "components/camporee/detalle";

const Camporee = ({ festival = false }: { festival?: boolean }) => {
  return <CamporeeDetail />;
};

export default Camporee;
