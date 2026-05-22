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
  getSession,
  routeValidForUser,
  ValidateString,
} from "lib/helper";
import { ProfilApiService } from "services";
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
  TypesSelectEnums,
  TypesSelectSexoEnums,
  TypesSelectTypoEventoCamporeeEnums,
} from "consts/typesSelectEnum";
import InscribirEntidad from "components/camporee/eventos-camporee/inscribir-entidad";
import { Collapse } from "antd";
import { ArrowCircleRightIcon } from "@heroicons/react/outline";
import { ArrowRightIcon, SaveIcon } from "@heroicons/react/solid";
import { Alert } from "components/common/alert";
import { Input } from "components/common/form/input";
import { InputCheck } from "components/common/form/input-check";
import { useToasts } from "react-toast-notifications";
import { HelpListEventCamporeeDetail } from "help/camporee/eventos-camporee/detail";
import { Help } from "components/common/help";


const { TabPane } = Tabs;

type Params = {
  id: any;
};

const classNamesForms = "w-full px-4 md:w-[550px] mx-auto md:mt-8";

const EventCamporeeDetail = () => {
  const { Modal, hide, isShow, show } = useModal();

  const router = useRouter();
  const { id } = router.query;

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

  const [isEdit, setIsEdit] = React.useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subject, setSubject] = React.useState(new Subject<string>());
  const [params, setValue] = useQueryParams<Params>({ id });
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_EVENT_CAMPOREE_BY_ID_DETAIL_ID}_${id}`],
    () => CamporeeServices.getEventCamporeeById(id)
  );
  const values = get(response, "data", []);

  const [tabs, setTabs] = React.useState<any>();

  const findInforme = (mes: string) => {
    if (!isEmpty(response?.data?.informes)) {
      const informe = response?.data?.informes[0]?.informes?.find(
        (item: any) => item.mes === mes
      );

      // console.log("el informe", informe);
      return informe;
    }
  };

  React.useEffect(() => {
    if (!isNil(response) && response?.data?.meses) {
      const aux: any = [];
      response?.data?.meses?.forEach((item: any, index: number) => {
        const informe = findInforme(item.value);
        aux.push({
          name: item.mes,
          component: (
            <InformeForm
              refetch={refetch}
              informe={informe ? informe : null}
              isAvailable={item?.activo}
              idPrecamporee={id}
              isRecurrent
              mes={item.value}
              className={classNamesForms}
							idCamporee={response?.data?.id_camporee}
            />
          ),
          current: index === 0 ? true : false,
        });
      });
      setTabs([...aux]);
    }
  }, [response]);

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

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "puntuacion", // unique name for your Field Array
    }
  );

  const handleShowInscription = (isEdit?: boolean) => {
    // setDataApprove(id);
    if (isEdit) setIsEdit(true);
    showInscription();
  };

  const isFirmado = (informe: any) => {
    switch (dataUser?.scope_actual) {
      case RoleEnums.ANCIANO: {
        return informe?.firma_anciano;
      }
      case RoleEnums.PRESIDENTE_CONSEJO: {
        return informe?.firma_consejo_regional;
      }
      case RoleEnums.PASTOR: {
        return informe?.firma_pastor;
      }
    }
  };

  const callback = (key: any) => {

  };

  const columnsMiembros = [
    {
      title: "Nombres",
      dataIndex: "nombres",
      key: "nombres",
    },
    {
      title: "Apellidos",
      dataIndex: "apellidos",
      key: "apellidos",
    },
    {
      title: "Cedula",
      dataIndex: "cedula",
      key: "cedula",
    },
    {
      title: "Sexo",
      dataIndex: "sexo",
      key: "sexo",
      render: (sexo: any) => {
        return (
          <>
            <span
              className={clsx({
                "text-[deeppink]": sexo === "F",
                "text-[blue]": sexo === "M",
              })}
            >
              {sexo === "F" ? "Femenino" : "Masculino"}
            </span>
          </>
        );
      },
    },
    {
      title: "Categoria",
      dataIndex: "categoria",
      key: "categoria",
    },
  ];

  const getPuntuacion = (item: any) => {
    if (dataUser.scope_actual === RoleEnums.PRESIDENTE_CONSEJO) {
      return item.puntuacion_eliminatoria;
    } else if (dataUser.scope_actual === RoleEnums.LIDER_JUVENIL) {
      return item.puntuacion;
    }
  };

  const handleSubmitData = (data: any) => {

    let finalData: any = [];

    let clasificadoIdEntidad = data?.clasificado?.map(
      (item: any, index: any) => {
        if (Boolean(item)) {
          return values?.datos_inscripcion[index]?.id_entidad;
        }
      }
    );
    //Eliminar vacios, undefined y null
    clasificadoIdEntidad = clasificadoIdEntidad?.filter((item: any) => item);
    let puntuacionIdEntidad = data.puntuacion?.map((item: any, index: any) => {
      if (!isEmpty(item)) {
        return values?.datos_inscripcion[index]?.id_entidad;
      }
    });

    //Eliminar vacios, undefined y null
    puntuacionIdEntidad = puntuacionIdEntidad?.filter((item: any) => item);
    let puntuacionParseInt = data?.puntuacion?.map((item: any) => {
      if (!isEmpty(item)) {
        return parseInt(item);
      }
    });
    //Eliminar vacios, undefined y null
    puntuacionParseInt = puntuacionParseInt?.filter((item: any) => item);

    let FinalData: any = {};
    let Fetch: any = Promise;

    if (dataUser.scope_actual === RoleEnums.PRESIDENTE_CONSEJO) {
      FinalData = {
        puntuacion: [...puntuacionParseInt],
        id_clubes: [...puntuacionIdEntidad],
        clasificados: [...clasificadoIdEntidad],
        id_camporee_evento: parseInt(id as any),
      };
      Fetch = CamporeeServices.LoadScoreCamporeeEventClub(FinalData);
    } else if (dataUser.scope_actual === RoleEnums.LIDER_JUVENIL) {
      FinalData = {
        puntuacion: [...puntuacionParseInt],
        id_entidad: [...puntuacionIdEntidad],
        id_camporee_evento: parseInt(id as any),
      };
      Fetch = CamporeeServices.LoadScoreCamporeeEvent(FinalData);
    }

    Fetch.then((response: any) => {
      addToast("Datos cargados exitosamente", {
        appearance: "success",
      });
      refetch();
      hide();
      // setIsLoading(false);
    }).catch((e: any) => {
      console.log("Error: ", e);
      GenerateErrorToast(e, addToast);
      // setIsLoading(false);
    });
  };

  const isPermitted = () => {
    if (
      values?.calificable &&
      dataUser.scope_actual === RoleEnums.PRESIDENTE_CONSEJO &&
      !values?.inscripcion_federacion
    ) {
      return true;
    } else if (
      values?.calificable &&
      dataUser.scope_actual !== RoleEnums.PRESIDENTE_CONSEJO
    ) {
      return true;
    } else {
      return true;
      // return false;
    }
  };

  const actionIsPermitted = () => {
    if (
      (!values?.inscripcion_federacion &&
        values?.eliminatoria &&
        dataUser.scope_actual === RoleEnums.PRESIDENTE_CONSEJO) ||
      dataUser.scope_actual !== RoleEnums.PRESIDENTE_CONSEJO
    ) {
      return true;
    }
  };

  return (
    <LayoutDashboard title="Detalle Evento">
      <div className="lg:px-20 mt-12">
        <div className="flex flex-wrap justify-center flex-row">
          {isLoading ? (
            <Spinner type="loadingPage" className="py-10" />
          ) : (
            <>
              <Back />

              <Help showModal={showHelp} />
              <div className="item flex flex-col gap-2 text-center justify-center w-full mt-8">
                <Typography
                  type="label"
                  className={clsx(
                    "ml-3 font-bold mb-2 mt-3 block text-primary text-3xl"
                  )}
                >
                  {`${values?.nombre}`}
                </Typography>
              </div>
              <div className="container-form justify-center w-full mt-16 gap-x-6 gap-y-10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 text-left ">
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Descripcion
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {ValidateString(values?.descripcion)}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Categoria
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.categoria}
                  </Typography>
                </div>

                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Tipo evento
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.inscripcion_federacion
                      ? TypesSelectTypoEventoCamporeeEnums.FEDERACION
                      : TypesSelectTypoEventoCamporeeEnums.CLUBES}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Eliminatoria
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.eliminatoria ? (
                      <span className="text-secondary font-bold">SI</span>
                    ) : (
                      <span className="text-alert-error font-bold">NO</span>
                    )}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Realizado
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.realizado ? (
                      <span className="text-secondary font-bold">SI</span>
                    ) : (
                      <span className="text-alert-error font-bold">NO</span>
                    )}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Puntuación maxima
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.puntuacion_maxima}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Oro
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.oro}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Plata
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.plata}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Bronce
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.bronce}
                  </Typography>
                </div>
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Hierro
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.hierro}
                  </Typography>
                </div>
                {(values?.tipo === TypesSelectEnums.CONQUISTADORES ||
                  values?.tipo === TypesSelectEnums.INTEGRADO) && (
                  <>
                    {(values?.distincion_sexo ===
                      TypesSelectSexoEnums.HOMBRES ||
                      values?.distincion_sexo === TypesSelectSexoEnums.AMBOS ||
                      values?.distincion_sexo ===
                        TypesSelectSexoEnums.SIN_DISTINCION) && (
                      <div className="item col-span-1">
                        <Typography
                          type="label"
                          className={clsx("ml-3 font-bold mb-2 block f-18")}
                        >
                          Nro. Conquistadores{" "}
                          {values?.distincion_sexo !==
                            TypesSelectSexoEnums.SIN_DISTINCION && "Hombres"}
                        </Typography>
                        <Typography
                          type="span"
                          className={clsx("ml-3 font-normal mb-2 block f-18")}
                        >
                          {values?.participantes_conquis_aventureros_m}
                        </Typography>
                      </div>
                    )}
                    {(values?.distincion_sexo ===
                      TypesSelectSexoEnums.MUJERES ||
                      values?.distincion_sexo ===
                        TypesSelectSexoEnums.AMBOS) && (
                      <div className="item col-span-1">
                        <Typography
                          type="label"
                          className={clsx("ml-3 font-bold mb-2 block f-18")}
                        >
                          Nro. Conquistadores Mujeres
                        </Typography>
                        <Typography
                          type="span"
                          className={clsx("ml-3 font-normal mb-2 block f-18")}
                        >
                          {values?.participantes_conquis_aventureros_f}
                        </Typography>
                      </div>
                    )}
                  </>
                )}

                {(values?.tipo === TypesSelectEnums.GUIAS_MAYORES ||
                  values?.tipo === TypesSelectEnums.INTEGRADO) && (
                  <>
                    {(values?.distincion_sexo ===
                      TypesSelectSexoEnums.HOMBRES ||
                      values?.distincion_sexo === TypesSelectSexoEnums.AMBOS ||
                      values?.distincion_sexo ===
                        TypesSelectSexoEnums.SIN_DISTINCION) && (
                      <div className="item col-span-1">
                        <Typography
                          type="label"
                          className={clsx("ml-3 font-bold mb-2 block f-18")}
                        >
                          Nro. Guias Mayores{" "}
                          {values?.distincion_sexo !==
                            TypesSelectSexoEnums.SIN_DISTINCION && "Hombres"}
                        </Typography>
                        <Typography
                          type="span"
                          className={clsx("ml-3 font-normal mb-2 block f-18")}
                        >
                          {values?.participantes_guias_mayores_m}
                        </Typography>
                      </div>
                    )}
                    {(values?.distincion_sexo ===
                      TypesSelectSexoEnums.MUJERES ||
                      values?.distincion_sexo ===
                        TypesSelectSexoEnums.AMBOS) && (
                      <div className="item col-span-1">
                        <Typography
                          type="label"
                          className={clsx("ml-3 font-bold mb-2 block f-18")}
                        >
                          Nro. Guias Mayores Mujeres
                        </Typography>
                        <Typography
                          type="span"
                          className={clsx("ml-3 font-normal mb-2 block f-18")}
                        >
                          {values?.participantes_guias_mayores_f}
                        </Typography>
                      </div>
                    )}
                  </>
                )}

                {values?.tipo === TypesSelectEnums.AVENTUREROS && (
                  <>
                    {(values?.distincion_sexo ===
                      TypesSelectSexoEnums.HOMBRES ||
                      values?.distincion_sexo === TypesSelectSexoEnums.AMBOS ||
                      values?.distincion_sexo ===
                        TypesSelectSexoEnums.SIN_DISTINCION) && (
                      <div className="item col-span-1">
                        <Typography
                          type="label"
                          className={clsx("ml-3 font-bold mb-2 block f-18")}
                        >
                          Nro. Aventureros{" "}
                          {values?.distincion_sexo !==
                            TypesSelectSexoEnums.SIN_DISTINCION && "Niños"}
                        </Typography>
                        <Typography
                          type="span"
                          className={clsx("ml-3 font-normal mb-2 block f-18")}
                        >
                          {values?.participantes_conquis_aventureros_m}
                        </Typography>
                      </div>
                    )}
                    {(values?.distincion_sexo ===
                      TypesSelectSexoEnums.MUJERES ||
                      values?.distincion_sexo ===
                        TypesSelectSexoEnums.AMBOS) && (
                      <div className="item col-span-1">
                        <Typography
                          type="label"
                          className={clsx("ml-3 font-bold mb-2 block f-18")}
                        >
                          Nro. Aventureras Niñas
                        </Typography>
                        <Typography
                          type="span"
                          className={clsx("ml-3 font-normal mb-2 block f-18")}
                        >
                          {values?.participantes_conquis_aventureros_f}
                        </Typography>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* <Restricted
                module={ModuleEnums.EVENTO_CAMPOREE}
                typePermisse={PermissionsEnums.VIEW_CLUBES_INSCRITOS}
              > */}
              {!isEmpty(values?.datos_inscripcion) && (
                <form
                  onSubmit={handleSubmit(handleSubmitData)}
                  className="w-full"
                >
                  {values?.calificable && !isEmpty(values?.datos_inscripcion) && (
                    <Restricted
                      module={ModuleEnums.EVENTO_CAMPOREE}
                      typePermisse={PermissionsEnums.LOAD_SCORE}
                    >
                      {actionIsPermitted() && (
                        <Button
                          labelProps="text-xs font-normal"
                          label={"Guardar"}
                          fill
                          boderRadius="rounded-full"
                          size="full"
                          type="submit"
                          sizesButton="py-2 px-1"
                          className="fixed  bottom-16 right-8 z-10 max-w-[80px]"
                        />
                      )}
                    </Restricted>
                  )}
                  {!isEmpty(values?.datos_inscripcion) && (
                    <Collapse
                      defaultActiveKey={["1"]}
                      onChange={callback}
                      className="w-full custom-collapse"
                      collapsible="header"
                      expandIcon={({ isActive }) => (
                        <ArrowRightIcon
                          className={clsx("w-10 h-10", {
                            "rotate-90": isActive,
                          })}
                        />
                      )}
                      items={values?.datos_inscripcion
                        ?.filter((itemClub: any) => itemClub?.inscrito)
                        ?.map((itemClub: any, index: any) => ({
                          key: index,
                          label: (
                            // <div className="item bg-yellow flex text-center justify-between pl-24 pr-3 w-full">
                            <div className="flex items-center">
                              {itemClub?.observacion && (
                                <div className="w-5 h-5 rounded-full bg-alert-error"></div>
                              )}
                              <Typography
                                type="label"
                                className={clsx(
                                  "font-bold block text-primary text-3xl px-2 py-3 cursor-pointer"
                                )}
                              >
                                {itemClub?.nombre}
                              </Typography>
                            </div>
                            // </div>
                          ),
                          extra: (
                            <>
                              {isPermitted() && (
                                <div className="justify-items-end gap-4 z-50 flex-initial flex items-center">
                                  <Restricted
                                    module={ModuleEnums.EVENTO_CAMPOREE}
                                    typePermisse={PermissionsEnums.LOAD_SCORE}
                                  >
                                    {actionIsPermitted() && (
                                      <Input
                                        name={`puntuacion[${index}]`}
                                        title="Puntuación"
                                        defaultValue={getPuntuacion(itemClub)}
                                        disabled={
                                          !values?.calificable ||
                                          (!itemClub.clasificado &&
                                            dataUser.scope_actual ==
                                              RoleEnums.LIDER_JUVENIL)
                                        }
                                        type="number"
                                        // labelVisible
                                        isFill={
                                          !!watch(`puntuacion[${index}]`)
                                        }
                                        register={register}
                                        rules={rules.puntuacion}
                                        error={errors.puntuacion}
                                        isArray
                                        arrayIndex={index}
                                        className="placeholder:font-bold placeholder:text-[black] text-[black] font-bold disabled:text-[black]"
                                        otherStyles="pt-3 pb-3 rounded-full text-sm disabled:bg-[#fff8f8]"
                                      />
                                    )}
                                  </Restricted>
                                  <Restricted
                                    module={ModuleEnums.EVENTO_CAMPOREE}
                                    typePermisse={
                                      PermissionsEnums.CHECK_CLASIFICATION
                                    }
                                  >
                                    {actionIsPermitted() && (
                                      <InputCheck
                                        name={`clasificado[${index}]`}
                                        title="Clasificado"
                                        defaultChecked={
                                          itemClub?.clasificado
                                        }
                                        disabled={!values?.calificable}
                                        labelVisible
                                        isFill={
                                          !!watch(`clasificado[${index}]`)
                                        }
                                        register={register}
                                        rules={rules.clasificado}
                                        error={errors.clasificado}
                                        otherStyles="pt-3 pb-3 rounded-full text-sm disabled:bg-[#0c0c0c9e]"
                                      >
                                        Clasificado
                                      </InputCheck>
                                    )}
                                  </Restricted>
                                </div>
                              )}
                            </>
                          ),
                          className: "custom-collapse-header",
                          children: (
                            <>
                              {itemClub?.observacion && (
                                <Alert
                                  color="danger"
                                  message="Observación pendiente"
                                  className="mb-5"
                                />
                              )}
                              <div className="container-form shadow-md pb-10 px-5 w-fullS">
                                <div className="gap-x-6 gap-y-10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 text-left ">
                                  <React.Fragment key={index}>
                                    <div className="item col-span-1">
                                      <Typography
                                        type="label"
                                        className={clsx(
                                          "ml-3 font-bold mb-2 block f-18"
                                        )}
                                      >
                                        Nivel
                                      </Typography>
                                      <Typography
                                        type="span"
                                        className={clsx(
                                          "ml-3 font-normal mb-2 block f-18"
                                        )}
                                      >
                                        {itemClub?.nivel}
                                      </Typography>
                                    </div>
                                    {!values?.inscripcion_federacion &&
                                      values?.eliminatoria && (
                                        <div className="item col-span-1">
                                          <Typography
                                            type="label"
                                            className={clsx(
                                              "ml-3 font-bold mb-2 block f-18"
                                            )}
                                          >
                                            Clasificado
                                          </Typography>
                                          <Typography
                                            type="span"
                                            className={clsx(
                                              "ml-3 font-normal mb-2 block f-18"
                                            )}
                                          >
                                            {itemClub?.clasificado ? (
                                              <span className="text-secondary font-bold">
                                                SI
                                              </span>
                                            ) : (
                                              <span className="text-alert-error font-bold">
                                                NO
                                              </span>
                                            )}
                                          </Typography>
                                        </div>
                                      )}

                                    <div className="item col-span-1">
                                      <Typography
                                        type="label"
                                        className={clsx(
                                          "ml-3 font-bold mb-2 block f-18"
                                        )}
                                      >
                                        Puntuación
                                      </Typography>
                                      <Typography
                                        type="span"
                                        className={clsx(
                                          "ml-3 font-normal mb-2 block f-18"
                                        )}
                                      >
                                        {itemClub?.puntuacion
                                          ? itemClub?.puntuacion
                                          : "N/A"}
                                      </Typography>
                                    </div>
                                    {!values?.inscripcion_federacion &&
                                      values?.eliminatoria && (
                                        <div className="item col-span-1">
                                          <Typography
                                            type="label"
                                            className={clsx(
                                              "ml-3 font-bold mb-2 block f-18"
                                            )}
                                          >
                                            Puntuación Eliminatoria
                                          </Typography>
                                          <Typography
                                            type="span"
                                            className={clsx(
                                              "ml-3 font-normal mb-2 block f-18"
                                            )}
                                          >
                                            {itemClub?.puntuacion_eliminatoria
                                              ? itemClub?.puntuacion_eliminatoria
                                              : "N/A"}
                                          </Typography>
                                        </div>
                                      )}
                                    {!isEmpty(itemClub?.participantes) && (
                                      <div className="item col-span-full">
                                        <>
                                          <Typography
                                            type="label"
                                            className={clsx(
                                              "ml-3 font-bold mb-2 block f-18"
                                            )}
                                          >
                                            Participantes
                                          </Typography>

                                          <Table
                                            columns={columnsMiembros}
                                            dataSource={itemClub?.participantes}
                                            className="table_club_miembros w-full table_ant_custom shadow-md overflow-x-auto border-b border-gray-200 rounded-lg"
                                            pagination={false}
                                            rowKey="cedula"
                                          />
                                        </>
                                      </div>
                                    )}
                                  </React.Fragment>
                                </div>
                              </div>
                            </>
                          ),
                        }))}
                    />
                  )}
                </form>
              )}

              {/* </Restricted> */}
            </>
          )}
          <Restricted
            module={ModuleEnums.EVENTO_CAMPOREE}
            typePermisse={PermissionsEnums.INSCRIBIR_CLUB}
          >
            {!isNil(values?.datos_inscripcion) &&
              !isEmpty(values?.datos_inscripcion) && (
                <>
                  {!values?.datos_inscripcion[0]?.inscrito &&
                    values?.datos_inscripcion[0]?.inscribible && (
                      <div className="mt-10  mb-20 justify-center text-center flex w-full">
                        <Button
                          labelProps="f-18 font-bold text-[black]"
                          label={
                            dataUser?.scope_actual ===
                            RoleEnums.PRESIDENTE_CONSEJO
                              ? "Inscribir Consejo"
                              : "Inscribir club"
                          }
                          fill
                          className="bg-yellow  border-yellow  max-w-[200px]"
                          boderRadius="rounded-full"
                          size="full"
                          sizesButton="py-3"
                          onClick={() => handleShowInscription()}
                        />
                      </div>
                    )}

                  {values?.datos_inscripcion[0]?.inscrito &&
                    values?.datos_inscripcion[0]?.inscribible && (
                      <div className="mt-10 mb-20  justify-center text-center flex w-full">
                        <Button
                          labelProps="f-18 font-bold text-[black]"
                          label={"Editar inscripcion"}
                          fill
                          className="bg-yellow  border-yellow  max-w-[200px]"
                          boderRadius="rounded-full"
                          size="full"
                          sizesButton="py-3"
                          onClick={() => handleShowInscription(true)}
                        />
                      </div>
                    )}
                </>
              )}
          </Restricted>
        </div>
      </div>
      <ModalInscription isShow={isShowInscription}>
        <InscribirEntidad
          hide={hideInscription}
          data={values}
          isEdit={isEdit}
          // id_camporee_evento={id}
          refetch={refetch}
        />
      </ModalInscription>
      <ModalHelp isShow={isShowHelp}>
        <HelpListEventCamporeeDetail hide={hideHelp} />
      </ModalHelp>
    </LayoutDashboard>
  );
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
    ModuleEnums.EVENTO_CAMPOREE
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

export default EventCamporeeDetail;
