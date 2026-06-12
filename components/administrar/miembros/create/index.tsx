import * as React from "react";
import AsyncSelect from "react-select/async";
import { useForm } from "react-hook-form";
import { Button } from "components/common/button/button";
import { Spinner } from "components/common/spinner/spinner";
import { useToasts } from "react-toast-notifications";
import { GenerateErrorToast } from "lib/helper";
import { isNil, isEmpty } from "lodash";
import { customStyles } from "consts/stylesReactSelect.helper";
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
  const [dataMiembros, setDataMiembros] = React.useState<any>();
  const [cargosPorMiembro, setCargosPorMiembro] = React.useState<Record<number, OptionType>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const { register, handleSubmit } = useForm();

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

  const handleSubmitData = () => {
    setSubmitted(true);

    if (isEmpty(selectValueMiembros)) {
      addToast("Debe seleccionar al menos un miembro", { appearance: "error" });
      return;
    }

    if (selectValueMiembros?.some((_, i) => !cargosPorMiembro[i])) {
      addToast("Debe seleccionar un cargo para cada miembro", { appearance: "error" });
      return;
    }

    setIsLoading(true);
    const payload = {
      miembros: selectValueMiembros?.map((miembro: any, i: number) => ({
        ...miembro,
        cargoSelected: cargosPorMiembro[i],
      })) || [],
    };
    MiembrosServices.create(payload)
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
      setCargosPorMiembro((prev) => {
        const next = { ...prev };
        delete next[pos as number];
        return next;
      });
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
                onChange={(selected, eventData) => {
                  handleChangeSelectMiembros(selected, eventData);
                  setSubmitted(false);
                }}
                isMulti
              />
              {submitted && isEmpty(selectValueMiembros) && (
                <span className="flex items-center mt-3 text-alert-error font-montserrat text-sm">
                  Debe seleccionar al menos un miembro.
                </span>
              )}
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
                    error={submitted && !cargosPorMiembro[index] ? { message: "Este campo es requerido" } : undefined}
                    customClassNamesOptions="max-h-32 w-full overflow-auto bg-white py-1 text-base sm:text-sm"
                    handleChange={(data: OptionType) => {
                      setCargosPorMiembro((prev) => ({
                        ...prev,
                        [index]: data,
                      }));
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
