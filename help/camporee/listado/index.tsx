import { RoleEnums } from "consts/rolesEnum";
import { useUser } from "hooks/user";
import { isRole } from "lib/helper";
import { get } from "lodash";
import React from "react";

export interface HelpProps {
  hide: any;
}

const HelpListCamporee: React.FC<HelpProps> = ({ hide }) => {
  const profile = useUser();
  const dataUser = get(profile, "data", []);
  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold">Ayuda</h2>
      </div>
      <div className="text-left">
        <p>
          Aquí está la lista de camporees planificados. Dentro de cada camporee
          podrás ver la lista de eventos camporee y precamporee y los
          resultados.
          {isRole(dataUser, [
            RoleEnums.DIRECTOR,
            RoleEnums.SECRETARIO_CLUB,
          ]) && (
            <span>
              {" "}
              Dentro de los eventos precamporee podrás llenar el informe si
              estás en el rango de fechas permitido. Dentro de los eventos
              camporee podrás inscribir tu club en el evento.
            </span>
          )}
          {isRole(dataUser, [
            RoleEnums.LIDER_JUVENIL,
            RoleEnums.PRESIDENTE_CONSEJO,
            RoleEnums.PASTOR,
            RoleEnums.ANCIANO,
          ]) && (
            <>
              <br />
              <br />
              <span>
                Dentro de los eventos precamporee podrás revisar los informes
                que han enviado los clubes de tu zona. Dentro de los eventos
                camporee podrás ver los clubes inscritos en el evento.
              </span>
            </>
          )}
        </p>
      </div>
    </>
  );
};

export default HelpListCamporee;
