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
    email_presidente,
    foto_presidente,
    cedula_presidente,
    telefono_presidente,
    presidente_federacion,
    foto_presidente_federacion,
    cedula_presidente_federacion,
    email_presidente_federacion,
    telefono_presidente_federacion,
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

      <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
        <div className="bg-yellow p-4 mx-auto max-w-[300px] rounded-md">
          <Typography
            type="title"
            className={clsx("font-bold mb-2 block f-24 text-center min-h-[3.5rem]")}
          >
            Presidente del CRC
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
                {email_presidente ? email_presidente : "N/A"}
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
                {telefono_presidente ? "Telf: " + telefono_presidente : "N/A"}
              </Typography>
            </IconWithText>
          </Typography>
        </div>
        <div className="bg-yellow p-4 mx-auto max-w-[300px] rounded-md">
          <Typography
            type="title"
            className={clsx("font-bold mb-2 block f-24 text-center min-h-[3.5rem]")}
          >
            Presidente de la Federación
          </Typography>
          <Typography
            type="label"
            className={clsx("ml-3 font-normal mb-2 block f-20")}
          >
            <IconWithText
              classNameContainer="justify-center gap-2"
              icon={foto_presidente_federacion}
              text={presidente_federacion}
              isUser
              isVertical
            >
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {email_presidente_federacion ? email_presidente_federacion : "N/A"}
              </Typography>
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {cedula_presidente_federacion ? "CI-" + cedula_presidente_federacion : "N/A"}
              </Typography>
              <Typography
                type="label"
                className={clsx(" font-normal mb-2 block text-sm")}
              >
                {telefono_presidente_federacion ? "Telf: " + telefono_presidente_federacion : "N/A"}
              </Typography>
            </IconWithText>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ViewFederacion;
