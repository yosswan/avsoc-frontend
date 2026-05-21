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
import { isNil, isEmpty } from "lodash";
import { PastoresService } from "services/Pastores";
import { IglesiasServices } from "services/Iglesias";
import { customStyles } from "consts/stylesReactSelect.helper";
import { DirectorService } from "services/Director";
import { InputList } from "components/common/form/input-list";
import { InputListSearch } from "components/common/form/input-list-search";
import { OptionType } from "interfaces";
import { ClubesServices } from "services/Clubes";
import { Icons } from "consts";
import { Icon } from "components/icon";
import { optionsType } from "consts/typesSelects";

const CreateClub = ({ hide, refetch }: any) => {
  const [selectValueDirector, setSelectValueDirector] =
    React.useState<{ value: Number; label: string }>();
  const [selectValueIglesias, setSelectValueIglesias] =
    React.useState<{ value: Number; label: string }>();
  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState();
  const [dataDirector, setDataDirector] = React.useState<any>();
  const [dataIglesias, setDataIglesias] = React.useState<any>();
  // const { data: presidentesConsejo, isLoading } = useQuery<any>(
  //   [UseQueryEnums.GET_PRESIDENTES_CONSEJO],
  //   () => ConsejosRegionalesServices.getAllPastores()
  // );

  // console.log("presiii", presidentesConsejo);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm<any>({ mode: "onChange" });

  const rules = {
    name: {
      required: { value: true, message: "Este campo es requerido" },
    },
    // blanco_estudios: {
    //   required: { value: true, message: "Este campo es requerido" },
    // },
    tipo: {
      required: { value: true, message: "Este campo es requerido" },
    },
  };

  const handleSubmitData = (data: any) => {
    const FinalData = {
      nombre: data?.name,
      // blanco_estudios_biblicos: data.blanco_estudios,
      id_iglesia: selectValueIglesias?.value,
      cedula_director: selectValueDirector?.value,
      tipo: data.tipo.value,
    };

    setIsLoading(true);

    ClubesServices.create(FinalData)
      .then((response: any) => {
        addToast("Club creado exitosamente", {
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
  const handleChangeSelectDirector = (selected: any) => {
    setSelectValueDirector(selected);
  };
  const handleChangeSelectConsejosIglesias = (selected: any) => {
    setSelectValueIglesias(selected);
  };

  const promiseOptionsDirector = (inputValue: any, callback: any) => {
    if (!inputValue && !dataDirector) {
      return DirectorService.getAll({
        id_club: 0,
      }).then((response) => {
        setDataDirector(response);
        const options = response?.data?.map((item: any) => {
          return {
            value: item.cedula,
            label: `${item.nombres} ${item.apellidos}`,
          };
        });
        return options;
      });
    } else {
      let filter = dataDirector?.data?.filter((item: any) =>
        item.nombres
          ?.toString()
          ?.toLowerCase()
          .includes(inputValue?.toString()?.toLowerCase())
      );
      if (isEmpty(filter) || isNil(filter)) {
        filter = dataDirector?.data?.filter((item: any) =>
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

  const promiseOptionsIglesias = (inputValue: any, callback: any) => {
    if (!inputValue && !dataIglesias) {
      return IglesiasServices.getAll().then((response) => {
        setDataIglesias(response);
        const options = response?.data?.map((item: any) => {
          return { value: item.id, label: item.nombre };
        });
        return options;
      });
    } else {
      const filter = dataIglesias?.data?.filter((item: any) =>
        item.nombre
          ?.toString()
          ?.toLowerCase()
          .includes(inputValue?.toString()?.toLowerCase())
      );

      const options = filter?.map((item: any) => {
        return { value: item.id, label: item.nombre };
      });
      return callback(options);
    }
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Crear Club</h2>
      <div className="container-form mt-5 text-left">
        {isLoading ? (
          <Spinner type="loadingPage" className="py-10" />
        ) : (
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <Input
              name="name"
              title="Nombre"
              labelVisible
              isFill={!!watch("name")}
              register={register}
              rules={rules.name}
              error={errors.name}
              className="mb-3 md:mb-5"
              otherStyles="pt-3 pb-3 rounded-full text-sm"
            />

            <InputListSearch
              // myDefaultValue={myDefaultValue}
              name="tipo"
              title="Tipo"
              className="mb-4"
              options={optionsType}
              register={register}
              // rules={selectRules}
              // error={selectError}
              // isFill={selectIsFill}
              // handleChange={handleChange}
              rules={rules.tipo}
              error={errors.tipo}
              handleChange={(data: OptionType) =>
                setValue("tipo", data, { shouldValidate: true })
              }
              // myDefaultValue={watch("tipo")}
              // onChangeCustom={(event: any) => {
              //   console.log("siiuuuu", event.target.value);
              //   setValue("tipo", event.target.value);
              // }}
            />

            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <p className={"ml-3 font-normal mb-2 block f-18"}>Iglesia</p>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={promiseOptionsIglesias}
                styles={customStyles}
                value={selectValueIglesias}
                className={"text-sm"}
                onChange={handleChangeSelectConsejosIglesias}
              />
            </div>
            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <p className={"ml-3 font-normal mb-2 block f-18"}>Director</p>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={promiseOptionsDirector}
                styles={customStyles}
                value={selectValueDirector}
                className={"text-sm"}
                onChange={handleChangeSelectDirector}
              />
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
                //   !isDirty ||
                //   !isValid ||
                //   !!isLoading ||
                //   isEmpty(selectValueDirector?.label) ||
                //   isNil(selectValueDirector?.label) ||
                //   isNil(selectValueDirector) ||
                //   isEmpty(selectValueIglesias?.label) ||
                //   isNil(selectValueIglesias?.label) ||
                //   isNil(selectValueIglesias)
                //   // isEmpty(imageUrl) ||
                //   // isNil(imageUrl)
                // }
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateClub;
