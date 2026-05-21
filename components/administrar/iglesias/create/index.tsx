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
import { PastoresService } from "services/Pastores";
import { DistritosServices } from "services/Distritos";
import { customStyles } from "consts/stylesReactSelect.helper";
import { AncianosService } from "services/Ancianos";
import { IglesiasServices } from "services/Iglesias";

const CreateIglesia = ({ hide, refetch }: any) => {
  const [selectValueAncianos, setSelectValueAncianos] =
    React.useState<{ value: Number; label: string }>();
  const [selectValueDistritos, setSelectValueDistritos] =
    React.useState<{ value: Number; label: string }>();
  const { addToast } = useToasts();

  const [isLoading, setIsLoading] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState();
  const [dataAncianos, setDataAncianos] = React.useState<any>();
  const [dataDistritos, setDataDistritos] = React.useState<any>();
  // const { data: presidentesConsejo, isLoading } = useQuery<any>(
  //   [UseQueryEnums.GET_PRESIDENTES_CONSEJO],
  //   () => ConsejosRegionalesServices.getAllPastores()
  // );

  // console.log("presiii", presidentesConsejo);
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({ mode: "onChange" });
  const rules = {
    name: {
      required: { value: true, message: "Este campo es requerido" },
    },
  };

  const handleSubmitData = (data: any) => {
    const FinalData = {
      nombre: data?.name,
      id_distrito: selectValueDistritos?.value,
      id_anciano: selectValueAncianos?.value,
    };

    setIsLoading(true);
    IglesiasServices.create(FinalData)
      .then((response: any) => {
        addToast("Iglesia creada exitosamente", {
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
  const handleChangeSelectAncianos = (selected: any) => {
    setSelectValueAncianos(selected);
  };
  const handleChangeSelectConsejosDistritos = (selected: any) => {
    setSelectValueDistritos(selected);
  };

  const promiseOptionsAncianos = (inputValue: any, callback: any) => {
    if (!inputValue && !dataAncianos) {
      return AncianosService.getAll({
        id_iglesia: 0,
      }).then((response) => {
        setDataAncianos(response);
        const options = response?.data?.map((item: any) => {
          return {
            value: item.cedula,
            label: `${item.nombres} ${item.apellidos}`,
          };
        });
        return options;
      });
    } else {
      let filter = dataAncianos?.data?.filter((item: any) =>
        item.nombres
          ?.toString()
          ?.toLowerCase()
          .includes(inputValue?.toString()?.toLowerCase())
      );
      if (isEmpty(filter) || isNil(filter)) {
        filter = dataAncianos?.data?.filter((item: any) =>
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

  const promiseOptionsDistritos = (inputValue: any, callback: any) => {
    if (!inputValue && !dataDistritos) {
      return DistritosServices.getAll().then((response) => {
        setDataDistritos(response);
        const options = response?.data?.map((item: any) => {
          return { value: item.id, label: item.nombre };
        });
        return options;
      });
    } else {
      const filter = dataDistritos?.data?.filter((item: any) =>
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

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Crear Iglesia</h2>
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
            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <p className={"ml-3 font-normal mb-2 block f-18"}>Distrito</p>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={promiseOptionsDistritos}
                styles={customStyles}
                value={selectValueDistritos}
                className={"text-sm"}
                onChange={handleChangeSelectConsejosDistritos}
              />
            </div>
            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <p className={"ml-3 font-normal mb-2 block f-18"}>Anciano</p>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={promiseOptionsAncianos}
                styles={customStyles}
                value={selectValueAncianos}
                className={"text-sm"}
                onChange={handleChangeSelectAncianos}
              />
            </div>
            {/* <div className="flex-auto">
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
            </div> */}
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
                disabled={
                  !isDirty ||
                  !isValid ||
                  !!isLoading ||
                  isEmpty(selectValueAncianos?.label) ||
                  isNil(selectValueAncianos?.label) ||
                  isNil(selectValueAncianos) ||
                  isEmpty(selectValueDistritos?.label) ||
                  isNil(selectValueDistritos?.label) ||
                  isNil(selectValueDistritos)
                  // isEmpty(imageUrl) ||
                  // isNil(imageUrl)
                }
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default CreateIglesia;
