import { InputText } from "components/common/form/input-text";
import { Icon } from "components/icon";
import { LayoutDashboard } from "components/layout";
import { appRouter, Icons } from "consts";
import { useModal } from "hooks/modal";
import { GetServerSideProps } from "next";

import * as React from "react";
import { useForm } from "react-hook-form";
import { UseQueryEnums } from "consts/useQueryEnums";
import { useQuery } from "react-query";
import { Spinner } from "components/common/spinner/spinner";
import { useQueryParams } from "consts/query.helper";
import { IconWithText } from "components/icon-with-text";
import DataTableComponent, {
  TableColumnType,
} from "components/data-table/DataTableComponent";
import { get, isNil, isEmpty } from "lodash";
import { Subject } from "rxjs";
import { CamporeeServices } from "services/Camporee";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import {
  formatDateComplete,
  getSession,
  routeValidForUser,
  ValidateImage,
  ValidateString,
} from "lib/helper";
import { ProfilApiService } from "services";
import Restricted from "context/PermissionProvider/Restricted";
import Link from "next/link";
import { useRouter } from "next/router";
// import { Tabs } from "components/common/tabs2";
import EventosPrecamporee from "components/camporee/eventos-precamporee";
import BoxInfo from "components/box-info";
import clsx from "clsx";
import { Typography } from "components/common/typography";
import { InformeForm } from "components/events/precamporee/form-informe";
import { Button } from "components/common/button";
import ApproveInforme from "components/events/precamporee/approve-informe";
import LoadScore from "components/events/precamporee/load-score";
import { useUser } from "hooks/user";
import { RoleEnums } from "consts/rolesEnum";
import PreviewImage from "components/common/preview-image";
import Back from "components/common/back";
import { Tabs } from "antd";
import moment from "moment";
import { Collapse } from "antd";
import { ArrowRightIcon, DocumentTextIcon } from "@heroicons/react/solid";
import { Alert } from "components/common/alert";
import { InformeView } from "components/events/precamporee/view-informe";
const { Panel } = Collapse;
const { TabPane } = Tabs;

type Params = {
  id: any;
};

const classNamesForms = "w-full px-4 md:max-w-[550px] mx-auto md:mt-8";

