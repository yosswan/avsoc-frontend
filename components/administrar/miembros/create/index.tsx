import { Input } from "components/common/form/input";
import { GetServerSideProps } from "next";
import * as React from "react";
import AsyncSelect from "react-select/async";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "components/common/button/button";
// import { useQuery } from "react-query";
// import { UseQueryEnums } from "consts/useQueryEnums";
import { ConsejosRegionalesServices, PersonasServices } from "services";
import { Spinner } from "components/common/spinner/spinner";
import { useToasts } from "react-toast-notifications";
import { Upload, message } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Typography } from "components/common/typography";
import clsx from "clsx";
import { GenerateErrorToast } from "lib/helper";
import { isNil, isEmpty, get } from "lodash";
import { PastoresService } from "services/Pastores";
import { DistritosServices } from "services/Distritos";
import { customStyles } from "consts/stylesReactSelect.helper";
import { AncianosService } from "services/Ancianos";
import { IglesiasServices } from "services/Iglesias";
import { MiembrosServices } from "services/Miembros";
import { InputListSearch } from "components/common/form/input-list-search";
import { OptionType } from "interfaces";
import { useQuery } from "react-query";
import { UseQueryEnums } from "consts/useQueryEnums";
import { CargosServices } from "services/Cargos";

interface TypeMiembros {
  value: Number;
  label: string;
}

const AgregarMiembros = ({ hide, refetch }: any) => {
  const [selectValueMiembros, setSelectValueMiembros] =
    React.useState<[TypeMiembros]>();

  const { data: AllCargos, isLoading: isLoadingCargos } = useQuery<any>(
    [UseQueryEnums.GET_ALL_CARGOS],
    () => CargosServices.getAll()
  );

  const [dataCargos, setDataCargos] = React.useState();

  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [dataMiembros, setDataMiembros] = React.useState<any>();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({ mode: "onChange" });
  const rules = {
    name: {
      required: { value: true, message: "Este campo es requerido" },
    },
    miembros: {
      required: { value: true, message: "Este campo es requerido" },
    },
  };

  React.useEffect(() => {
    if (!isNil(AllCargos)) {
      let aux: any = [];
      AllCargos.data.map((item: any) => {
        aux.push({
          text: item.nombre,
          value: item.id,
          disabled: false,
          placeholder: false,
        });
      });
      setDataCargos(aux);
    }
  }, [AllCargos]);

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control, // control props comes from useForm (optional: if you are using FormContext)
      name: "miembros", // unique name for your Field Array
    }
  );
  const handleSubmitData = (data: any) => {
    setIsLoading(true);
    MiembrosServices.create(data)
      .then((response: any) => {
        addToast("Miembros agregados exitosamente", {
          appearance: "success",
        });
        refetch();
        hide();
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  };
  const handleChangeSelectMiembros = (selected: any, eventData: any) => {
    if (eventData?.action === "remove-value") {
      const pos = selectValueMiembros?.findIndex(
        (item: any) => item.value === eventData.removedValue?.value
      );
      remove(pos);
    }
    setSelectValueMiembros(selected);
  };

  const promiseOptionsMiembros = (inputValue: any, callback: any) => {
    if (!inputValue && !dataMiembros) {
      return MiembrosServices.getAllMiembrosAvailables().then((response) => {
        setDataMiembros(response);
        const options = response?.data?.map((item: any) => {
          return {
            value: item.cedula,
            label: `${item.nombres} ${item.apellidos}`,
          };
        });
        return options;
      });
    } else {
      let filter = dataMiembros?.data?.filter((item: any) =>
        item.nombres
          ?.toString()
          ?.toLowerCase()
          .includes(inputValue?.toString()?.toLowerCase())
      );
      if (isEmpty(filter) || isNil(filter)) {
        filter = dataMiembros?.data?.filter((item: any) =>
          item.apellidos
            ?.toString()
            ?.toLowerCase()
            .includes(inputValue?.toString()?.toLowerCase())
        );
      }

      const options = filter?.map((item: any) => {
        return {
          value: item.cedula,
          label: `${item.nombres} ${item.apellidos}`,
        };
      });
      return callback(options);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Agregar Miembros</h2>
      <div className="container-form mt-5 mb-11 text-left">
        {isLoading || isLoadingCargos ? (
          <Spinner type="loadingPage" className="py-10" />
        ) : (
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <p className={"ml-3 font-normal mb-2 block f-18"}>Miembros</p>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={promiseOptionsMiembros}
                styles={customStyles}
                value={selectValueMiembros}
                className={"text-sm"}
                onChange={handleChangeSelectMiembros}
                isMulti
              />
            </div>

            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              {!isEmpty(selectValueMiembros) && (
                <h3 className="text-xl font-bold text-center">
                  Seleccione el Cargo de los Miembros
                </h3>
              )}
              {selectValueMiembros?.map((field: any, index) => (
                <React.Fragment key={field.value}>
                  <span className="ml-3 text-base font-bold mt-4 block -mb-2">
                    {field.label}
                  </span>
                  <InputListSearch
                    name={`miembros[${index}].cargoSelected`}
                    className="mb-4"
                    options={dataCargos || []}
                    register={register}
                    rules={rules.miembros}
                    required
                    error={errors.cargos}
                    customClassNamesOptions="max-h-32 w-full overflow-auto bg-white py-1 text-base sm:text-sm"
                    handleChange={(data: OptionType) => {
                      append({
                        ...selectValueMiembros[index],
                        cargoSelected: { ...data },
                      });
                    }}
                  />
                </React.Fragment>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-4 mt-10 px-4 md:px-20">
              <Button
                labelProps="f-18 font-normal"
                label={"Cancelar"}
                // loading={isLoading}
                boderRadius="rounded-full"
                size="full"
                type="button"
                sizesButton="py-3"
                onClick={hide}
                // disabled={!isDirty || !isValid || !!isLoading}
              />
              <Button
                labelProps="f-18 font-normal"
                label={"Crear"}
                fill
                // loading={isLoading}
                boderRadius="rounded-full"
                size="full"
                type="submit"
                sizesButton="py-3"
                // disabled={
                //   !isDirty || !isValid || !!isLoading
                //   // isEmpty(selectValueMiembros?.label) ||
                //   // isNil(selectValueMiembros?.label) ||
                //   // isNil(selectValueMiembros)
                // }
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AgregarMiembros;
