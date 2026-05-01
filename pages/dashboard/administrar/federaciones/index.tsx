import { InputText } from "components/common/form/input-text";
import { Icon } from "components/icon";
import { LayoutDashboard } from "components/layout";
import { Icons } from "consts";
import { useModal } from "hooks/modal";
import { GetServerSideProps } from "next";

import * as React from "react";
import { useForm } from "react-hook-form";
import CreateFederacion from "components/administrar/federaciones/create/";
import { ConsejosRegionalesServices, ProfilApiService } from "services";
import { UseQueryEnums } from "consts/useQueryEnums";
import { useQuery } from "react-query";
import { Spinner } from "components/common/spinner/spinner";
import { useQueryParams } from "consts/query.helper";
import { IconWithText } from "components/icon-with-text";
import DataTableComponent, {
  TableColumnType,
} from "components/data-table/DataTableComponent";
import { get, isNil, isEmpty } from "lodash";
import EditFederacion from "components/administrar/federaciones/edit";
import ViewFederacion from "components/administrar/federaciones/view";
import { Subject } from "rxjs";
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import Restricted from "context/PermissionProvider/Restricted";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionsEnums } from "consts/permissionsEnum";
import { getSession, routeValidForUser } from "lib/helper";
import { Tooltip } from "antd";
import { Button } from "components/common/button";
import DesactivarFederacion from "components/administrar/federaciones/desactivar";
import { TrashIcon } from "@heroicons/react/solid";
import { HelpListFederaciones } from "help/administrar/federaciones/list";
import { Help } from "components/common/help";

// import Image from "next/image";
type Params = {
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
};

const HeaderClassName = `
    px-6
    py-3
    text-left
    text-xs
    font-bold
    text-black
    capitalize
    tracking-wider
`;

const DataClassName = `
    px-6
    py-4
    whitespace-nowrap
    text-white
`;

