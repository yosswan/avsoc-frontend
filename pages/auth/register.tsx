import * as React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Typography } from "components/common/typography";
import { Button } from "components/common/button/button";
import { InputPassword } from "components/common/form/input-password";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { Logo } from "components/logo";
import { GetServerSideProps } from "next";
import { InputEmail } from "components/common/form/input-email";
import { Icons } from "consts/icons";
import { Input } from "components/common/form/input";
import { DatePickerCustom } from "components/common/date-picker/datePicker";
import clsx from "clsx";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { InputListSearch } from "components/common/form/input-list-search";
import { OptionType } from "interfaces";
import {
  optionsTypeEstadoCivil,
  optionsTypeSexoMasculinoAndFemenino,
  optionsTypesSangre,
} from "consts/typesSelects";
import { InputImage } from "components/common/input-image";
import {
  TypesSelectEstadoCivilMap,
  TypesSelectSexoRegisterMap,
} from "consts/typesSelectEnum";
import moment from "moment";
import { formatDates, GenerateErrorToast, getSession } from "lib/helper";
import { AuthService } from "services";
import { IglesiasServices } from "services/Iglesias";
import AsyncSelect from "react-select/async";
import { customStyles } from "consts/stylesReactSelect.helper";
import InfoAfterRegister from "components/auth/info-after-register";
import { getToken } from "next-auth/jwt";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
    watch,
    setValue,
    control,
    setError,
  } = useForm({ mode: "onChange" });
  const [imageUrl, setImageUrl] = React.useState();
  const [step, setStep] = React.useState<"first" | "second">("first");
  const [loading, setLoading] = React.useState(false);
  const [dataIglesias, setDataIglesias] = React.useState<any>();
  const [selectValueIglesias, setSelectValueIglesias] =
    React.useState<{ value: Number; label: string }>();
  const router = useRouter();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [fechaNacimiento, setFechaNacimiento] = React.useState();
  const [fechaBautizo, setFechaBautizo] = React.useState();
  const handleSubmitData = (form: any) => {
    const finalData = {
      username: form.username,
      email: form.email,
      password: form.password,
      cedula: form.cedula,
      nombres: form.names,
      apellidos: form.last_name,
      fecha_nacimiento: moment(form.fecha_nacimiento).format(formatDates),
      direccion: form.direccion,
      tipo_sangre: form.tipo_sangre?.value,
      alergias: form.alergias,
      enfermedades: form.enfermedades,
      fecha_bautizo: moment(form.fecha_bautizo).format(formatDates),
      profesion: form.profesion,
      sexo: TypesSelectSexoRegisterMap[form.sexo?.value],
      estado_civil: TypesSelectEstadoCivilMap[form.estado_civil?.value],
      foto: form?.foto,
      id_iglesia: selectValueIglesias?.value
        ? selectValueIglesias?.value
        : null,
    };

    setIsLoading(true);
    AuthService.registerUser(finalData)
      .then((response: any) => {
        addToast("Cuenta creada exitosamente", {
          appearance: "success",
        });
        console.log("response create cuenta:", response);
        setTimeout(() => {
          // router.push("/auth/signin");
          setStep("second");
        }, 4000);
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  };

  const rules = {
    email: {
      required: { value: true, message: "Este campo es requerido" },
    },
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
    direccion: {
      // required: { value: true, message: "Este campo es requerido" },
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
    profesion: {
      // required: { value: true, message: "Este campo es requerido" },
    },
    sexo: {
      required: { value: true, message: "Este campo es requerido" },
    },
    estado_civil: {
      required: { value: true, message: "Este campo es requerido" },
    },
    foto: {
      // required: { value: true, message: "Este campo es requerido" },
    },
    password: {
      required: { value: true, message: "Este campo es requerido" },
    },
    check: {},
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
    <>
      {step === "first" && (
        <div className="container-auth bg-primary">
          <div className="rounded-2xl center flex flex-col items-center justify-center box w-full m-auto bg-white">
            <Logo
              className="mb-4"
              type="withColor"
              classNameImg="max-w-[302px]"
            />
            <Typography
              type="title"
              className="mb-9 f-36 font-normal text-gray-500 mt-10"
            >
              Ingresa tus datos
            </Typography>
            {/* <p>NEXTAUTH_URL: {process.env.NEXTAUTH_URL}</p>
					<p>NEXTAUTH_URL publuc: {process.env.NEXT_PUBLIC_AUTH_URL}</p>
					<p>API: {process.env.NEXT_PUBLIC_API}</p> */}
            <form
              className="w-full text-left"
              onSubmit={handleSubmit(handleSubmitData)}
            >
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
                  <InputEmail
                    name="email"
                    labelVisible
                    title="Correo electrónico"
                    isFill={!!watch("email")}
                    register={register}
                    rules={rules.email}
                    error={errors.email}
                    className="mb-0"
                    otherStyles="rounded-full text-sm pt-3 pb-3"
										required={!!rules.email.required}
                  />
                </div>

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
                rules={rules.direccion}
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
                />

                <Input
                  name="profesion"
                  labelVisible
                  title="Profesión"
                  isFill={!!watch("profesion")}
                  register={register}
                  rules={rules.profesion}
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
                    // myDefaultValue={watch("estado_civil")}
                  />
                </div>
              </div>
              {/* <div className="flex-auto mt-7">
              <Typography
                type="label"
                className={clsx("ml-3 font-normal mb-2 block f-18")}
              >
                Foto de perfil
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
            </div> */}
              <InputPassword
                name="password"
                title="Contraseña"
                isFill={!!watch("password")}
                validate={false}
                register={register}
                className="mt-7"
                rules={rules.password}
                error={errors.password}
                leftImg={Icons.locked}
                otherStyles="rounded-full text-sm pt-3 pb-3"
              />
              <InputImage
                className="my-7"
                control={control}
                name="foto"
                label="Foto de perfil"
                register={register}
                rules={rules.foto}
                error={errors.foto}
                setErrorRHF={setError}
                setValueRHF={setValue}
                // image={data?.logo !== "string" && data?.logo}
                // fileList={fileList}
                // setFileList={setFileList}
                // isEdit={informe ? true : false}
                // disabled={!editInformeCreated}
              />
              <div className="flex flex-col items-center justify-center mt-9 w-full">
                <Button
                  labelProps="f-24 font-normal"
                  label={isLoading ? "Registrarse" : "Registrarse"}
                  fill
                  loading={isLoading}
                  boderRadius="rounded-full"
                  size="full"
                  type="submit"
                  disabled={!isDirty || !!isLoading}
                />
                <Typography
                  type="caption"
                  className="mb-3 mt-10 text-right f-18 font-normal text-gray-500"
                >
                  Ya tienes cuenta?
                  <Link href="/auth/signin">
                    <span className="text-primary cursor-pointer font-bold f-18">
                      {" "}
                      Iniciar Sesión
                    </span>
                  </Link>
                </Typography>
              </div>
            </form>
          </div>
        </div>
      )}
      {step === "second" && <InfoAfterRegister />}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getToken({ req: context.req as any, secret: process.env.NEXTAUTH_SECRET });

  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

export default Register;
