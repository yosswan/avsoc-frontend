import * as React from "react";
import { Typography } from "components/common/typography";
import clsx from "clsx";
import { ValidateImage, ValidateString } from "lib/helper";
import { IconWithText } from "components/icon-with-text";
import { isEmpty } from "lodash";
import { Table } from "antd";

const ViewClub = ({ data, hide, refetch }: any) => {
  const {
    nombre,
    director,
    direccion,
    foto_director,
    iglesia,
    lema,
    logo,
    tipo,
    nro_conquistadores,
    nro_gm,
  } = data;

  const columnsRedes = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },

    {
      title: "URL",
      dataIndex: "",
      key: "",
      render: (value: any) => (
        <a href={`${value.url}`} className="hover:text-yellow" target="_blank">
          {" "}
          {value.url}
        </a>
      ),
    },
  ];

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Detalle de Club</h2>
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
            Tipo
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(tipo)}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Dirección
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(direccion)}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Iglesia
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(iglesia)}
          </Typography>
        </div>
        <div className="item col-span-1">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Lema
          </Typography>
          <Typography
            type="span"
            className={clsx("ml-3 font-normal mb-2 block f-18 capitalize")}
          >
            {ValidateString(lema)}
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
      {!isEmpty(data?.redes) && (
        <div className="mt-8">
          <Typography
            type="label"
            className={clsx("ml-3 font-bold mb-2 block f-18")}
          >
            Redes
          </Typography>
          <Table
            className="table_club_miembros table_ant_custom shadow-md overflow-x-auto border-b border-gray-200 rounded-lg"
            columns={columnsRedes}
            dataSource={data?.redes}
            pagination={false}
            rowKey="redes"
          />
        </div>
      )}
      <div className="item mx-auto text-center justify-center mt-8">
        <div className="bg-yellow p-4 mx-auto max-w-[300px] rounded-md">
          <Typography
            type="title"
            className={clsx("ml-3 font-bold mb-2 block f-24")}
          >
            Director
          </Typography>
          <Typography
            type="label"
            className={clsx("ml-3 font-normal mb-2 block f-20")}
          >
            <IconWithText
              classNameContainer="justify-center gap-2"
              icon={foto_director}
              text={data?.director}
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
                {data?.cedula_director ? "CI-" + data?.cedula_director : "N/A"}
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

export default ViewClub;
