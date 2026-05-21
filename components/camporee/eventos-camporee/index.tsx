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
  ClipboardCheckIcon,
} from "@heroicons/react/solid";
import Link from "next/link";
import dynamic from "next/dynamic";
import clsx from "clsx";
import {
  TypesSelectCapellanMap,
  TypesSelectYesOrNot,
} from "consts/typesSelectEnum";
import { Tooltip } from "antd";
import { Button } from "components/common/button";
import { CardSkeleton } from "components/common/skeleton";

const CreateEventCamporee = dynamic(() => import("./create"));
const EditEventCamporee = dynamic(() => import("./edit"));

interface EventosCamporeeProps {
  idCamporee: number | string | string[] | undefined;
  className?: string;
  tipoCamporee: string;
}
type Params = {
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
  idCamporee: number | string | string[] | undefined;
};

const EventosCamporee = ({
  tipoCamporee,
  idCamporee,
  className,
}: EventosCamporeeProps) => {
  const [params, setValue] = useQueryParams<Params>({
    limit: 6,
    idCamporee: idCamporee,
  });
  const {
    Modal: ModalEditCamporee,
    hide: hideEditCamporee,
    isShow: isShowEditCamporee,
    show: showEditCamporee,
  } = useModal();

  const {
    Modal: ModalCreateCamporee,
    hide: hideCreateCamporee,
    isShow: isShowCreateCamporee,
    show: showCreateCamporee,
  } = useModal();
  const [onSearch, setOnSearch] = React.useState(false);
  const [dataEdit, setDataEdit] = React.useState();

  const { data, isLoading, refetch } = useQuery<any>(
    [`${UseQueryEnums.GET_EVENT_CAMPOREE_BY_ID}_${idCamporee}`, params],
    () => CamporeeServices.getAllEventsCamporeeByIdCamporee(params),
		{ enabled: !!idCamporee }
  );

  const allCamporee = get(data, "data.data", []);
  const total = get(data, "data.total", 1);
  const currentPage = get(data, "data.page", 1);
  const limit = get(data, "data.limit", params.limit);

	const debouncedSearch = React.useMemo(
		() =>
			debounce((term: string) => {
				if (isEmpty(term)) {
					updateQueryRef.current("search", undefined);
				} else {
					updateQueryRef.current("search", term);
				}
				updateQueryRef.current("page", undefined);
			}, 1000),
		[]
	);

	React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const handleSubmitData = (data: any) => {

  };

  const updateQuery = React.useCallback(
		(key: string, value: number | string | undefined) => {
			setValue({ [key]: value });
		},
		[setValue]
	);
  const updateQueryRef = React.useRef(updateQuery);

  React.useEffect(() => {
    updateQueryRef.current = updateQuery;
  }, [updateQuery]);

  const handleOnEdit = (selected: any) => {
    const findSelected = allCamporee.find(
      (item: any) => item.id_camporee_evento === selected.id_camporee_evento
    );
    setDataEdit(findSelected);
    showEditCamporee();
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
    debouncedSearch(value);
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
                {data?.data?.plazo_modificacion && (
                  <Restricted
                    module={ModuleEnums.EVENTO_CAMPOREE}
                    typePermisse={PermissionsEnums.ADD}
                  >
                    <Tooltip title="Agregar">
                      <div
                        className={clsx("px-2", { "pointer-events-none opacity-50": isLoading })}
                        onClick={isLoading ? undefined : showCreateCamporee}
                      >
                        <Button
                          labelProps="text-sm text-[black] font-bold"
                          label={"Añadir"}
                          fill
                          boderRadius="rounded-full"
                          size="full"
                          type="submit"
                          sizesButton="py-3 px-4"
                          className="bg-yellow w-[100px]"
                          disabled={isLoading}
                        />
                      </div>
                    </Tooltip>
                  </Restricted>
                )}
              </div>
          </form>

					{isLoading ? (
            <CardSkeleton rows={limit} />
          ) : (
            <>
            <ul
              role="list"
              className="grid grid-cols-1 gap-6 lg:grid-cols-2 3xl:grid-cols-3 "
            >
              {allCamporee.map((item: any) => {
                const itemsCamporeeCard = [
                  {
                    icon: Icons.item,
                    content: (
                      <>
                        <strong className="text-[black]">Categoría:</strong>
                        {` ${item?.categoria}`}
                      </>
                    ),
                  },
                  {
                    icon: Icons.item,
                    content: (
                      <>
                        <strong className="text-[black]">
                          Puntuación maxima:
                        </strong>
                        {` ${item?.puntuacion_maxima}`}
                      </>
                    ),
                  },
                  {
                    icon: Icons.item,
                    content: (
                      <>
                        <strong className="text-[black]">Realizado:</strong>
                        {` ${
                          item?.realizado
                            ? TypesSelectYesOrNot.SI
                            : TypesSelectYesOrNot.NO
                        }`}
                      </>
                    ),
                  },
                ];
                return (
                  <li
                    key={item.nombre}
                    className="col-span-1 bg-white rounded-lg shadow shadow-yellow divide-y divide-gray-200 relative"
                  >
                    <div className="w-full flex-col flex items-center p-6 space-x-6">
                      <div className="flex-1 truncate">
                        <div className="flex items-center space-x-3 text-center justify-center">
                          <h3 className="text-gray-900 text-base font-bold truncate text-center">
                            {item.nombre}
                          </h3>
                        </div>
                        <p className="mt-1 text-gray-500 text-sm truncate">
                          {item.descripcion}
                        </p>
                      </div>
                      {itemsCamporeeCard && (
                        <div className="mt-8 flex-grow flex w-full flex-col justify-start gap-y-4">
                          {itemsCamporeeCard.map((item: any, index: any) => {
                            return (
                              <ItemIcon
                                key={index}
                                icon={item?.icon}
                                content={item?.content}
                              />
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="-mt-px flex divide-x divide-gray-200">
                        {data?.data?.plazo_modificacion && (
                          <Restricted
                            module={ModuleEnums.EVENTO_CAMPOREE}
                            typePermisse={PermissionsEnums.EDIT}
                          >
                            <div className="w-0 flex-1 flex">
                              <div
                                className="cursor-pointer relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
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
                          module={ModuleEnums.EVENTO_CAMPOREE}
                          typePermisse={PermissionsEnums.VIEW}
                        >
                          <div className="-ml-px w-0 flex-1 flex">
                            <Link
                              href={`${appRouter.dashboard.href}/${appRouter.dashboard.subLinks.camporee.subLinks.events.href}/${appRouter.dashboard.subLinks.camporee.subLinks.events.subLinks.camporee.href}/${appRouter.dashboard.subLinks.camporee.subLinks.events.subLinks.camporee.subLinks.detail.href}/${item.id_camporee_evento}`}
                              className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500">

                              <PlusIcon
                                className="w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span className="ml-3">Detalle</span>

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
            {!isEmpty(allCamporee) && !isLoading ? (
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
      <ModalCreateCamporee isShow={isShowCreateCamporee}>
        <CreateEventCamporee
          tipoCamporee={tipoCamporee}
          hide={hideCreateCamporee}
          refetch={refetch}
          idCamporee={idCamporee}
        />
      </ModalCreateCamporee>
      <ModalEditCamporee isShow={isShowEditCamporee}>
        <EditEventCamporee
          hide={hideEditCamporee}
          data={dataEdit}
          idCamporee={idCamporee}
          tipoCamporee={tipoCamporee}
          refetch={refetch}
        />
      </ModalEditCamporee>
    </div>
  );
};

export default EventosCamporee;