const Federaciones = () => {
  const { Modal, hide, isShow, show } = useModal();
  const {
    Modal: ModalEdit,
    hide: hideEdit,
    isShow: isShowEdit,
    show: showEdit,
  } = useModal();

  const {
    Modal: ModalHelp,
    hide: hideHelp,
    isShow: isShowHelp,
    show: showHelp,
  } = useModal();

  const {
    Modal: ModalView,
    hide: hideView,
    isShow: isShowView,
    show: showView,
  } = useModal();

  const {
    Modal: ModalDelete,
    hide: hideDelete,
    isShow: isShowDelete,
    show: showDelete,
  } = useModal();
  const [dataDelete, setDataDelete] = React.useState<any>();
  const [dataEdit, setDataEdit] = React.useState<any>();
  const [onSearch, setOnSearch] = React.useState(false);
  const [dataView, setDataView] = React.useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subject, setSubject] = React.useState(new Subject<string>());
  const [params, setValue] = useQueryParams<Params>({ limit: 8 });
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>([UseQueryEnums.GET_ALL_FEDERACIONES, params], () =>
    ConsejosRegionalesServices.getAll(params)
  );
  const updateQuery = (key: string, value: number | string | undefined) => {
    setValue({ [key]: value });
  };

  const handleOnDelete = (selected: any) => {
    setDataDelete(selected);
    showDelete();
  };

  React.useEffect(() => {
    // ConsejosRegionalesServices.getAll()
    //   .then((response: any) => {
    //     console.log("response get consejos regionales:", response);
    //   })
    //   .catch((e: any) => {
    //     console.log("Error: ", e);
    //   });
  }, []);

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const handleSubmitData = (data: any) => {

  };

  const handleOnEdit = (selected: any) => {
    const findSelected = response?.data?.data?.find(
      (item: any) => item.id === selected.id
    );
    setDataEdit(findSelected);
    showEdit();
  };

  const handleOnView = (selected: any) => {
    const findSelected = response?.data?.data?.find(
      (item: any) => item.id === selected.id
    );
    setDataView(findSelected);
    showView();
  };

  const columns: TableColumnType[] = [
    {
      name: "abreviatura",
      label: "Abreviatura",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <IconWithText icon={value?.logo} text={value?.abreviatura} />
      ),
    },
    {
      name: "presidenteConsejo",
      label: "Presidente de Consejo",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <IconWithText
          icon={value?.foto_presidente}
          text={value?.presidente}
          isUser
        />
      ),
    },
    {
      name: "nro_iglesias",
      label: " Nro. Iglesias",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500">{value.nro_iglesias}</span>
      ),
    },
    {
      name: "nro_clubes",
      label: " Nro. Clubes",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500">{value.nro_clubes}</span>
      ),
    },
    {
      name: "nro_conquistadores",
      label: " Nro. Conquistadores",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500">{value.nro_conquistadores}</span>
      ),
    },
    {
      name: "nro_gm",
      label: " Nro. GM",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500">{value.nro_gm}</span>
      ),
    },
    {
      name: "nro_aventureros",
      label: " Nro. Aventureros",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500">{value.nro_aventureros}</span>
      ),
    },
    {
      name: "status",
      label: "Status",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => {
        return (
          <>
            {value?.activo ? (
              <span className="font-bold text-secondary">Activo</span>
            ) : (
              <span className="font-bold text-alert-error">Inactivo</span>
            )}
          </>
        );
      },
    },
    {
      name: "acciones",
      label: "Acciones",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <div className="flex items-center">
          <Restricted
            module={ModuleEnums.FEDERACIONES}
            typePermisse={PermissionsEnums.EDIT}
          >
            <Tooltip title="Editar">
              <div className="flex-shrink-0 h-10 w-8">
                <Icon
                  src={Icons.edit}
                  fill="white"
                  className="max-w-[50px] w-8 text-primary cursor-pointer"
                  onClick={() => handleOnEdit(value)}
                />
              </div>
            </Tooltip>
          </Restricted>
          <Restricted
            module={ModuleEnums.FEDERACIONES}
            typePermisse={PermissionsEnums.DETAIL}
          >
            <Tooltip title="Ver más">
              <div className="flex-shrink-0 h-10 w-8 ml-5">
                <Icon
                  src={Icons.more}
                  fill="var(--color-primary)"
                  className="max-w-[50px] w-8 cursor-pointer"
                  onClick={() => handleOnView(value)}
                />
              </div>
            </Tooltip>
          </Restricted>
          {value?.activo && (
            <Restricted
              module={ModuleEnums.FEDERACIONES}
              typePermisse={PermissionsEnums.DESACTIVAR_ENTIDAD}
            >
              <Tooltip title="Desactivar">
                <div className="flex-shrink-0 w-8 ml-5 items-center">
                  <TrashIcon
                    className="text-blue-500 fill-alert-error flex items-center cursor-pointer"
                    onClick={() => handleOnDelete(value)}
                  />
                </div>
              </Tooltip>
            </Restricted>
          )}
        </div>
      ),
    },
  ];

  const values = get(response, "data.data", []);
  const total = get(response, "data.total", 1);
  const currentPage = get(response, "data.page", 1);
  const limit = get(response, "data.limit", params.limit);

  const onResponseData = () => {
    refetch();
  };
  React.useEffect(() => {
    subject
      .pipe(
        // wait 300ms after each keystroke before considering the term
        debounceTime(1000),
        // ignore new term if same as previous term
        distinctUntilChanged(),
        // switch to new search observable each time the term changes
        map((term: string) => {
          if (isEmpty(term)) {
            updateQuery("search", undefined);
          } else {
            updateQuery("search", term);
          }
          updateQuery("page", undefined);
        })
      )
      .subscribe(onResponseData);

    return () => subject.unsubscribe();
  }, []);

  React.useEffect(() => {
    if (!isNil(params.search) && !isEmpty(params.search)) {
      setValueForm("search", params.search);
      updateQuery("page", undefined);
    }
  }, []);

  const handleChangeSearch = (e: any) => {
    const value = e.target.value;
    setOnSearch(true);
    return subject.next(value);
  };

  return (
    <LayoutDashboard title="Federaciones">
      <div className="lg:px-20 mt-12">
        {isLoading && !onSearch ? (
          <Spinner type="loadingPage" className="py-10" />
        ) : (
          <>
            <Help showModal={showHelp} />
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
                />
                <Restricted
                  module={ModuleEnums.FEDERACIONES}
                  typePermisse={PermissionsEnums.ADD}
                >
                  <Tooltip title="Agregar">
                    <div className="px-2" onClick={show}>
                      <Button
                        labelProps="text-sm text-[black] font-bold"
                        label={"Añadir"}
                        fill
                        boderRadius="rounded-full"
                        size="full"
                        type="submit"
                        sizesButton="py-3"
                        className="bg-yellow w-[100px]"
                      />
                    </div>
                  </Tooltip>
                </Restricted>
              </div>
            </form>
            {isLoading ? (
              <Spinner type="loadingPage" className="py-10" />
            ) : (
              <DataTableComponent
                columns={columns}
                data={values}
                currentPage={parseInt(currentPage)}
                total={parseInt(total)}
                limit={parseInt(limit)}
                setPage={(value) => updateQuery("page", value)}
              />
            )}
          </>
        )}
      </div>
      <Modal isShow={isShow}>
        <CreateFederacion hide={hide} refetch={refetch} />
      </Modal>
      <ModalEdit isShow={isShowEdit}>
        <EditFederacion hide={hideEdit} data={dataEdit} refetch={refetch} />
      </ModalEdit>
      <ModalView isShow={isShowView}>
        <ViewFederacion hide={hideView} data={dataView} refetch={refetch} />
      </ModalView>
      <ModalDelete isShow={isShowDelete}>
        <DesactivarFederacion
          hide={hideDelete}
          data={dataDelete}
          refetch={refetch}
        />
      </ModalDelete>
      <ModalHelp isShow={isShowHelp}>
        <HelpListFederaciones hide={hideHelp} />
      </ModalHelp>
    </LayoutDashboard>
  );
};

export default Federaciones;
