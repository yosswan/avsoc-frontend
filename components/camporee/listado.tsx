import { InputText } from "components/common/form/input-text";
import { Icon } from "components/icon";
import { LayoutDashboard } from "components/layout";
import { appRouter, Icons } from "consts";
import { useModal } from "hooks/modal";
import * as React from "react";
import { useForm } from "react-hook-form";
import { UseQueryEnums } from "consts/useQueryEnums";
import { useQuery } from "react-query";
import { Spinner } from "components/common/spinner/spinner";
import { TableSkeleton } from "components/common/skeleton";
import { useQueryParams } from "consts/query.helper";
import { IconWithText } from "components/icon-with-text";
import DataTableComponent, {
  TableColumnType,
} from "components/data-table/DataTableComponent";
import clsx from "clsx";
import { get, isNil, isEmpty, debounce } from "lodash";
import { CamporeeServices } from "services/Camporee";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import { formatDateComplete } from "lib/helper";
import Restricted from "context/PermissionProvider/Restricted";
import Link from "next/link";
import { Button } from "components/common/button";
import { Tooltip } from "antd";
import moment from "moment";
import { Help } from "components/common/help";
import { ExtendedTypesSelectEnums } from "consts/typesSelectEnum";
import dynamic from "next/dynamic";
import { useUser } from "hooks/user";

const CreateCamporee = dynamic(() => import("components/camporee/create-camporee"));
const HelpListCamporee = dynamic(() => import("help/camporee/listado"));

type Params = {
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
  userId?: number;
	type?: ExtendedTypesSelectEnums;
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

const CamporeeList = ({ type, festival = false }: { type?: ExtendedTypesSelectEnums, festival?: boolean }) => {
  const {
    Modal: ModalCreate,
    hide: hideCreate,
    isShow: isShowCreate,
    show: showCreate,
  } = useModal();
  const {
    Modal: ModalHelp,
    hide: hideHelp,
    isShow: isShowHelp,
    show: showHelp,
  } = useModal();
  const [dataEdit, setDataEdit] = React.useState<any>();
  const [onSearch, setOnSearch] = React.useState(false);
  const [dataView, setDataView] = React.useState<any>();
  const [params, setValue] = useQueryParams<Params>({ limit: 8, type });
  const debouncedSearch = React.useMemo(
    () => debounce((term: string) => {
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
    data: response,
    isLoading,
    refetch,
  } = useQuery<any>([UseQueryEnums.GET_ALL_CAMPOREE, params], () =>
    CamporeeServices.getAll(params)
  );
  const updateQuery = (key: string, value: number | string | undefined) => {
    setValue({ [key]: value });
  };

  const {
    register,
    handleSubmit,
    setValue: setValueForm,
    formState: { errors },
    watch,
  } = useForm({ mode: "onChange" });

  const handleSubmitData = (data: any) => {
  };

  const columns: TableColumnType[] = [
    {
      name: "nombre",
      label: "Nombre",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <Link
          href={`${appRouter.dashboard.href}${festival ? appRouter.dashboard.subLinks.festival.href : appRouter.dashboard.subLinks.camporee.href}${type && !festival ? `/${type}` : ''}/${appRouter.dashboard.subLinks.camporee.subLinks.detail.href}/${value.id}`}
        >
          <a>
            <IconWithText icon={value?.logo} text={value?.nombre} />
          </a>
        </Link>
      ),
      // <IconWithText icon={value?.logo} text={value?.nombre} />
    },
    {
      name: "tipo",
      label: "Tipo",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500 capitalize">{value?.tipo}</span>
      ),
    },

    {
      name: "fechaInicio",
      label: "Fecha Inicio",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500 capitalize">
          {moment(value?.fecha_inicio).format(formatDateComplete)}
        </span>
      ),
    },
    {
      name: "fechaFin",
      label: "Fecha Fin",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <span className="text-gray-500">
          {" "}
          {moment(value?.fecha_fin).format(formatDateComplete)}
        </span>
      ),
    },
    {
      name: "acciones",
      label: "Acciones",
      thClassName: HeaderClassName,
      tdClassName: DataClassName,
      selector: (value: any) => (
        <div className="flex items-center">
          <Restricted
            module={ModuleEnums.CAMPOREE}
            typePermisse={PermissionsEnums.VIEW}
          >
            <Tooltip title="Ver detalle">
              <div className="flex-shrink-0 h-10 w-8 ml-5">
                <Link
                  href={`${appRouter.dashboard.href}${festival ? appRouter.dashboard.subLinks.festival.href : appRouter.dashboard.subLinks.camporee.href}${type ? `/${type}` : ''}/${appRouter.dashboard.subLinks.camporee.subLinks.detail.href}/${value.id}`}
                >
                  <a>
                    <Icon
                      src={Icons.more}
                      fill="var(--color-primary)"
                      className="max-w-[50px] w-8 cursor-pointer"
                    />
                  </a>
                </Link>
              </div>
            </Tooltip>
          </Restricted>
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
    <LayoutDashboard title={festival ? 'Festival' : 'Camporee'}>
      <div className="lg:px-20 mt-12">
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
              disabled={isLoading}
            />
            <Restricted
              module={ModuleEnums.CAMPOREE}
              typePermisse={PermissionsEnums.ADD}
            >
              <div
                className={clsx("px-2", { "pointer-events-none opacity-50": isLoading })}
                onClick={isLoading ? undefined : showCreate}
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
            </Restricted>
          </div>
        </form>
        {isLoading ? (
          <TableSkeleton rows={limit} columns={columns.length} />
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
      </div>
      <ModalCreate isShow={isShowCreate}>
        <CreateCamporee hide={hideCreate} refetch={refetch} />
      </ModalCreate>
      <ModalHelp isShow={isShowHelp}>
        <HelpListCamporee hide={hideHelp} />
      </ModalHelp>
    </LayoutDashboard>
  );
};

export default CamporeeList;