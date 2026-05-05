import * as React from "react";
import { Spinner } from "components/common/spinner/spinner";
import { useQuery } from "react-query";
import { UseQueryEnums } from "consts/useQueryEnums";
import { useQueryParams } from "consts/query.helper";
import { CamporeeServices } from "services/Camporee";
import { get, isEmpty, isNil, debounce } from "lodash";
import { useForm } from "react-hook-form";
import { InputText } from "components/common/form/input-text";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import { Icon } from "components/icon";
import { appRouter, Icons } from "consts";
import Restricted from "context/PermissionProvider/Restricted";
import Pagination, { PaginationProps } from "components/pagination/Pagination";
import { useModal } from "hooks/modal";
import ItemIcon from "components/item-icon";
import {
  PencilIcon,
  PhoneIcon,
  ViewListIcon,
  PlusIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import dynamic from "next/dynamic";
import clsx from "clsx";
import moment from "moment";
import { formatDateComplete } from "lib/helper";
import { Tooltip } from "antd";
import { Button } from "components/common/button";
import { Alert } from "components/common/alert";
import { SelectInput } from "components/common/form/select/SelectInput";
import { TypesSelectPrecamporeeMap } from "consts/typesSelectEnum";
import { AlertSkeleton, CardSkeleton } from "components/common/skeleton";

const CreateEventPrecamporee = dynamic(() => import("./create"));
const EditEventPrecamporee = dynamic(() => import("./edit"));

interface EventosPrecamporeeProps {
  idCamporee: number | string | string[] | undefined;
  className?: string;
}
type Params = {
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
	light?: boolean;
  idCamporee: number | string | string[] | undefined;
};

const EventosPrecamporee = ({
  idCamporee,
  className,
}: EventosPrecamporeeProps) => {
  const [params, setValue] = useQueryParams<Params>({
    limit: 6,
    idCamporee: idCamporee,
		light: true,
  });
  const {
    Modal: ModalEditPrecamporee,
    hide: hideEditPrecamporee,
    isShow: isShowEditPrecamporee,
    show: showEditPrecamporee,
  } = useModal();

  const {
    Modal: ModalCreatePrecamporee,
    hide: hideCreatePrecamporee,
    isShow: isShowCreatePrecamporee,
    show: showCreatePrecamporee,
  } = useModal();
  const [onSearch, setOnSearch] = React.useState(false);
  const [dataEdit, setDataEdit] = React.useState();

  const { data, isLoading, refetch } = useQuery<any>(
    [`${UseQueryEnums.GET_ALL_PRECAMPOREE_CAMPOREE}_${idCamporee}`, params],
    () => CamporeeServices.getAllEventsPrecamporeeByIdCamporee(params)
  );

  const allPrecamporee = get(data, "data.data", []);
  const total = get(data, "data.total", 1);
  const currentPage = get(data, "data.page", 1);
  const limit = get(data, "data.limit", params.limit);
	const informeMensualReady = get(data, "data.informe_mensual_ready");
	const mes = get(data, "data.mes");

	const debouncedSearch = React.useMemo(
		() =>
			debounce((term: string) => {
				if (isEmpty(term)) {
					updateQuery("search", undefined);
				} else {
					updateQuery("search", term);
				}
				updateQuery("page", undefined);
			}, 1000),
		[]
	);

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const handleSubmitData = (data: any) => {
  };

  const updateQuery = (key: string, value: number | string | undefined) => {
    setValue({ [key]: value });
  };
  const onResponseData = () => {
    refetch();
  };

  const handleOnEdit = (selected: any) => {
    const findSelected = allPrecamporee.find(
      (item: any) =>
        item.id_camporee_precamporee === selected.id_camporee_precamporee
    );
    setDataEdit(findSelected);
    showEditPrecamporee();
  };

  React.useEffect(() => {
    if (!isNil(params.search) && !isEmpty(params.search)) {
      setValueForm("search", params.search);
      updateQuery("page", undefined);
    }
  }, []);

  const handleChangeSearch = (e: any) => {
    const value = e.target.value;
    setOnSearch(true);
    return debouncedSearch(value);
  };

  return (
    <div className="text-center w-full">
      <div className={clsx("container-form mt-5 mb-11 text-left", className)}>
        <form
              className="w-full text-left"
              onSubmit={handleSubmit(handleSubmitData)}
            >
              <div className="flex justify-center items-center mb-5">
                <InputText
                  name="search"
                  title="Search"
                  labelVisible={false}
                  isFill={!!watch("search")}
                  register={register}
                  // rules={rules.search}
                  onChangeCustom={handleChangeSearch}
                  error={errors.search}
                  leftImg={Icons.search}
                  otherStyles="pt-3 pb-3 rounded-full"
                  disabled={isLoading}
                />
                {data?.data?.modificacion && (
                  <Restricted
                    module={ModuleEnums.EVENTO_PRECAMPOREE}
                    typePermisse={PermissionsEnums.ADD}
                  >
                    <Tooltip title="Agregar">
                      <div
                        className={clsx("px-2", { "pointer-events-none opacity-50": isLoading })}
                        onClick={isLoading ? undefined : showCreatePrecamporee}
                      >
                        <Button
                          labelProps="text-sm text-[black] font-bold"
                          label={"Añadir"}
                          fill
                          boderRadius="rounded-full"
                          size="full"
                          type="submit"
                          sizesButton="py-3"
                          className="bg-yellow w-[100px]"
                          disabled={isLoading}
                        />
                      </div>
                    </Tooltip>
                  </Restricted>
                )}
              </div>
            </form>

						<Restricted
							module={ModuleEnums.EVENTO_PRECAMPOREE}
							typePermisse={PermissionsEnums.LOAD_FORMS}
						>
							<SelectInput
								className="z-50 flex-auto mb-5"
								name="light"
								label="Mostrar"
								options={TypesSelectPrecamporeeMap}
								maxwidth="max-w-[208px]"
								value={'true'}
								setValue={updateQuery}
								hideDeleteSelected
							></SelectInput>
						</Restricted>

						{isLoading ? (
              <>
								<Restricted
									module={ModuleEnums.EVENTO_PRECAMPOREE}
									typePermisse={PermissionsEnums.LOAD_FORMS}
								>
									 <AlertSkeleton />
								</Restricted>
                <CardSkeleton rows={limit} />
              </>
            ) : (
              <>
						{
							informeMensualReady !== null &&
							<Link
								href={`${appRouter.dashboard.subLinks.informesMensuales.href}?fecha=${mes}`}
							>
								<a>
									<Alert
										className={`mb-5 bg-${informeMensualReady ? 'success' : 'error'} rounded-xl`}
										hideIcon
									>
										<p className="text-[black] text-base py-5 m-auto">
											<span className="font-bold">Informe Mensual{" "}</span>
											<span className="bg-white text-[black] rounded-lg px-2 py-2 text-center">
												{informeMensualReady ? 'Listo' : 'Pendiente'}
											</span>
										</p>
									</Alert>
								</a>
							</Link>
						}
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 lg:grid-cols-2 3xl:grid-cols-3 "
            >
              {allPrecamporee.map((item: any) => {
                const itemsPrecamporeeCard = [
                  {
                    icon: Icons.calendar,
                    content: `${moment(item?.fecha_inicio).format(
                      formatDateComplete
                    )} a ${moment(item?.fecha_fin).format(formatDateComplete)}`,
                  },
                  {
                    icon: Icons.medalla,
                    content: `${item?.puntaje_maximo} pts ${
                      item?.mensual ? "mensuales" : ""
                    }`,
                  },
                  ,
                ];
								let bgColor = 'white';
								let textColor = 'gray-500';
								if (item.ready) {
									bgColor = 'success';
								} else if (item.overdue || item.pending) {
									bgColor = 'error';
									textColor = 'gray-200';
								}
                return (
                  <li
                    key={item.nombre}
                    className={`col-span-1 bg-${bgColor} rounded-lg shadow shadow-yellow divide-y divide-gray-200 relative`}
                  >
                    <div className="w-full flex-col flex items-center p-6 space-x-6">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 text-center justify-center">
                          <h3 className="text-gray-900 text-base font-bold truncate text-center">
                            {item.nombre}
                          </h3>
                        </div>
                        <p className={`mt-1 text-${textColor} text-sm break-all`}>
                          {item.descripcion}
                        </p>
                      </div>
                      {itemsPrecamporeeCard && (
                        <div className="mt-8 flex-grow flex w-full flex-col justify-start gap-y-4">
                          {itemsPrecamporeeCard.map((item: any, index: any) => {
                            return (
                              <ItemIcon
                                key={index}
                                icon={item?.icon}
                                // title={item?.title}
                                content={item?.content}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        {data?.data?.modificacion && (
                          <Restricted
                            module={ModuleEnums.EVENTO_PRECAMPOREE}
                            typePermisse={PermissionsEnums.EDIT}
                          >
                            <div className="w-0 flex-1 flex">
                              <div
                                className={`cursor-pointer relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-${textColor}`}
                                onClick={() => handleOnEdit(item)}
                              >
                                <PencilIcon
                                  className="w-5 h-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-3">Editar</span>
                              </div>
                            </div>
                          </Restricted>
                        )}

                        <Restricted
                          module={ModuleEnums.EVENTO_PRECAMPOREE}
                          typePermisse={PermissionsEnums.VIEW}
                        >
                          <div className="-ml-px w-0 flex-1 flex">
                            <Link
                              href={`${appRouter.dashboard.href}/${appRouter.dashboard.subLinks.camporee.subLinks.events.href}/${appRouter.dashboard.subLinks.camporee.subLinks.events.subLinks.precamporee.href}/${appRouter.dashboard.subLinks.camporee.subLinks.events.subLinks.precamporee.subLinks.detail.href}/${item.id_camporee_precamporee}`}
                            >
                              <a className={`relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-${textColor}`}>
                                <PlusIcon
                                  className="w-5 h-5 text-gray-400"
                                  aria-hidden="true"
                                />
                                <span className="ml-3">Detalle</span>
                              </a>
                            </Link>
                          </div>
                        </Restricted>
                      </div>
                    </div>
                    {/* <div className="absolute top-3 right-3 border-none">
                      <PencilIcon
                        fill="text-black"
                        className={`w-8 cursor-pointer p-1 rounded-full shadow-sm shadow-primary bg-yellow`}
                        // onClick={showModal}
                      />
                    </div> */}
                  </li>
                );
              })}
              {/* return <ItemIcon icon={item?.icon} title={item?.title} />; */}
            </ul>
            {!isEmpty(allPrecamporee) && !isLoading ? (
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
            )}
              </>
            )}
      </div>
      <ModalCreatePrecamporee isShow={isShowCreatePrecamporee}>
        <CreateEventPrecamporee
          id_camporee={idCamporee}
          hide={hideCreatePrecamporee}
          refetch={refetch}
        />
      </ModalCreatePrecamporee>
      <ModalEditPrecamporee isShow={isShowEditPrecamporee}>
        <EditEventPrecamporee
          hide={hideEditPrecamporee}
          data={dataEdit}
          refetch={refetch}
        />
      </ModalEditPrecamporee>
    </div>
  );
};

export default EventosPrecamporee;
