import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "components/common/button/button";
import { AuthService, PersonasServices } from "services";
import { Spinner } from "components/common/spinner/spinner";
import { useToasts } from "react-toast-notifications";
import { formatDates, GenerateErrorToast } from "lib/helper";
import { get } from "lodash";
import { useRouter } from "next/router";
import { useUser } from "hooks/user";
import { InputEmail } from "components/common/form/input-email";
import { InputListSearch } from "components/common/form/input-list-search";
import { Input } from "components/common/form/input";
import { DatePickerCustom } from "components/common/date-picker/datePicker";
import { Logo } from "components/logo";
import { Typography } from "components/common/typography";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { IglesiasServices } from "services/Iglesias";
import AsyncSelect from "react-select/async";
import { customStyles } from "consts/stylesReactSelect.helper";
import {
  optionsTypeEstadoCivil,
  optionsTypeSexoMasculinoAndFemenino,
  optionsTypesSangre,
} from "consts/typesSelects";
import { OptionType } from "interfaces";
import { InputImage } from "components/common/input-image";
import {
  TypesSelectEstadoCivilMap,
  TypesSelectEstadoCivilMapLetterToWord,
  TypesSelectSexoEnums,
  TypesSelectSexoRegisterEnums,
  TypesSelectSexoRegisterMap,
  TypesSelectSexoRegisterMapLetterToWord,
} from "consts/typesSelectEnum";
import moment from "moment";

