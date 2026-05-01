import { LayoutDashboard } from "components/layout";
import { useQueryParams } from "consts/query.helper";
import { UseQueryEnums } from "consts/useQueryEnums";
import { get, isEmpty } from "lodash";
import moment from "moment";
import { GetServerSideProps } from "next";
import * as React from "react";
import { useQuery } from "react-query";
import { InformesMensualesService } from "services/InformesMensuales";
import { Collapse } from "antd";
import {
  ArrowRightIcon,
  PlusCircleIcon,
} from "@heroicons/react/solid";
import clsx from "clsx";
import { Typography } from "components/common/typography";
import { getSession, routeValidForUser } from "lib/helper";
import { ActividadForm } from "components/informes-mensuales/form-actividad";
import { Button } from "components/common/button";
import { useModal } from "hooks/modal";
import {
  TypesSelectEnums,
  TypesSelectMap,
} from "consts/typesSelectEnum";
import { Spinner } from "components/common/spinner/spinner";
import ApproveInforme from "components/informes-mensuales/approve-informe";
import Restricted from "context/PermissionProvider/Restricted";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ProfilApiService } from "services";
import { SelectInput } from "components/common/form/select/SelectInput";
import { DatePickerCustom } from "components/common/date-picker-select/datePicker";
import LoadScore from "components/informes-mensuales/load-score";
import ViewClub from "components/administrar/clubes/view";
import { Help } from "components/common/help";
import { HelpFormInformesMensuales } from "help/informes-mensuales/form";
import { InformeMensual } from "components/informes-mensuales/informe-mensual";
import PermissionContext from "context/PermissionProvider/PermissionContext";
const { Panel } = Collapse;

export type Params = {
  fecha?: any;
  tipo?: any;
};
const format_date = "YYYY-MM-DD";

