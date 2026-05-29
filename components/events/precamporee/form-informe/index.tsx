import * as React from "react";
import { Button } from "components/common/button";
import { useForm } from "react-hook-form";
import { Icons } from "consts/icons";
import { InputEmail } from "components/common/form/input-email";
import { InputText } from "components/common/form/input-text";
import { Input } from "components/common/form/input";
import { DatePickerCustom } from "components/common/date-picker/datePicker";
import clsx from "clsx";
import moment from "moment";
import type { UploadFile } from "antd/es/upload/interface";
import { DragAndDrop } from "components/common/dragger/";
import { CamporeeServices } from "services/Camporee";
import { useToasts } from "react-toast-notifications";
import { formatDates, GenerateErrorToast } from "lib/helper";
import { Spinner } from "components/common/spinner/spinner";
import { isEmpty, isNil, size } from "lodash";
import { Icon } from "components/icon";
import { useModal } from "hooks/modal";
import { Help } from "components/common/help";
import { HelpFormInformeEventoPrecamporee } from "help/camporee/eventos-precamporee/form-informe";
import { useQueryClient } from "react-query";
import { UseQueryEnums } from "consts/useQueryEnums";

type InformeFormProps = {
  // isLoading: boolean;
  // onHandleSubmit: (data: any) => void;
  className?: string;
  idPrecamporee: any;
  refetch: any;
  isRecurrent?: boolean;
  mes?: any;
  isAvailable?: boolean;
  informe?: any;
	idCamporee: number;
};

