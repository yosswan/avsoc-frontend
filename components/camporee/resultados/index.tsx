import { LayoutDashboard } from "components/layout";
import { useModal } from "hooks/modal";
import { GetServerSideProps } from "next";

import * as React from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { UseQueryEnums } from "consts/useQueryEnums";
import { useQuery } from "react-query";
import { Spinner } from "components/common/spinner/spinner";
import { useQueryParams } from "consts/query.helper";
import { get, isNil, isEmpty } from "lodash";
import { Subject } from "rxjs";
import { CamporeeServices } from "services/Camporee";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import {
  GenerateErrorToast,
  routeValidForUser,
  ValidateString,
} from "lib/helper";
import { ConsejosRegionalesServices, ProfilApiService } from "services";
import Restricted from "context/PermissionProvider/Restricted";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Typography } from "components/common/typography";
import { InformeForm } from "components/events/precamporee/form-informe";
import { Button } from "components/common/button";
import { useUser } from "hooks/user";
import { RoleEnums } from "consts/rolesEnum";
import Back from "components/common/back";
import { Table, Tabs } from "antd";
import {
  TypesSelectSexoEnums,
  TypesSelectTypoEventoCamporeeEnums,
} from "consts/typesSelectEnum";
import InscribirEntidad from "components/camporee/eventos-camporee/inscribir-entidad";
import { Collapse } from "antd";
import {
  ArrowRightIcon,
  MinusIcon,
  PlusIcon,
  SaveIcon,
  StarIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import { HelpResultadosCamporee } from "help/camporee/resultados";
import { Alert } from "components/common/alert";
import { Input } from "components/common/form/input";
import { InputCheck } from "components/common/form/input-check";
import { useToasts } from "react-toast-notifications";
import { Icon } from "components/icon";
import { Icons } from "consts";
import { InputText } from "components/common/form/input-text";
import { SelectInput } from "components/common/form/select/SelectInput";
import { CategoryTypeMap } from "consts/categoryEnumSelect";
import { Progress } from "antd";
import { start } from "repl";
import { LightHelp } from "components/common/help/light";
import { DownloadFile } from "./download";
import { TableSkeleton } from "components/common/skeleton";
const { Panel } = Collapse;
const { TabPane } = Tabs;

type Params = {
  idCamporee: any;
  categoria: any;
  id_club: any;
  id_consejo: any;
  id_camporee_evento: any;
  id_camporee_precamporee: any;
};

const classNamesForms = "w-full px-4 md:w-[550px] mx-auto md:mt-8";

const ResultadosCamporee = ({ idCamporee, className, festival=false }: any) => {
  const { Modal, hide, isShow, show } = useModal();
  const router = useRouter();

  const {
    Modal: ModalInscription,
    hide: hideInscription,
    isShow: isShowInscription,
    show: showInscription,
  } = useModal();
  const {
    Modal: ModalHelp,
    hide: hideHelp,
    isShow: isShowHelp,
    show: showHelp,
  } = useModal();

  const { addToast } = useToasts();

  const profile = useUser();

  const dataUser = get(profile, "data", []);

  const [onSearch, setOnSearch] = React.useState(false);
  const [clubesType, setClubesType] = React.useState<any>({});
  const [clubesTypeMap, setClubesTypeMap] = React.useState<any>({});
  const [consejosTypeMap, setConsejosTypeMap] = React.useState<any>({});
  const [eventoPrecamporeeTypeMap, setEventoPrecamporeeTypeMap] =
    React.useState<any>({});
  const [eventoCamporeeTypeMap, setEventoCamporeeTypeMap] = React.useState<any>(
    {}
  );
  const [isEdit, setIsEdit] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subject, setSubject] = React.useState(new Subject<string>());
  const [params, setValue] = useQueryParams<Params>({ idCamporee });
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_ALL_INFORMES_CAMPOREE}_${idCamporee}`, params],
    () => CamporeeServices.getAllResultados(params)
  );

  const {
    data: clubesFilter,
    isLoading: isLoadingClubesFilter,
    refetch: refetchClubesFilter,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_ALL_CLUBES_TYPE}_${idCamporee}`],
    () => CamporeeServices.getAllClubesType(idCamporee)
  );

  const {
    data: consejosFilter,
    isLoading: isLoadingConsejosFilter,
    refetch: refetchConsejosFilter,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_ALL_CONSEJOS_TYPE}_${idCamporee}`],
    () => ConsejosRegionalesServices.getAll(idCamporee)
  );

  const {
    data: camporeeFilter,
    isLoading: isLoadingCamporeeFilter,
    refetch: refetchCamporeeFilter,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_ALL_EVENTO_CAMPOREE_TYPE}_${idCamporee}`],
    () => CamporeeServices.getAllCamporeeType(idCamporee)
  );

  const {
    data: precamporeeFilter,
    isLoading: isLoadingPrecamporeeFilter,
    refetch: refetchPrecamporeeFilter,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_ALL_EVENTO_PRECAMPOREE_TYPE}_${idCamporee}`],
    () => CamporeeServices.getAllPreCamporeeType(idCamporee)
  );

  const values = get(response, "data", []);

  const [tabs, setTabs] = React.useState<any>();
  const updateQuery = (key: string, value: number | string | undefined) => {
    setValue({ [key]: value });
  };

  React.useEffect(() => {
    if (!isLoadingClubesFilter) {
      const aux: any = {};

      clubesFilter.data.map((item: any) => {
        aux[item.id] = item.nombre;
      });
      setClubesTypeMap(aux);
    }
  }, [clubesFilter]);

  React.useEffect(() => {
    if (!isLoadingConsejosFilter) {
      const aux: any = {};

      consejosFilter.data.map((item: any) => {
        aux[item.id] = item.nombre;
      });
      setConsejosTypeMap(aux);
    }
  }, [consejosFilter]);

  React.useEffect(() => {
    if (!isLoadingCamporeeFilter) {
      const aux: any = {};

      camporeeFilter.data.map((item: any) => {
        aux[item.id] = item.nombre;
      });
      setEventoCamporeeTypeMap(aux);
    }
  }, [camporeeFilter]);

  React.useEffect(() => {
    if (!isLoadingPrecamporeeFilter) {
      const aux: any = {};

      precamporeeFilter.data.map((item: any) => {
        aux[item.id] = item.nombre;
      });
      setEventoPrecamporeeTypeMap(aux);
    }
  }, [precamporeeFilter]);

  const findInforme = (mes: string) => {
    if (!isEmpty(response?.data?.informes)) {
      const informe = response?.data?.informes[0]?.informes?.find(
        (item: any) => item.mes === mes
      );

      // console.log("el informe", informe);
      return informe;
    }
  };

  // React.useEffect(() => {
  //   if (!isNil(response) && response?.data?.meses) {
  //     const aux: any = [];
  //     response?.data?.meses?.forEach((item: any, index: number) => {
  //       const informe = findInforme(item.value);
  //       console.log("el infomre lleg", informe);
  //       aux.push({
  //         name: item.mes,
  //         component: (
  //           <InformeForm
  //             refetch={refetch}
  //             informe={informe ? informe : null}
  //             isAvailable={item?.activo}
  //             idPrecamporee={id}
  //             isRecurrent
  //             mes={item.value}
  //             className={classNamesForms}
  //           />
  //         ),
  //         current: index === 0 ? true : false,
  //       });
  //     });
  //     setTabs([...aux]);
  //   }
  // }, [response]);

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    control,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });
  const rules = {
    puntuacion: {
      // required: { value: true, message: "Este campo es requerido" },
      max: {
        value: values?.puntuacion_maxima,
        message: `Debe ser menor o igual a ${values?.puntuacion_maxima}`,
      },
    },
    clasificado: {
      // required: { value: true, message: "Este campo es requerido" },
    },
  };

  const handleChangeSearch = (e: any) => {
    const value = e.target.value;
    setOnSearch(true);
    return subject.next(value);
  };

  const howManyStarts = (text: string) => {
    const start = text.split(" ");

    return parseInt(start[0]);
  };

  const paintStarts = (text: string) => {
    const quantityStarts = howManyStarts(text);
    for (let i = 0; i < 5; i++) {
      <StarIcon
        className={clsx("w-5", { "opacity-50": i > quantityStarts })}
      ></StarIcon>;
    }
  };

  const dataColumns = () => {
    if (
      dataUser.scope_actual === RoleEnums.LIDER_JUVENIL ||
			dataUser.scope_actual === RoleEnums.DIRECTOR
    ) {
      return [
        {
          title: `${values?.tipo === "clubes" ? "Club" : "Consejo"}`,
          dataIndex: "nombre",
          key: "id",
        },
        // Table.EXPAND_COLUMN,
        {
          title: "Nivel",
          dataIndex: "",
          key: "",
          // width: "30%",
          render: (values: any) => (
            <div className="flex gap-1 items-center">
              {values?.level &&
                (() => {
                  const quantityStarts = howManyStarts(values.level);
                  let starts: any = [];
                  for (let i = 0; i < 5; i++) {
                    starts.push(
                      <StarIcon
                        className={clsx("w-5", {
                          "opacity-50": i >= quantityStarts,
                        })}
                      ></StarIcon>
                    );
                  }
                  return starts;
                })()}
            </div>
          ),
        },

        {
          title: "Puntuación",
          dataIndex: "puntuacion",
          key: "puntuacion",
        },
				{
					title: "Puntuación Máxima",
					dataIndex: "puntuacion_maxima",
					key: "puntuacion_maxima",
				},
        {
          title: "Puntuación porcentual",
          dataIndex: "",
          key: "",
          // width: "30%",
          render: (values: any) =>
            values?.puntuacion_porcentual && (
              <Progress size="small" percent={values?.puntuacion_porcentual} />
            ),
        },
      ];
    }

    return [
      {
        title: `${values?.tipo === "clubes" ? "Club" : "Consejo"}`,
        dataIndex: "nombre",
        key: "id",
      },
      // Table.EXPAND_COLUMN,
      {
        title: "Nivel",
        dataIndex: "",
        key: "",
        // width: "30%",
        render: (values: any) => (
          <div className="flex gap-1 items-center">
            {values?.level &&
              (() => {
                const quantityStarts = howManyStarts(values.level);
                let starts: any = [];
                for (let i = 0; i < 5; i++) {
                  starts.push(
                    <StarIcon
                      className={clsx("w-5", {
                        "opacity-50": i >= quantityStarts,
                      })}
                    ></StarIcon>
                  );
                }
                return starts;
              })()}
          </div>
        ),
      },
      {
        title: "Puntuación porcentual",
        dataIndex: "",
        key: "",
        // width: "30%",
        render: (values: any) =>
          values?.puntuacion_porcentual && (
            <Progress size="small" percent={values?.puntuacion_porcentual} />
          ),
      },
    ];
  };
  const columns = dataColumns();

  const columnsMiembros = [
    {
      title: "Tipo",
      dataIndex: "tipo",
      key: "tipo",
    },
    {
      title: "Nivel",
      dataIndex: "",
      key: "",
      // width: "30%",
      render: (values: any) => (
        <div className="flex gap-1 items-center">
          {values?.level &&
            (() => {
              const quantityStarts = howManyStarts(values.level);
              let starts: any = [];
              for (let i = 0; i < 5; i++) {
                starts.push(
                  <StarIcon
                    className={clsx("w-5", {
                      "opacity-50": i >= quantityStarts,
                    })}
                  ></StarIcon>
                );
              }
              return starts;
            })()}
        </div>
      ),
    },
		{
			title: "Puntuación",
			dataIndex: "puntuacion",
			key: "puntuacion",
		},
		{
			title: "Puntuación Máxima",
			dataIndex: "puntuacion_maxima",
			key: "puntuacion_maxima",
		},
    {
      title: "Puntuación porcentual",
      dataIndex: "",
      key: "",
      // width: "30%",
      render: (values: any) =>
        values?.puntuacion_porcentual && (
          <Progress size="small" percent={values?.puntuacion_porcentual} />
        ),
    },
  ];

  const expandedTableItems = (allData: any) => {
    return (
      <Table
        columns={columnsMiembros}
        dataSource={allData.items}
        pagination={false}
        rowKey="items"
        expandable={{
          expandedRowRender: (record) => {
            if (record?.items) {
              return expandedTableItems(record);
            }
          },
          rowExpandable: (record) => record.items,
        }}
      />
    );
  };

	const downloadSecureFile = async () => {
		try {
			const response = await CamporeeServices.getResultadosFile(params);

			// 1. Crear un enlace temporal en la memoria del navegador
			const url = window.URL.createObjectURL(new Blob([response.data]));
			
			// 2. Crear un elemento <a> oculto para disparar la descarga
			const link = document.createElement('a');
			link.href = url;
			
			// Obtener el nombre del archivo desde el header 'content-disposition'
			const contentDisposition = response.headers['content-disposition'];
			const fileNameMatch = contentDisposition.match(/filename=(.+)/);
			const fileName = fileNameMatch[1];
			
			link.setAttribute('download', fileName);
			document.body.appendChild(link);
			
			// 3. Ejecutar la descarga y limpiar
			link.click();
			link.remove();
			window.URL.revokeObjectURL(url); // Liberar memoria
			
		} catch (error) {
			console.error('Error al descargar el archivo:', error);
		}
	};

  return (
    <>
      <div className="text-center w-full">
        <div className={clsx("container-form mb-40 text-left", className)}>
							<div className="flex justify-end mb-6 items-center w-full">
								<DownloadFile download={downloadSecureFile} />
								<LightHelp showModal={showHelp} />
							</div>
              <div className="flex flex-wrap gap-x-4 w-full">
                <SelectInput
                  className="mb-10 z-50 flex-auto"
                  name="categoria"
                  label="Categoria"
                  options={CategoryTypeMap}
                  maxwidth="max-w-[208px]"
                  value={params.categoria}
                  setValue={updateQuery}
                ></SelectInput>
                <SelectInput
                  className="mb-10 z-50 flex-auto"
                  name="id_club"
                  label="Club"
                  options={clubesTypeMap}
                  maxwidth="max-w-[208px]"
                  value={params.id_club}
                  setValue={updateQuery}
                ></SelectInput>
                <SelectInput
                  className="mb-10 z-50 flex-auto"
                  name="id_consejo"
                  label="Consejos regionales"
                  options={consejosTypeMap}
                  maxwidth="max-w-[208px]"
                  value={params.id_consejo}
                  setValue={updateQuery}
                ></SelectInput>
                <SelectInput
                  className="mb-10 z-50 flex-auto"
                  name="id_camporee_evento"
                  label={festival ? 'Evento festival' : 'Evento camporee'}
                  options={eventoCamporeeTypeMap}
                  maxwidth="max-w-[208px]"
                  value={params.id_camporee_evento}
                  setValue={updateQuery}
                ></SelectInput>
                <SelectInput
                  className="mb-10 z-50 flex-auto"
                  name="id_camporee_precamporee"
                  label={festival ? 'Evento prefestival' : 'Evento precamporee'}
                  options={eventoPrecamporeeTypeMap}
                  maxwidth="max-w-[208px]"
                  value={params.id_camporee_precamporee}
                  setValue={updateQuery}
                ></SelectInput>
              </div>
							{isLoading ? (
                <TableSkeleton rows={10} columns={4} />
              ) : (
              <Table
                columns={columns}
                dataSource={values?.entidades}
                pagination={false}
                rowKey="id_club"
                className="table_club_miembros table_ant_custom shadow-md overflow-x-auto border-b border-gray-200 rounded-lg"
                expandable={{
                  expandedRowRender: (record) => {
                    if (record?.items) {
                      return expandedTableItems(record);
                    }
                  },
                  rowExpandable: (record) => record.items,
                }}
              />
							)}
              {/* {!isEmpty(allPrecamporee) && !isLoading ? (
                <div className="mt-10 justify-center flex">
                  <Pagination
                    currentPage={parseInt(currentPage)}
                    total={parseInt(total)}
                    limit={parseInt(limit)}
                    setPage={(value) => updateQuery("page", value)}
                  />
                </div>
              ) : (
                <div className="flex justify-center">
                  <h3 className="font-medium text-primary text-xl mt-9">
                    Empty data
                  </h3>
                </div>
              )} */}
              <ModalHelp isShow={isShowHelp}>
                <HelpResultadosCamporee hide={hideHelp} />
              </ModalHelp>
        </div>
      </div>
    </>
  );
};
export default ResultadosCamporee;
