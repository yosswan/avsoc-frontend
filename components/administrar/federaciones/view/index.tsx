import * as React from "react";
import { Typography } from "components/common/typography";
import clsx from "clsx";
import { ValidateImage, ValidateString } from "lib/helper";
import { IconWithText } from "components/icon-with-text";

const ViewFederacion = ({ data, hide, refetch }: any) => {
  const {
    presidente,
    abreviatura,
    nro_iglesias,
    nro_clubes,
    nro_conquistadores,
    nro_gm,
    logo,
    nombre,
    email,
    foto_presidente,
    cedula_presidente,
    telefono,
  } = data;
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Detalle de Federacion</h2>
      <div className="item flex flex-col gap-2 text-center justify-center mt-8">
        <img
          src={ValidateImage(logo)}
          alt=""
          className="w-28 h-28 mx-auto object-cover object-center rounded-full"
        />
        <Typography
          type="label"
          className={clsx("ml-3 font-bold mb-2 block text-yellow text-xl")}
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
            Abreviatura
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18")}
          >
            {ValidateString(abreviatura)}
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
            Presidente
          </Typography>
          <Typography
            type="label"
            className={clsx("ml-3 font-normal mb-2 block f-20")}
          >
            <IconWithText
              classNameContainer="justify-center gap-2"
              icon={foto_presidente}
              text={presidente}
              isUser
              isVertical
            >
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {email ? email : "N/A"}
              </Typography>
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {cedula_presidente ? "CI-" + cedula_presidente : "N/A"}
              </Typography>
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {telefono ? "Telf: " + telefono : "N/A"}
              </Typography>
            </IconWithText>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ViewFederacion;
