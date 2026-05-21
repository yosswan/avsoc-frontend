import * as React from "react";
import { Typography } from "components/common/typography";
import clsx from "clsx";
import { ValidateString } from "lib/helper";
import { IconWithText } from "components/icon-with-text";

const ViewDistrito = ({ data, hide, refetch }: any) => {
  const {
    pastor,
    consejo_regional,
    nro_iglesias,
    nro_clubes,
    nro_conquistadores,
    nro_gm,
    nombre,
    foto_pastor,
  } = data;
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Detalle de Distrito</h2>
      <div className="item flex flex-col gap-2 text-center justify-center mt-8">
        <Typography
          type="label"
          className={clsx(
            "ml-3 font-bold mb-2 block text-yellow text-xl capitalize"
          )}
        >
          {nombre}
        </Typography>
      </div>
      <div className="container-form mt-8 gap-6 grid grid-cols-3 text-left">
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Nombre
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(nombre)}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Consejo Regional
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(consejo_regional)}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Nro. Iglesias
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18")}
          >
            {nro_iglesias}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Nro. Clubes
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18")}
          >
            {nro_clubes}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Nro. Conquistadores
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18")}
          >
            {nro_conquistadores}
          </Typography>
        </div>

        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Nro. Aventureros
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18")}
          >
            {data?.nro_aventureros}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Nro. GM
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18")}
          >
            {nro_gm}
          </Typography>
        </div>
      </div>

      <div className="item mx-auto text-center justify-center mt-8">
        <div className="bg-yellow p-4 mx-auto max-w-[300px] rounded-md">
          <Typography
            type="title"
            className={clsx("ml-3 font-bold mb-2 block f-24")}
          >
            Pastor
          </Typography>
          <Typography
            type="label"
            className={clsx("ml-3 font-normal mb-2 block f-20")}
          >
            <IconWithText
              classNameContainer="justify-center gap-2"
              icon={foto_pastor}
              text={data?.pastor}
              isUser
              isVertical
            >
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {data?.email ? data?.email : "N/A"}
              </Typography>
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {data?.cedula_pastor ? "CI-" + data?.cedula_pastor : "N/A"}
              </Typography>
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {data?.telefono ? "Telf: " + data?.telefono : "N/A"}
              </Typography>
            </IconWithText>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ViewDistrito;