const Dashboard = () => {
  const [dataApprove, setDataApprove] = React.useState<any>();
  const [dataLoadScore, setDataLoadScore] = React.useState<any>();
  const [dataView, setDataView] = React.useState<any>();
  const [params, setValue] = useQueryParams<Params>({
    tipo: TypesSelectEnums.INTEGRADO,
		fecha: moment(new Date()).format(format_date),
  });
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>(
    [UseQueryEnums.GET_ALL_INFORMES_MENSUALES_BY_DATE, params],
    () => InformesMensualesService.getAll(params)
  );

	const { isAllowedTo } = React.useContext(PermissionContext);

  const {
    Modal: ModalView,
    hide: hideView,
    isShow: isShowView,
    show: showView,
  } = useModal();
  const {
    Modal: ModalHelp,
    hide: hideHelp,
    isShow: isShowHelp,
    show: showHelp,
  } = useModal();
  const {
    Modal: ModalCreateActivity,
    hide: hideCreateActivity,
    isShow: isShowCreateActivity,
    show: showCreateActivity,
  } = useModal();

  const {
    Modal: ModalLoadScore,
    hide: hideLoadScore,
    isShow: isShowLoadScore,
    show: showLoadScore,
  } = useModal();

  const {
    Modal: ModalApprove,
    hide: hideApprove,
    isShow: isShowApprove,
    show: showApprove,
  } = useModal();

  const callback = (key: any) => {
    // console.log(key);
  };
  const handleShowApprove = (id: any) => {
    setDataApprove(id);
    showApprove();
  };
  const updateQuery = (key: string, value: number | string | undefined) => {
    setValue({ [key]: value });
  };

  const handleShowLoadScore = (data: any) => {
    setDataLoadScore(data);
    showLoadScore();
  };

  const handleOnView = (selected: any) => {
    setDataView(selected);
    showView();
  };

  const values = get(response, "data", []);

  return (
    <LayoutDashboard title="Informes Mensuales">
      {isLoading ? (
        <Spinner type="loadingPage" className="py-10" />
      ) : (
        <>
          <div className="py-4">
            <Help showModal={showHelp} />
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-x-4 mt-10 mb-10 ">
                <Restricted
                  module={ModuleEnums.INFORMES_MENSUALES}
                  typePermisse={PermissionsEnums.SELECT_TYPE_CAMPOREE}
                >
                  <div className="col-span-2 max-w-[208px]">
                    <SelectInput
                      className="z-50 flex-auto"
                      name="tipo"
                      label="Tipo"
                      options={TypesSelectMap}
                      maxwidth="max-w-full"
                      value={params.tipo}
                      setValue={updateQuery}
                      hideDeleteSelected
                    ></SelectInput>
                  </div>
                </Restricted>
                <div className="col-span-2 mt-2 md:mt-0 max-w-[208px]">
                  <DatePickerCustom
                    name="fecha"
                    label={"Fecha"}
                    value={params.fecha}
                    setValue={updateQuery}
                    hideDeleteDate
                    hideLabelTitle
                  />
                </div>
              </div>

              {isEmpty(values) ? (
                <>
                  <Restricted
                    module={ModuleEnums.INFORMES_MENSUALES}
                    typePermisse={PermissionsEnums.LOAD_FORMS}
                  >
                    {response?.editar && (
                      <div className="flex justify-end">
                        <Button
                          className="bg-primary max-w-[200px] border-[black] hover:bg-transparent hover:text-alert-success hover:border-alert-success"
                          labelProps="f-18 font-normal"
                          label={"+ Crear actividad"}
                          fill
                          boderRadius="rounded-full"
                          size="full"
                          type="submit"
                          sizesButton="py-3"
                          onClick={showCreateActivity}
                        />
                      </div>
                    )}
                  </Restricted>
                  <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 mt-20">
                    No hay datos para mostrar
                  </h2>
                </>
              ) : !isAllowedTo(PermissionsEnums.LOAD_FORMS, ModuleEnums.INFORMES_MENSUALES) ? (
								<Collapse
									defaultActiveKey={["1"]}
									onChange={callback}
									className="w-full custom-collapse mt-0"
									collapsible="header"
									expandIcon={({ isActive }) => (
										<>
											<ArrowRightIcon
												className={clsx(
													"w-10 h-10 absolute top-0 left-5 bottom-0 m-auto",
													{
														"rotate-90": isActive,
													}
												)}
											/>
										</>
									)}
								>
									{values?.map((itemClub: any, index: any) => {
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
													extra={
														<>
															<PlusCircleIcon
																onClick={() => handleOnView(itemClub?.detalle)}
																className={clsx(
																	"w-12 h-12 absolute top-0 right-5 bottom-0 m-auto cursor-pointer"
																)}
															/>
														</>
													}
													className={`custom-collapse-header ${itemClub.pending ? 'pending' : itemClub.ready ? 'ready' : ''} justify-normal`}
												>
													<InformeMensual
														itemClub={itemClub}
														hideCreateActivity={hideCreateActivity}
														showCreateActivity={showCreateActivity}
														params={params}
														refetch={refetch}
													/>
													<Restricted
														module={ModuleEnums.INFORMES_MENSUALES}
														typePermisse={PermissionsEnums.APPROVE_FORM}
													>
														{itemClub?.informe?.editar && (
															<div className="mt-0 justify-center text-center flex w-full">
																<Button
																	labelProps="f-18 font-bold"
																	label={"Aprobar Informe"}
																	fill
																	className="bg-alert-success border-alert-success max-w-[200px]"
																	boderRadius="rounded-full"
																	size="full"
																	sizesButton="py-3"
																	onClick={() =>
																		handleShowApprove(itemClub?.informe?.id)
																	}
																/>
															</div>
														)}
													</Restricted>
													<Restricted
														module={ModuleEnums.INFORMES_MENSUALES}
														typePermisse={PermissionsEnums.LOAD_SCORE}
													>
														{itemClub?.informe?.editar && (
															<div className="mt-28 justify-center text-center flex w-full">
																<Button
																	labelProps="f-18 font-bold"
																	label={"Cargar Puntuación"}
																	fill
																	className="bg-alert-success border-alert-success max-w-[200px]"
																	boderRadius="rounded-full"
																	size="full"
																	sizesButton="py-3"
																	onClick={() =>
																		handleShowLoadScore(itemClub?.informe)
																	}
																/>
															</div>
														)}
													</Restricted>
												</Panel>
											</React.Fragment>
										);
									})}
								</Collapse>
							) : (
								<InformeMensual
									itemClub={values[0]}
									hideCreateActivity={hideCreateActivity}
									showCreateActivity={showCreateActivity}
									params={params}
									refetch={refetch}
								/>
							)}
            </div>
          </div>
          <ModalView isShow={isShowView}>
            <ViewClub hide={hideView} data={dataView} refetch={refetch} />
          </ModalView>
          <ModalCreateActivity isShow={isShowCreateActivity}>
            <ActividadForm
              refetch={refetch}
              hide={hideCreateActivity}
              dateSelected={params.fecha}
            ></ActividadForm>
          </ModalCreateActivity>
          <ModalApprove isShow={isShowApprove}>
            <ApproveInforme
              hide={hideApprove}
              refetch={refetch}
              id_informe={dataApprove}
            />
          </ModalApprove>
          <ModalLoadScore isShow={isShowLoadScore}>
            <LoadScore
              hide={hideLoadScore}
              data={dataLoadScore}
              refetch={refetch}
            />
          </ModalLoadScore>
          <ModalHelp isShow={isShowHelp}>
            {/* <HelpListInformesMensuales hide={hideHelp} /> */}
            <HelpFormInformesMensuales hide={hideHelp} />
          </ModalHelp>
        </>
      )}
    </LayoutDashboard>
  );
};

export default Dashboard;