const EditPersonalInformation = ({ data, hide, refetch }: any) => {

  const [imageUrl, setImageUrl] = React.useState(data?.user?.foto);
  const [step, setStep] = React.useState<"first" | "second">("first");
  const [loading, setLoading] = React.useState(false);
  const [dataIglesias, setDataIglesias] = React.useState<any>();
  const [selectValueIglesias, setSelectValueIglesias] = React.useState<{
    value: Number;
    label: string;
  }>({
    value: data.user.id_iglesia,
    label: data.user.iglesia,
  });
  const [fechaNacimiento, setFechaNacimiento] = React.useState(
    data?.user?.fecha_nacimiento
  );
  const [fechaBautizo, setFechaBautizo] = React.useState(
    data?.user?.fecha_bautizo
  );
  const { addToast } = useToasts();
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isDirty, isValid },
    watch,
    control,
  } = useForm<any>({
    mode: "onChange",
    defaultValues: {
      username: data?.user?.username,
      cedula: data?.user?.cedula,
      names: data?.user?.nombres,
      last_name: data?.user?.apellidos,
      direccion: data?.user?.direccion,
      estado_civil: data?.user?.estadoCivil,
      tipo_sangre: data?.user?.tipoSangre,
      iglesia: data?.user?.iglesia,
      fecha_nacimiento: data?.user?.fecha_nacimiento,
      fecha_bautizo: data?.user?.fecha_bautizo,
      alergias: data?.user?.alergias,
      enfermedades: data?.user?.enfermedades,
      profesion: data?.user?.profesion,
      foto: data?.user?.foto,
    },
  });
  const rules = {
    username: {
      required: { value: true, message: "Este campo es requerido" },
    },
    names: {
      required: { value: true, message: "Este campo es requerido" },
    },
    last_name: {
      required: { value: true, message: "Este campo es requerido" },
    },
    cedula: {
      required: { value: true, message: "Este campo es requerido" },
    },
    fecha_nacimiento: {
      required: { value: true, message: "Este campo es requerido" },
    },
    tipo_sangre: {
      required: { value: true, message: "Este campo es requerido" },
    },
    alergias: {
      // required: { value: true, message: "Este campo es requerido" },
    },
    enfermedades: {
      // required: { value: true, message: "Este campo es requerido" },
    },
    fecha_bautizo: {
      // required: { value: true, message: "Este campo es requerido" },
    },
    sexo: {
      required: { value: true, message: "Este campo es requerido" },
    },
    estado_civil: {
      required: { value: true, message: "Este campo es requerido" },
    },
    check: {},
  };

  const handleSubmitData = (form: any) => {
    const finalData = {
      username: form.username,
      cedula: form.cedula,
      nombres: form.names,
      apellidos: form.last_name,
      fecha_nacimiento: moment(form.fecha_nacimiento).format(formatDates),
      direccion: form.direccion,
      tipo_sangre: form.tipo_sangre?.value || form?.tipo_sangre,
      alergias: form.alergias,
      enfermedades: form.enfermedades,
      fecha_bautizo: moment(form.fecha_bautizo).format(formatDates),
      profesion: form.profesion,
      sexo: TypesSelectSexoRegisterMap[form.sexo?.value || form?.sexo],
      estado_civil:
        TypesSelectEstadoCivilMap[
          form.estado_civil?.value || form?.estado_civil
        ],
      foto: form?.foto,
      id_iglesia: selectValueIglesias?.value
        ? selectValueIglesias?.value
        : null,
    };

    setIsLoading(true);
    PersonasServices.changeInformationPersonal(finalData)
      .then((response: any) => {
        addToast("Información personal actualizada exitosamente", {
          appearance: "success",
        });
        hide();
        refetch();
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error information personal: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
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

  const handleChange = (info: any) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl: any) => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

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
  const handleChangeSelectConsejosIglesias = (selected: any) => {
    setSelectValueIglesias(selected);
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Editar Información</h2>
      <div className="container-form mt-5 mb-11 text-left">
        {isLoading ? (
          <Spinner type="loadingPage" className="py-10" />
        ) : (
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <div className="flex-wrap flex-auto lg:flex-nowrap flex gap-4">
                <Input
                  name="username"
                  title="Nombre de usuario"
                  labelVisible
                  isFill={!!watch("username")}
                  register={register}
                  rules={rules.username}
                  error={errors.username}
                  className="mb-3 md:mb-5"
                  otherStyles="rounded-full text-sm pt-3 pb-3"
                />
                <Input
                  name="cedula"
                  title="Cedula"
                  labelVisible
                  isFill={!!watch("cedula")}
                  register={register}
                  rules={rules.cedula}
                  error={errors.cedula}
                  className="mb-3 md:mb-5"
                  otherStyles="rounded-full text-sm pt-3 pb-3"
                />
              </div>
              <div className="flex-wrap flex-auto lg:flex-nowrap flex gap-4">
                <Input
                  name="names"
                  title="Nombres"
                  labelVisible
                  isFill={!!watch("names")}
                  register={register}
                  rules={rules.names}
                  error={errors.names}
                  className="mb-3 md:mb-5"
                  otherStyles="rounded-full text-sm pt-3 pb-3"
                />
                <Input
                  name="last_name"
                  title="Apellidos"
                  labelVisible
                  isFill={!!watch("last_name")}
                  register={register}
                  rules={rules.last_name}
                  error={errors.last_name}
                  className="mb-3 md:mb-5"
                  otherStyles="rounded-full text-sm pt-3 pb-3"
                />
              </div>
              <div className="flex-wrap flex-auto lg:flex-nowrap flex gap-4 mb-5">
                <DatePickerCustom
                  name="fecha_nacimiento"
                  register={register}
                  rules={rules.fecha_nacimiento}
                  error={errors.fecha_nacimiento}
                  label={"Fecha de nacimiento"}
                  value={fechaNacimiento}
                  control={control}
                  setValue={setFechaNacimiento}
                  setValueRHF={setValue}
                  // disabled={isRecurrent || !editInformeCreated}
                />
                <DatePickerCustom
                  register={register}
                  rules={rules.fecha_bautizo}
                  error={errors.fecha_bautizo}
                  name="fecha_bautizo"
                  label={"Fecha bautizo"}
                  value={fechaBautizo}
                  setValue={setFechaBautizo}
                  control={control}
                  setValueRHF={setValue}
                  // disabled={!editInformeCreated}
                />
              </div>
              <div className="flex-wrap flex-auto lg:flex-nowrap flex gap-4 mb-5 items-center">
                <div className="flex-auto">
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
              </div>
              <Input
                name="direccion"
                labelVisible
                title="Dirección"
                isFill={!!watch("direccion")}
                register={register}
                error={errors.direccion}
                className="mb-3 md:mb-5"
                otherStyles="rounded-full text-sm pt-3 pb-3"
              />
              <div className="flex-wrap lg:flex-nowrap flex gap-4 mb-5 w-full">
                <InputListSearch
                  name="tipo_sangre"
                  title="Tipo de sangre"
                  className="mb-4 flex-1 w-full"
                  options={optionsTypesSangre}
                  register={register}
                  rules={rules.tipo_sangre}
                  error={errors.tipo_sangre}
                  handleChange={(data: OptionType) =>
                    setValue("tipo_sangre", data, { shouldValidate: true })
                  }
                  // myDefaultValue={watch("tipo_sangre")}
                  classNamesContainer="flex-auto w-full"
                  myDefaultValue={{
                    value: data?.user?.tipo_sangre,
                    text: data?.user?.tipo_sangre,
                    disabled: false,
                    placeholder: false,
                  }}
                />

                <Input
                  name="profesion"
                  labelVisible
                  title="Profesión"
                  isFill={!!watch("profesion")}
                  register={register}
                  error={errors.profesion}
                  className="mb-3 md:mb-5"
                  otherStyles="rounded-full text-sm pt-3 pb-3"
                />
              </div>
              <Input
                name="alergias"
                labelVisible
                title="Alergias"
                isFill={!!watch("alergias")}
                register={register}
                rules={rules.alergias}
                isTextArea
                error={errors.alergias}
                className="mb-3 md:mb-5"
                otherStyles="rounded-lg text-sm pt-3 pb-3"
              />
              <Input
                name="enfermedades"
                labelVisible
                title="Enfermedades"
                isTextArea
                isFill={!!watch("enfermedades")}
                register={register}
                rules={rules.enfermedades}
                error={errors.enfermedades}
                className="mb-3 md:mb-5"
                otherStyles="rounded-lg text-sm pt-3 pb-3"
              />
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-1">
                  <InputListSearch
                    name="sexo"
                    title="Sexo"
                    className="mb-4"
                    options={optionsTypeSexoMasculinoAndFemenino}
                    register={register}
                    rules={rules.sexo}
                    error={errors.sexo}
                    handleChange={(data: OptionType) =>
                      setValue("sexo", data, { shouldValidate: true })
                    }
                    myDefaultValue={{
                      value:
                        TypesSelectSexoRegisterMapLetterToWord[
                          data?.user?.sexo
                        ],

                      text: TypesSelectSexoRegisterMapLetterToWord[
                        data?.user?.sexo
                      ],
                      disabled: false,
                      placeholder: false,
                    }}
                    // myDefaultValue={watch("sexo")}
                  />
                </div>
                <div className="col-span-1">
                  <InputListSearch
                    name="estado_civil"
                    title="Estado civil"
                    className="mb-4"
                    options={optionsTypeEstadoCivil}
                    register={register}
                    rules={rules.estado_civil}
                    error={errors.estado_civil}
                    handleChange={(data: OptionType) => {
                      setValue("estado_civil", data, { shouldValidate: true });
                    }}
                    myDefaultValue={{
                      value:
                        TypesSelectEstadoCivilMapLetterToWord[
                          data?.user?.estado_civil
                        ],

                      text: TypesSelectEstadoCivilMapLetterToWord[
                        data?.user?.estado_civil
                      ],
                      disabled: false,
                      placeholder: false,
                    }}
                    // myDefaultValue={watch("estado_civil")}
                  />
                </div>
              </div>

              <InputImage
                className="my-7"
                control={control}
                name="foto"
                label="Foto de perfil"
                register={register}
                error={errors.foto}
                setErrorRHF={setError}
                setValueRHF={setValue}
                image={imageUrl !== "string" && imageUrl}
                // fileList={fileList}
                // setFileList={setFileList}
                // isEdit={informe ? true : false}
                // disabled={!editInformeCreated}
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
                label={"Guardar"}
                fill
                // loading={isLoading}
                boderRadius="rounded-full"
                size="full"
                type="submit"
                sizesButton="py-3"
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditPersonalInformation;