const EventPrecamporeeDetail = () => {
  const { Modal, hide, isShow, show } = useModal();

  const {
    Modal: ModalApprove,
    hide: hideApprove,
    isShow: isShowApprove,
    show: showApprove,
  } = useModal();

  const router = useRouter();
  const { id } = router.query;
  // console.log("el id:", id);
  const {
    Modal: ModalLoadScore,
    hide: hideLoadScore,
    isShow: isShowLoadScore,
    show: showLoadScore,
  } = useModal();

  const {
    Modal: ModalViewImages,
    hide: hideViewImages,
    isShow: isShowViewImages,
    show: showViewImages,
  } = useModal();
  const [dataPreview, setDataPreview] = React.useState<any>();
  const profile = useUser();

  const dataUser = get(profile, "data", []);
  // const [response, setResponse] = React.useState<any>();
  // const [isLoading, setIsLoading] = React.useState<any>(true);
  const [onSearch, setOnSearch] = React.useState(false);
  const [dataApprove, setDataApprove] = React.useState<any>();
  const [dataLoadScore, setDataLoadScore] = React.useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subject, setSubject] = React.useState(new Subject<string>());
  const [params, setValue] = useQueryParams<Params>({ id });
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>(
    [`${UseQueryEnums.GET_EVENT_PRECAMPOREE_BY_ID}_${id}`],
    () => CamporeeServices.getEventPrecamporeeById(id)
  );

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
						<div className="px-1">
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
						</div>
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
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const values = get(response, "data", []);

  const itemsCamporee = React.useMemo(() => {
    return [
      {
        icon: Icons.calendar,
        title: `${values?.fecha_inicio} a ${values?.fecha_fin}`,
      },
      {
        icon: Icons.location,
        title: (
          <>
            <strong className="text-[black]">Direccion:</strong>
            {` ${values?.lugar}`}
          </>
        ),
      },
      ,
      {
        icon: Icons.iglesia,
        title: (
          <>
            <strong className="text-[black]">Capellan:</strong>
            {` ${values?.capellan}`}
          </>
        ),
      },
      {
        icon: Icons.camporee,
        title: (
          <>
            <strong className="text-[black]">Lider juvenil:</strong>
            {` ${values?.lider_juvenil}`}
          </>
        ),
      },
    ];
  }, [response]);

  const handleShowLoadScore = (data: any) => {
    setDataLoadScore(data);
    showLoadScore();
  };
  const handleShowApprove = (id: any) => {
    setDataApprove(id);
    showApprove();
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

  const handlePreviewImage = (src: string) => {
    setDataPreview(src);
    showViewImages();
  };
  // const callback = (key: any) => {
  //   console.log(key);
  // };

  return (
    <LayoutDashboard title="Detalle Precamporee">
      <div className="lg:px-20 mt-12">
        <div className="flex flex-wrap justify-center flex-row">
          {isLoading ? (
            <Spinner type="loadingPage" className="py-10" />
          ) : (
            <>
              <Back />
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
              <div className="container-form w-full mt-16 gap-x-6 gap-y-10 grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 text-left ">
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
                    Mensual
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.mensual ? "Si" : "No"}
                  </Typography>
                </div>
                {values.meses && (
                  <div className="item col-span-1">
                    <Typography
                      type="label"
                      className={clsx("ml-3 font-bold mb-2 block f-18")}
                    >
                      Meses
                    </Typography>

                    <ul className="ml-3">
                      {values?.meses.map((item: any, index: any) => {
                        return <li key={index}>{item.mes}</li>;
                      })}
                    </ul>
                  </div>
                )}
								{!values.mensual && (
                  <div className="item col-span-1">
                    <Typography
                      type="label"
                      className={clsx("ml-3 font-bold mb-2 block f-18")}
                    >
                      Fecha
                    </Typography>
										<Typography
											type="span"
											className={clsx("ml-3 font-normal mb-2 block f-18")}
										>
											{
												`${moment(values?.fecha_inicio).format(formatDateComplete)} a ${moment(values?.fecha_fin).format(formatDateComplete)}`
											}
										</Typography>
                  </div>
                )}
                <div className="item col-span-1">
                  <Typography
                    type="label"
                    className={clsx("ml-3 font-bold mb-2 block f-18")}
                  >
                    Puntuación máxima
                  </Typography>
                  <Typography
                    type="span"
                    className={clsx("ml-3 font-normal mb-2 block f-18")}
                  >
                    {values?.puntaje_maximo}
                  </Typography>
                </div>
                {/* <div className="item col-span-1">
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
                    {values?.realizado ? "Si" : "No"}
                  </Typography>
                </div> */}
              </div>
              <Restricted
                module={ModuleEnums.EVENTO_PRECAMPOREE}
                typePermisse={PermissionsEnums.VIEW_DATA_FORMS}
              >
                <Collapse
                  defaultActiveKey={["1"]}
                  //onChange={callback}
                  className="w-full custom-collapse"
                  collapsible="header"
                  expandIcon={({ isActive }) => (
                    <ArrowRightIcon
                      className={clsx(
                        "w-10 h-10 absolute top-0 left-5 bottom-0 m-auto",
                        {
                          "rotate-90": isActive,
                        }
                      )}
                    />
                  )}
                >
                  {values?.informes?.map((itemClub: any, index: any) => {
                    return (
                      <React.Fragment key={index}>
                        <Panel
                          header={
                            <div className={`item bg-${itemClub.pending ? 'error' : itemClub.ready ? 'success' : 'yellow'} flex text-center justify-center w-full`}>
                              <Typography
                                type="label"
                                className={clsx(
                                  "font-bold block text-primary text-3xl px-2 py-3 cursor-pointer"
                                )}
                              >
                                {itemClub?.club}
                              </Typography>
                            </div>
                          }
                          key={index}
                          // extra={
                          // 		<></>
                          //     }
                          className={`custom-collapse-header ${itemClub.pending ? 'pending' : itemClub.ready ? 'ready' : ''} justify-normal`}
                        >
													{
														values?.mensual ?
															<Tabs
																type="card"
																className="tabs-antd-custom justify-center"
															>
																{itemClub?.informes?.map(
																	(informe: any, index: any) => {
																		return (
																			<TabPane
																				tab={informe?.nombre_mes}
																				key={index}
																				className="mb-10"
																			>
																				<InformeView
																					handlePreviewImage={handlePreviewImage}
																					handleShowApprove={handleShowApprove}
																					handleShowLoadScore={handleShowLoadScore}
																					index={index}
																					informe={informe}
																					isFirmado={isFirmado}
																				/>
																			</TabPane>
																		);
																	}
																)}
															</Tabs>
														: 
															itemClub?.informes?.map(
																(informe: any, index: any) => {
																	return (
																		<InformeView
																			handlePreviewImage={handlePreviewImage}
																			handleShowApprove={handleShowApprove}
																			handleShowLoadScore={handleShowLoadScore}
																			index={index}
																			informe={informe}
																			isFirmado={isFirmado}
																		/>
																	);
																}
															)
													}
                        </Panel>
                      </React.Fragment>
                    );
                  })}
                </Collapse>
              </Restricted>
              <Restricted
                module={ModuleEnums.EVENTO_PRECAMPOREE}
                typePermisse={PermissionsEnums.LOAD_FORMS}
              >
                <div className="my-14 w-full">
                  <div className="item flex text-center justify-center w-full">
                    <Typography
                      type="label"
                      className={clsx(
                        "ml-3 font-bold mb-2 mt-3 block text-primary text-3xl"
                      )}
                    >
                      Informe{values?.meses ? "s" : ""}
                    </Typography>
                  </div>

                  {!isEmpty(values?.meses) ? (
                    <div className="mt-20 w-full mx-auto mb-20">
                      {/* {tabs && <Tabs tabs={tabs} setTabs={setTabs} /> */}
                      <Tabs
                        type="card"
                        className="tabs-antd-custom justify-center"
                      >
                        {values.meses?.map((item: any, index: number) => {
                          const informe = findInforme(item.value);
                          return (
                            <TabPane
                              tab={item?.mes}
                              key={index}
                              className="mb-10"
                            >
                              <>
                                {!isNil(informe) && (
                                  <>
                                    <div className="flex gap-2 flex-wrap">
                                      {informe?.puntuacion && (
                                        <Alert
                                          className="mb-5 bg-alert-success rounded-xl"
                                          hideIcon
                                        >
                                          <p className="text-[white] text-base py-5">
                                            Puntuación:{"  "}
                                            <span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
                                              {informe?.puntuacion}/
                                              {informe?.puntuacion_maxima}
                                            </span>
                                          </p>
                                        </Alert>
                                      )}
                                      <Alert
                                        className="mb-5 bg-primary rounded-xl"
                                        hideIcon
                                      >
                                        <p className="text-[white] text-base py-5">
                                          Firma Anciano:{"  "}
                                          <span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
                                            {informe?.firma_anciano ? (
                                              <span className="text-secondary font-bold">
                                                SI
                                              </span>
                                            ) : (
                                              <span className="text-alert-error font-bold">
                                                NO
                                              </span>
                                            )}
                                          </span>
                                        </p>
                                      </Alert>
                                      <Alert
                                        className="mb-5 bg-secondary rounded-xl"
                                        hideIcon
                                      >
                                        <p className="text-[white] text-base py-5">
                                          Firma Pastor:{"  "}
                                          <span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
                                            {informe?.firma_pastor ? (
                                              <span className="text-secondary font-bold">
                                                SI
                                              </span>
                                            ) : (
                                              <span className="text-alert-error font-bold">
                                                NO
                                              </span>
                                            )}
                                          </span>
                                        </p>
                                      </Alert>
                                      <Alert
                                        className="mb-5 bg-overlay rounded-xl"
                                        hideIcon
                                      >
                                        <p className="text-[white] text-base py-5">
                                          Firma Consejo Regional:{"  "}
                                          <span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
                                            {informe?.firma_consejo_regional ? (
                                              <span className="text-secondary font-bold">
                                                SI
                                              </span>
                                            ) : (
                                              <span className="text-alert-error font-bold">
                                                NO
                                              </span>
                                            )}
                                          </span>
                                        </p>
                                      </Alert>
																			<Alert
																				className="mb-5 bg-secondary rounded-xl"
																				hideIcon
																			>
																				<p className="text-[white] text-base py-5">
																					Fecha de envío:{" "}
																					<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
																						{informe?.fecha_enviado}
																					</span>
																				</p>
																			</Alert>
																			{informe?.observacion && (
																				<Alert className="bg-overlay rounded-xl mb-5" whiteIcon={true}>
																					<div className="flex items-center gap-2 text-[white] text-base py-5">
																						<span className="whitespace-nowrap">Observación:</span>
																						<div className="bg-white text-[black] rounded-lg px-3 py-1 text-center w-full">
																							{informe?.observacion}
																						</div>
																					</div>
																				</Alert>
																			)}
																			{informe?.alert > 0 && (
																				<Alert className=" bg-[#ffc107] rounded-xl mb-5">
																					<div className="flex items-center gap-2 text-[black] text-base py-5">
																						<span className="whitespace-nowrap">Estado:</span>
																						<div className="bg-white rounded-lg px-3 py-1 text-center w-full">
																							{
																								informe?.alert == 1 ?
																								'Informe fuera de tiempo'
																								: informe?.alert == 2 ?
																								'Actividad fuera de tiempo'
																								: 'Informe y actividad fuera de tiempo'
																							}
																						</div>
																					</div>
																				</Alert>
																			)}
                                    </div>
                                  </>
                                )}
																<div className="px-1">
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
																</div>
                              </>
                            </TabPane>
                          );
                        })}
                      </Tabs>
                    </div>
                  ) : (
										<div className="px-1">
											{!isNil(values?.informes[0]?.informes[0]) && (
												<>
													<div className="flex gap-2 flex-wrap">
														{values?.informes[0]?.informes[0]?.puntuacion && (
															<Alert
																className="mb-5 bg-alert-success rounded-xl"
																hideIcon
															>
																<p className="text-[white] text-base py-5">
																	Puntuación:{"  "}
																	<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
																		{values?.informes[0]?.informes[0]?.puntuacion}/
																		{values?.informes[0]?.informes[0]?.puntuacion_maxima}
																	</span>
																</p>
															</Alert>
														)}
														<Alert
															className="mb-5 bg-primary rounded-xl"
															hideIcon
														>
															<p className="text-[white] text-base py-5">
																Firma Anciano:{"  "}
																<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
																	{values?.informes[0]?.informes[0]?.firma_anciano ? (
																		<span className="text-secondary font-bold">
																			SI
																		</span>
																	) : (
																		<span className="text-alert-error font-bold">
																			NO
																		</span>
																	)}
																</span>
															</p>
														</Alert>
														<Alert
															className="mb-5 bg-secondary rounded-xl"
															hideIcon
														>
															<p className="text-[white] text-base py-5">
																Firma Pastor:{"  "}
																<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
																	{values?.informes[0]?.informes[0]?.firma_pastor ? (
																		<span className="text-secondary font-bold">
																			SI
																		</span>
																	) : (
																		<span className="text-alert-error font-bold">
																			NO
																		</span>
																	)}
																</span>
															</p>
														</Alert>
														<Alert
															className="mb-5 bg-overlay rounded-xl"
															hideIcon
														>
															<p className="text-[white] text-base py-5">
																Firma Consejo Regional:{"  "}
																<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
																	{values?.informes[0]?.informes[0]?.firma_consejo_regional ? (
																		<span className="text-secondary font-bold">
																			SI
																		</span>
																	) : (
																		<span className="text-alert-error font-bold">
																			NO
																		</span>
																	)}
																</span>
															</p>
														</Alert>
														<Alert
															className="mb-5 bg-secondary rounded-xl"
															hideIcon
														>
															<p className="text-[white] text-base py-5">
																Fecha de envío:{" "}
																<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
																	{values?.informes[0]?.informes[0]?.fecha_enviado}
																</span>
															</p>
														</Alert>
														{values?.informes[0]?.informes[0]?.observacion && (
															<Alert className=" bg-overlay rounded-xl mb-5" whiteIcon={true}>
																<div className="flex items-center gap-2 text-[white] text-base py-5">
																	<span className="whitespace-nowrap">Observación:</span>
																	<div className="bg-white text-[black] rounded-lg px-3 py-1 text-center w-full">
																		{values?.informes[0]?.informes[0]?.observacion}
																	</div>
																</div>
															</Alert>
														)}
														{values?.informes[0]?.informes[0]?.alert > 0 && (
															<Alert className=" bg-[#ffc107] rounded-xl mb-5">
																<div className="flex items-center gap-2 text-[black] text-base py-5">
																	<span className="whitespace-nowrap">Estado:</span>
																	<div className="bg-white rounded-lg px-3 py-1 text-center w-full">
																		{
																			values?.informes[0]?.informes[0]?.alert == 1 ?
																			'Informe fuera de tiempo'
																			: values?.informes[0]?.informes[0]?.alert == 2 ?
																			'Actividad fuera de tiempo'
																			: 'Informe y actividad fuera de tiempo'
																		}
																	</div>
																</div>
															</Alert>
														)}
													</div>
												</>
											)}
											<InformeForm
												refetch={refetch}
												idPrecamporee={id}
												informe={
													isEmpty(values?.informes) ? null : values?.informes[0]?.informes[0]
												}
												isAvailable={values?.activo}
												className={classNamesForms}
												idCamporee={response?.data?.id_camporee}
											/>
										</div>
                  )}
                </div>
              </Restricted>
            </>
          )}
        </div>
      </div>
      <ModalApprove isShow={isShowApprove}>
        <ApproveInforme
          hide={hideApprove}
          refetch={refetch}
          id_informe={dataApprove}
					id_camporee={response?.data?.id_camporee}
        />
      </ModalApprove>
      <ModalLoadScore isShow={isShowLoadScore}>
        <LoadScore
          hide={hideLoadScore}
          data={dataLoadScore}
          refetch={refetch}
					id_camporee={response?.data?.id_camporee}
        />
      </ModalLoadScore>
      <ModalViewImages isShow={isShowViewImages}>
        <PreviewImage src={dataPreview} />
      </ModalViewImages>
      {/*
      <ModalEdit isShow={isShowEdit}>
        <EditClub hide={hideEdit} data={dataEdit} refetch={refetch} />
      </ModalEdit>
      <ModalView isShow={isShowView}>
        <ViewClub hide={hideView} data={dataView} refetch={refetch} />
      </ModalView> */}
    </LayoutDashboard>
  );
};

// AGREGAR VALIDACION DE PERMISOS A ESTA VISTA
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
    ModuleEnums.EVENTO_PRECAMPOREE
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

export default EventPrecamporeeDetail;
