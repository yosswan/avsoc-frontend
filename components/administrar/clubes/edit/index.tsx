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
import { PresidentesConsejoRegional } from "services/PresidentesConsejoRegional";
import { DistritosServices } from "services/Distritos";
import { PastoresService } from "services/Pastores";
import { customStyles } from "consts/stylesReactSelect.helper";
import { IglesiasServices } from "services/Iglesias";
import { AncianosService } from "services/Ancianos";
import { ClubesServices } from "services/Clubes";
import { DirectorService } from "services/Director";
import { OptionType } from "interfaces";
import { InputListSearch } from "components/common/form/input-list-search";
import { RoleEnums } from "consts/rolesEnum";
import { useUser } from "hooks/user";
import { Icons } from "consts";
import { optionsType } from "consts/typesSelects";
import { FileService } from "services/Image";
import { RcFile } from "antd/lib/upload";

const EditClub = ({ data, hide, refetch }: any) => {
  const [selectValueDirector, setSelectValueDirector] = React.useState<{
    value: Number;
    label: string;
  }>({ value: data.cedula_director, label: data.director });
  const [selectValueIglesias, setSelectValueIglesias] = React.useState<{
    value: Number;
    label: string;
  }>({
    value: data.id_iglesia,
    label: data.iglesia,
  });
  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(data?.logo);
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
  } = useForm({ mode: "onChange" });
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: "redes",
    }
  );
  const rules = {
    name: {
      required: { value: true, message: "Este campo es requerido" },
    },
    lema: {
      //required: { value: true, message: "Este campo es requerido" },
    },
    // blanco_estudios: {
    //   required: { value: true, message: "Este campo es requerido" },
    // },
    direccion: {
      //required: { value: true, message: "Este campo es requerido" },
    },
    tipo: {
      required: { value: true, message: "Este campo es requerido" },
    },
    redes: {
      //required: { value: true, message: "Este campo es requerido" },
    },
    redesUrl: {
      //required: { value: true, message: "Este campo es requerido" },

      pattern: {
        value:
          /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
        message: "URL invalida",
      },
    },
  };

  React.useEffect(() => {
    if (!isNil(data) && !isEmpty(data)) {
      if (!isNil(data.nombre) && !isEmpty(data.nombre)) {
        setValue("name", data.nombre, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("direccion", data.direccion, {
          shouldValidate: true,
          shouldDirty: true,
        });
        // setValue("blanco_estudios", data.blanco_estudios_biblicos, {
        //   shouldValidate: true,
        //   shouldDirty: true,
        // });
        setValue("lema", data.lema, {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue("tipo", data?.tipo, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (!isEmpty(data?.redes)) {
        const aux: any = [];
        data?.redes.forEach((item: any) => {
          aux.push({ name: item.nombre, url: item.url });
        });
        append(aux);
      }
    }
  }, []);

  const handleSubmitData = (form: any) => {
    const FinalData = {
      nombre: form?.name,
      logo: imageUrl,
      lema: form.lema,
      direccion: form.direccion,
      // blanco_estudios_biblicos: form.blanco_estudios,
      id_iglesia: selectValueIglesias?.value,
      cedula_director: selectValueDirector?.value,
      tipo: form.tipo.value ? form.tipo.value : form.tipo,
      redes: form.redes,
    };

    setIsLoading(true);

    ClubesServices.edit(FinalData, data.id)
      .then((response: any) => {
        addToast("Club editado exitosamente", {
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
  React.useEffect(() => {
  }, [selectValueDirector]);

  const promiseOptionsDirector = (inputValue: any, callback: any) => {
    if (!inputValue && !dataDirector) {
      return DirectorService.getAll({
        id_club: data.id,
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

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = async (info: any) => {
    if (info.file.status === "uploading") {
			setImageUrl('');
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const imageUrl = await FileService.upload(info.file.originFileObj as RcFile);
			setImageUrl(imageUrl);
			setLoading(false);
    }
  };

  const uploadButton = (
    <div>
      {loading ? (
        <LoadingOutlined />
      ) : (
        <PlusOutlined />
      )}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const profile = useUser();
  const dataUser = get(profile, "data", []);
  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Editar Club</h2>
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

            <Input
              name="direccion"
              title="Direccion"
              labelVisible
              isFill={!!watch("direccion")}
              register={register}
              rules={rules.direccion}
              error={errors.direccion}
              className="mb-3 md:mb-5"
              otherStyles="pt-3 pb-3 rounded-full text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-1">
                <Input
                  name="lema"
                  title="Lema"
                  labelVisible
                  isFill={!!watch("lema")}
                  register={register}
                  rules={rules.lema}
                  error={errors.lema}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                />
              </div>
              {/* <div className="col-span-1">
                <Input
                  name="blanco_estudios"
                  title="Blanco Estudios Biblicos"
                  labelVisible
                  isFill={!!watch("blanco_estudios")}
                  register={register}
                  rules={rules.blanco_estudios}
                  error={errors.blanco_estudios}
                  className="mb-3 md:mb-5"
                  type="number"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                />
              </div> */}
            </div>
            {dataUser.scope_actual !== RoleEnums.DIRECTOR &&
              dataUser.scope_actual !== RoleEnums.SECRETARIO_CLUB && (
                <>
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
                    myDefaultValue={{
                      value: data.tipo,
                      text: data?.tipo,
                      disabled: false,
                      placeholder: false,
                    }}
                    // onChangeCustom={(event: any) => {
                    //   console.log("siiuuuu", event.target.value);
                    //   setValue("tipo", event.target.value);
                    // }}
                  />

                  <div className={"relative py-2 w-full mb-3 md:mb-5"}>
                    <p className={"ml-3 font-normal mb-2 block f-18 is-required"}>
                      Iglesia
                    </p>
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
                    <p className={"ml-3 font-normal mb-2 block f-18 is-required"}>
                      Director
                    </p>
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
                </>
              )}
            <div className="border-2 border-yellow mt-7 py-4 px-2 rounded-md mb-4">
              <Typography
                type="label"
                className={clsx(
                  "ml-3 font-bold mb-2 block text-xl text-center"
                )}
              >
                Redes
              </Typography>
              {fields.map((item, index) => {
                return (
                  <div key={item.id} className="flex gap-3 items-center">
                    {/* <input
                    name={`test[${index}].firstName`}
                    defaultValue={`${item.firstName}`} // make sure to set up defaultValue
                    ref={register()}
                  /> */}

                    <Input
                      name={`redes[${index}].name`}
                      title="Nombre"
                      labelVisible
                      // isFill={!!watch(`redes[${index}].name`)}
                      register={register}
                      rules={rules.redes}
                      error={
												Array.isArray(errors.redes) 
												? errors.redes[index]?.name 
												: undefined
											}
                      className="mb-3 md:mb-5"
                      otherStyles="pt-3 pb-3 rounded-full text-sm"
                    />
                    <Input
                      name={`redes[${index}].url`}
                      title="URL"
                      labelVisible
                      // isFill={!!watch(`redes[${index}].url`)}
                      register={register}
                      rules={rules.redesUrl}
                      error={
												Array.isArray(errors.redes) 
												? errors.redes[index]?.url 
												: undefined
											}
                      className="mb-3 md:mb-5"
                      otherStyles="pt-3 pb-3 rounded-full text-sm"
                    />
                    <button
                      type="button"
                      className={clsx({
                        "cursor-not-allowed pointer-events-none":
                          fields.length === 1,
                      })}
                      onClick={() => {
                        if (fields.length > 1) remove(index);
                      }}
                    >
                      <img
                        src={Icons.iconTrash}
                        className={clsx(
                          {
                            "cursor-not-allowed pointer-events-none":
                              fields.length === 1,
                          },
                          "w-16 mt-2"
                        )}
                        alt=""
                      />
                    </button>
                  </div>
                );
              })}
              <div className="text-center">
                <button
                  type="button"
                  className="text-gray-800 text-sm font-bold text-center"
                  onClick={() => {
                    append({ name: "", url: "" });
                  }}
                >
                  {`+ Agregar red`}
                </button>
              </div>
            </div>
            <div className="flex-auto">
              <Typography
                type="label"
                className={clsx("ml-3 font-normal mb-2 block f-18")}
              >
                Icon
              </Typography>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
                ) : (
                  uploadButton
                )}
              </Upload>
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
                label={"Guardar"}
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

export default EditClub;
