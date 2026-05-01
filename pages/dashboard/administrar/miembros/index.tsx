import { InputText } from "components/common/form/input-text";
import { Icon } from "components/icon";
import { LayoutDashboard } from "components/layout";
import { Icons } from "consts";
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
import { debounceTime, map, distinctUntilChanged } from "rxjs/operators";
import { DistritosServices } from "services/Distritos";
import ViewDistrito from "components/administrar/distritos/view";
import EditDistrito from "components/administrar/distritos/edit";
import CreateDistrito from "components/administrar/distritos/create";
import { IglesiasServices } from "services/Iglesias";
import CreateIglesia from "components/administrar/iglesias/create";
import EditIglesia from "components/administrar/iglesias/edit";
import ViewIglesia from "components/administrar/iglesias/view";
import { MiembrosServices } from "services/Miembros";
import { Table, Switch, Space, Tooltip } from "antd";
import {
  LockClosedIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/solid";
import Pagination from "components/pagination/Pagination";
import DeleteMiembro from "components/administrar/miembros/deleteMiembro";
import ViewAllOnlyMiembros from "components/administrar/miembros/viewAllOnlyMiembros";
import AgregarMiembros from "components/administrar/miembros/create";
import { ProfilApiService } from "services";
import { getSession, routeValidForUser } from "lib/helper";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import Restricted from "context/PermissionProvider/Restricted";
import { Button } from "components/common/button";
import { RoleEnums } from "consts/rolesEnum";
import { DatePickerCustom } from "components/common/date-picker/datePicker";
import { Help } from "components/common/help";
import { HelpListMiembros } from "help/administrar/miembros/list";

// import Image from "next/image";
type Params = {
  search?: string;
  fecha?: string;
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

const Miembros = () => {
  const { Modal, hide, isShow, show } = useModal();
  const {
    Modal: ModalDelete,
    hide: hideDelete,
    isShow: isShowDelete,
    show: showDelete,
  } = useModal();
  const {
    Modal: ModalHelp,
    hide: hideHelp,
    isShow: isShowHelp,
    show: showHelp,
  } = useModal();
  const {
    Modal: ModalViewOnlyMember,
    hide: hideViewOnlyMember,
    isShow: isShowViewOnlyMember,
    show: showViewOnlyMember,
  } = useModal();
  const [dataDelete, setDataDelete] = React.useState<any>();
  const [onSearch, setOnSearch] = React.useState(false);
  const [fecha, setFecha] = React.useState();
  const [dataViewOnlyMember, setDataView] = React.useState<any>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [subject, setSubject] = React.useState(new Subject<string>());
  const [params, setValue] = useQueryParams<Params>({ limit: 8 });
  const {
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>([UseQueryEnums.GET_ALL_MIEMBROS, params], () =>
    MiembrosServices.getAll(params)
  );
  const updateQuery = (key: string, value: number | string | undefined) => {
    setValue({ [key]: value });
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
    control,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });
  const rules = {
    fecha: {},
  };
  const handleSubmitData = (data: any) => {

  };

  const handleOnDelete = (selected: any) => {
    setDataDelete(selected);
    showDelete();
  };

  const handleOnViewOnlyMember = (selected: any) => {
    setDataView(selected);
    showViewOnlyMember();
  };

  const columns = [
    {
      title: "Club",
      dataIndex: "nombre_club",
      key: "id_club",
    },
    Table.EXPAND_COLUMN,
    {
      title: "Miembros",
      dataIndex: "",
      key: "miembros",
      width: "30%",
      render: () => <span>Miembros</span>,
    },
  ];

  const columnsMiembros = [
    {
      title: "Nombre",
      dataIndex: "nombre",
      key: "nombre",
    },
    {
      title: "Cedula",
      dataIndex: "cedula",
      key: "cedula",
    },
    {
      title: "Rol",
      dataIndex: "cargo",
      key: "cargo",
    },
    {
      title: "Status",
      dataIndex: "",
      key: "status",
      render: (data: any) => {
        return (
          <>
            {data?.activo ? (
              <span className="font-bold text-secondary">Activo</span>
            ) : (
              <span className="font-bold text-alert-error">Inactivo</span>
            )}
          </>
        );
      },
    },
    {
      title: "Acciones",
      dataIndex: "",
      key: "periodo",
      render: (data: any) => (
        <div className="flex items-center">
          {data?.activo && data?.cargo !== RoleEnums.DIRECTOR && (
            <Restricted
              module={ModuleEnums.MIEMBROS}
              typePermisse={PermissionsEnums.DAR_DE_BAJA_MIEMBRO}
            >
              <Tooltip title="Dar de baja">
                <div className="flex-shrink-0 w-8">
                  <TrashIcon
                    className="text-blue-500 flex items-center cursor-pointer"
                    onClick={() => handleOnDelete(data)}
                  />
                </div>
              </Tooltip>
            </Restricted>
          )}
          <Restricted
            module={ModuleEnums.MIEMBROS}
            typePermisse={PermissionsEnums.DETALLE_MIEMBRO}
          >
            <Tooltip title="Ver más">
              <div className="flex-shrink-0 h-10 w-8 ml-5">
                <Icon
                  src={Icons.more}
                  fill="var(--color-primary)"
                  className="max-w-[50px] w-8 cursor-pointer"
                  onClick={() => handleOnViewOnlyMember(data)}
                />
              </div>
            </Tooltip>
          </Restricted>
        </div>
      ),
    },
  ];

  const expandedTableMiembros = (allData: any) => {
    return (
      <Table
        columns={columnsMiembros}
        dataSource={allData.miembros}
        pagination={false}
        rowKey="cedula"
      />
    );
  };

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
            if (isEmpty(term)) {
              updateQuery("search", undefined);
            } else {
              updateQuery("search", term);
            }
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
    <LayoutDashboard title="Miembros">
      <div className="lg:lg:px-20 mt-12">
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
                  module={ModuleEnums.MIEMBROS}
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
              <div className="flex my-5">
                <DatePickerCustom
                  name="fecha"
                  register={register}
                  rules={rules.fecha}
                  error={errors.fecha}
                  label={"Fecha"}
                  hideLabelTitle
                  className="max-w-[208px]"
                  // value={fecha}
                  control={control}
                  // setValue={setFecha}
                  setValueRHF={setValueForm}
                  value={params.fecha}
                  setValueParams={updateQuery}
                  // disabled={isRecurrent || !editInformeCreated}
                />
              </div>
            </form>
            {isLoading ? (
              <Spinner type="loadingPage" className="py-10" />
            ) : (
              <>
                <Table
                  columns={columns}
                  dataSource={values}
                  pagination={false}
                  rowKey="id_club"
                  className="table_club_miembros table_ant_custom shadow-md overflow-x-auto border-b border-gray-200 rounded-lg"
                  expandable={{
                    expandedRowRender: expandedTableMiembros,
                  }}
                  expandIcon={({ expanded, onExpand, record }) =>
                    expanded ? (
                      <div
                        className="h-full flex items-center justify-center cursor-pointer"
                        onClick={(e) => onExpand(record, e)}
                      >
                        <MinusIcon className="h-5 w-5 text-blue-500 flex items-center" />
                      </div>
                    ) : (
                      <div
                        className="h-full flex items-center justify-center cursor-pointer"
                        onClick={(e) => onExpand(record, e)}
                      >
                        <PlusIcon className="h-5 w-5 text-blue-500 flex items-center" />
                      </div>
                    )
                  }
                />
                {!isEmpty(values) ? (
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
          </>
        )}
      </div>
      <Modal isShow={isShow}>
        <AgregarMiembros hide={hide} refetch={refetch} />
      </Modal>
      <ModalDelete isShow={isShowDelete}>
        <DeleteMiembro hide={hideDelete} data={dataDelete} refetch={refetch} />
      </ModalDelete>
      <ModalViewOnlyMember isShow={isShowViewOnlyMember}>
        <ViewAllOnlyMiembros
          hide={hideViewOnlyMember}
          data={dataViewOnlyMember}
          refetch={refetch}
        />
      </ModalViewOnlyMember>
      <ModalHelp isShow={isShowHelp}>
        <HelpListMiembros hide={hideHelp} />
      </ModalHelp>
    </LayoutDashboard>
  );
};

export default Miembros;