export const InformeForm: React.FC<InformeFormProps> = ({
  // onHandleSubmit,
  // isLoading,
  idPrecamporee,
  isRecurrent,
  isAvailable,
  refetch,
  informe,
  mes: mesInforme,
  className,
	idCamporee,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
  const [mes, setMes] = React.useState(mesInforme);
  const { addToast } = useToasts();
  const [fechaRealizado, setFechaRealizado] = React.useState();
  const [fileList, setFileList] = React.useState<UploadFile[] | any>([]);
  const {
    Modal: ModalHelp,
    hide: hideHelp,
    isShow: isShowHelp,
    show: showHelp,
  } = useModal();
  const {
    register,
    control,
    handleSubmit,
    setError: setErrorRHF,
    setValue: setValueRHF,
    formState: { isDirty, isValid, errors },
    watch,
  } = useForm<any>({ mode: "onChange", defaultValues: { mes: mesInforme } });

	const queryClient = useQueryClient();

  const rules = {
    mes: {
      required: { value: true, message: "Este campo es requerido" },
    },
    fecha_realizado: {
      required: { value: true, message: "Este campo es requerido" },
    },
    participantes: {
      min: { value: 1, message: "Debe ser mayor a 0" },
    },
    files: {
      required: { value: true, message: "Este campo es requerido" },
      validate: (value: any) => {
        if (value.length < 1) {
          return "Debe subir al menos un archivo";
        }
      },
    },
  };

  // function dataURIBase64toBlob(dataURI: any) {
  //   var byteString = atob(dataURI.split(",")[1]);
  //   var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  //   var ab = new ArrayBuffer(byteString.length);
  //   var ia = new Uint8Array(ab);

  //   for (var i = 0; i < byteString.length; i++) {
  //     ia[i] = byteString.charCodeAt(i);
  //   }
  //   var blob = new Blob([ab], { type: mimeString });

  //   return blob;

  // }

  function dataBase64toFile(image: any, filename: string) {
    var arr = image.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

	let buttonName = informe ? 'Actualizar' : 'Guardar';
  React.useEffect(() => {
    if (!isNil(informe)) {
      const images = [
        {
          //originFileObj: dataBase64toFile(informe.imagen1, "imagen1"),
          preview: informe.imagen1,
          name: "imagen1",
          status: "done",
        },
			];
			if (informe.imagen2) images.push({
				preview: informe.imagen2,
				name: "imagen2",
				status: "done",
			});
			if (informe.imagen3) images.push({
				preview: informe.imagen3,
				name: "imagen3",
				status: "done",
			});
			
      setValueRHF("description", informe.descripcion);
      setValueRHF("objetive", informe.objetivo);
      setValueRHF("participantes", informe.participantes);
      setValueRHF("fecha_realizado", informe.fecha_realizado);
      const imagesOnlyBase = images.map((i) => i.preview);
      setValueRHF("files", imagesOnlyBase);
      setFechaRealizado(informe.fecha_realizado);
      setFileList(images);
    }
  }, []);

  const onHandleSubmit = (data: any) => {
    const finalData = {
      imagen1: data?.files[0],
      imagen2: data?.files[1],
      imagen3: data?.files[2],
      objetivo: data?.objetive,
      descripcion: data?.description,
      mes: moment(data?.mes).format(formatDates),
      fecha_realizado: data?.fecha_realizado,
      participantes: parseInt(data?.participantes),
      id_camporee_precamporee: parseInt(idPrecamporee),
    };
    setIsLoading(true);
    CamporeeServices.createInformePrecamporee(finalData)
      .then((response) => {
        addToast("Informe agregado exitosamente", {
          appearance: "success",
        });
        refetch();
				queryClient.invalidateQueries(`${UseQueryEnums.GET_ALL_PRECAMPOREE_CAMPOREE}_${idCamporee}`);
				queryClient.invalidateQueries(`${UseQueryEnums.GET_CAMPOREE_BY_ID}_${idCamporee}`);
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  };
  // const isDisabled = isLoading || !isDirty || !isValid;
  //se encuentra el informe en el array(hay informe creado) y edit del array mes es true, significa que esta el
  // informe creado y que aun se puede editar
  const editInformeCreated =
    (informe && isAvailable) || (!informe && isAvailable);
  const informeUnavailableNow = !informe && !isAvailable;
  return (
    <div
      className={clsx(
        "shadow-primary shadow-lg px-4 py-14 rounded-md ",
        className
      )}
    >
      {isLoading ? (
        <Spinner type="loadingPage" className="py-10" />
      ) : !informeUnavailableNow ? (
        <>
          <Help showModal={showHelp} />
          <form className="w-full" onSubmit={handleSubmit(onHandleSubmit)}>
            <Input
              name="description"
              title="Descripcion"
              labelVisible
              isTextArea
              isFill={!!watch("description")}
              register={register}
              error={errors.description}
              className="mb-3 md:mb-5"
              otherStyles="pt-3 pb-3 rounded-lg text-sm"
              disabled={!editInformeCreated}
            />
            <Input
              name="objetive"
              title="Objetivo"
              labelVisible
              isTextArea
              isFill={!!watch("objetive")}
              register={register}
              error={errors.objetive}
              className="mb-3 md:mb-5"
              otherStyles="pt-3 pb-3 rounded-lg text-sm"
              disabled={!editInformeCreated}
            />
            <Input
              name="participantes"
              title="Participantes"
              type="number"
              labelVisible
              isFill={!!watch("participantes")}
              register={register}
              rules={rules.participantes}
              error={errors.participantes}
              className="mb-3 md:mb-5"
              otherStyles="pt-3 pb-3 rounded-lg text-sm"
              disabled={!editInformeCreated}
            />
            <div className="flex-wrap flex-auto lg:flex-nowrap flex gap-4">
              {isRecurrent && (
                <DatePickerCustom
                  name="mes"
                  register={register}
                  rules={rules.mes}
                  error={errors.mes}
                  label={"Mes"}
                  value={mes}
                  control={control}
                  setValue={setMes}
                  setValueRHF={setValueRHF}
                  disabled={isRecurrent || !editInformeCreated}
                />
              )}
              <DatePickerCustom
                register={register}
                rules={rules.fecha_realizado}
                error={errors.fecha_realizado}
                name="fecha_realizado"
                label={"Fecha realizado"}
                value={fechaRealizado}
                setValue={setFechaRealizado}
                control={control}
                setValueRHF={setValueRHF}
                disabled={!editInformeCreated}
								multiple
              />
            </div>

            <div className="mt-10">
              {/* {!isNil(informe) && ( */}
              <DragAndDrop
                control={control}
                name="files"
                maxFiles={3}
                register={register}
                rules={rules.files}
                error={errors.files}
                setErrorRHF={setErrorRHF}
                setValueRHF={setValueRHF}
                fileList={fileList}
                setFileList={setFileList}
                isEdit={informe ? true : false}
                disabled={!editInformeCreated}
								setLoading={setLoading}
              />
              {/* )} */}
            </div>

            {editInformeCreated && (
              <div className="flex items-center justify-center mt-16 w-full">
                <Button
                  labelProps="f-18 font-normal"
                  label={buttonName}
                  fill
                  // loading={isLoading}
                  boderRadius="rounded-full"
                  size="full"
                  type="submit"
                  sizesButton="py-3"
									disabled={loading}
                />
              </div>
            )}
          </form>
          <ModalHelp isShow={isShowHelp}>
            <HelpFormInformeEventoPrecamporee hide={hideHelp} />
          </ModalHelp>
        </>
      ) : (
        <div className="flex items-center flex-col gap-5 justify-center w-full">
          <Icon
            src={Icons.security}
            fillPath
            className="text-alert-error w-11  cursor-pointer"
          />
          <p className="text-base font-bold text-black">
            Formulario no disponible
          </p>
        </div>
      )}
    </div>
  );
};
