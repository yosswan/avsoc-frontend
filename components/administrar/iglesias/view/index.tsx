import * as React from "react";
import { Typography } from "components/common/typography";
import clsx from "clsx";
import { ValidateString } from "lib/helper";
import { IconWithText } from "components/icon-with-text";

const ViewIglesia = ({ data, hide, refetch }: any) => {
  const {
    primer_anciano,
    distrito,
    nro_conquistadores,
    nro_gm,
    nombre,
    foto_primer_anciano,
    pastor,
    foto_pastor,
    email_pastor,
    email_anciano,
    cedula_primer_anciano,
    cedula_pastor,
    telefono_anciano,
    telefono_pastor,
  } = data;
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Detalle de Iglesia</h2>
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
            Distrito
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(distrito)}
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

      <div className="item mx-auto text-center justify-center mt-8 flex flex-wrap gap-8 w-full">
        <div className="container-anciano flex-1">
          <div className="bg-yellow p-4 mx-auto max-w-[300px] rounded-md">
            <Typography
              type="title"
              className={clsx("ml-3 font-bold mb-2 block f-24")}
            >
              Anciano
            </Typography>
            <Typography
              type="label"
              className={clsx("ml-3 font-normal mb-2 block f-20")}
            >
              <IconWithText
                classNameContainer="justify-center gap-2"
                icon={foto_primer_anciano}
                text={primer_anciano}
                isUser
                isVertical
              >
                <Typography
                  type="label"
                  className={clsx(" font-normal mb-2 block text-sm")}
                >
                  {email_anciano ? email_anciano : "N/A"}
                </Typography>
                <Typography
                  type="label"
                  className={clsx(" font-normal mb-2 block text-sm")}
                >
                  {cedula_primer_anciano
                    ? "CI-" + cedula_primer_anciano
                    : "N/A"}
                </Typography>
                <Typography
                  type="label"
                  className={clsx(" font-normal mb-2 block text-sm")}
                >
                  {telefono_anciano ? "Telf: " + telefono_anciano : "N/A"}
                </Typography>
              </IconWithText>
            </Typography>
          </div>
        </div>
        <div className="container-pastor flex-1">
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
                text={pastor}
                isUser
                isVertical
              >
                <Typography
                  type="label"
                  className={clsx(" font-normal mb-2 block text-sm")}
                >
                  {email_pastor ? email_pastor : "N/A"}
                </Typography>
                <Typography
                  type="label"
                  className={clsx(" font-normal mb-2 block text-sm")}
                >
                  {cedula_pastor ? "CI-" + cedula_pastor : "N/A"}
                </Typography>
                <Typography
                  type="label"
                  className={clsx(" font-normal mb-2 block text-sm")}
                >
                  {telefono_pastor ? "Telf: " + telefono_pastor : "N/A"}
                </Typography>
              </IconWithText>
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIglesia;
