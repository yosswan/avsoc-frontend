import { Input } from "components/common/form/input";
import { GetServerSideProps } from "next";
import * as React from "react";
import AsyncSelect from "react-select/async";
import { useForm } from "react-hook-form";
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
import { PresidentesConsejoRegional } from "services/PresidentesConsejoRegional";
import { customStyles } from "consts/stylesReactSelect.helper";
import { FileService } from "services/Image";
import { RcFile } from "antd/lib/upload";

const EditFederacion = ({ data, hide, refetch }: any) => {
  const [selectValue, setSelectValue] = React.useState<{
    value: Number;
    label: string;
  }>({ value: data.cedula_presidente, label: data.presidente });
  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(data?.logo || null);
  const [dataPresidentesConsejo, setDataPresidentesConsejo] =
    React.useState<any>();
  // const { data: presidentesConsejo, isLoading } = useQuery<any>(
  //   [UseQueryEnums.GET_PRESIDENTES_CONSEJO],
  //   () => ConsejosRegionalesServices.getAllPresidentesConsejo()
  // );

  // console.log("presiii", presidentesConsejo);
  console.log("a editar", data);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
    setValue,
  } = useForm({
    mode: "onChange",
  });
  const rules = {
    name: {
      required: { value: true, message: "Este campo es requerido" },
    },
    abreviatura: {
      required: { value: true, message: "Este campo es requerido" },
    },
  };

  React.useEffect(() => {
    if (!isNil(data) && !isEmpty(data)) {
      if (!isNil(data.nombre) && !isEmpty(data.nombre)) {
        setValue("name", data.nombre, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
      if (!isNil(data.abreviatura) && !isEmpty(data.abreviatura)) {
        setValue("abreviatura", data.abreviatura, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, []);

  const handleSubmitData = (form: any) => {
    const FinalData = {
      nombre: form?.name,
      abreviatura: form?.abreviatura,
      logo: imageUrl,
      cedula_presidente: selectValue?.value,
    };

    console.log("FinalData", FinalData);
    setIsLoading(true);
    ConsejosRegionalesServices.edit(FinalData, data?.id)
      .then((response: any) => {
        addToast("Consejo Regional editado exitosamente", {
          appearance: "warning",
        });
        console.log("response edit:", response);
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
  const handleChangeSelect = (selected: any) => {
    setSelectValue(selected);
  };
  React.useEffect(() => {
    console.log("cambia", selectValue);
  }, [selectValue]);

  const promiseOptions = (inputValue: any, callback: any) => {
    if (!inputValue && !dataPresidentesConsejo) {
      return PresidentesConsejoRegional.getAll({
        paginate: false,
        idConsejo: data.id,
      }).then((response) => {
        setDataPresidentesConsejo(response);
        const options = response?.data?.map((item: any) => {
          return { value: item.cedula, label: `${item.nombres} ${item.apellidos}` };
        });
        return options;
      });
    } else {
      const filter = dataPresidentesConsejo?.data?.filter((item: any) =>
        item.nombre
          ?.toString()
          ?.toLowerCase()
          .includes(inputValue?.toString()?.toLowerCase())
      );

      const options = filter?.map((item: any) => {
        return { value: item.cedula, label: item.nombre };
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
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Editar Federacion</h2>
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
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-1">
                <Input
                  name="abreviatura"
                  title="Abreviatura"
                  labelVisible
                  isFill={!!watch("abreviatura")}
                  register={register}
                  rules={rules.abreviatura}
                  error={errors.abreviatura}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                />
              </div>
              <div className="col-span-2">
                <div className={"relative py-2 w-full mb-3 md:mb-5"}>
                  <p className={"ml-3 font-normal mb-2 block f-18 is-required"}>
                    Presidente del consejo
                  </p>
                  {/* {!isLoading && ( */}
                  <AsyncSelect
                    // isLoading={isLoading && presidentesConsejo}
                    cacheOptions
                    defaultOptions
                    loadOptions={promiseOptions}
                    styles={customStyles}
                    value={selectValue}
                    className={"text-sm"}
                    onChange={handleChangeSelect}
                  />
                </div>
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
                disabled={
                  !isDirty ||
                  !isValid ||
                  !!isLoading ||
									!!loading ||
                  isEmpty(selectValue.label) ||
                  isNil(selectValue.label) ||
                  isNil(selectValue)
                }
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditFederacion;
