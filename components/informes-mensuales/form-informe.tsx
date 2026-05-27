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
import { SelectInput } from "components/common/form/select/SelectInput";
import { InputListSearch } from "components/common/form/input-list-search";
import { optionsTypeInformesMensuales } from "consts/typesSelects";
import { OptionType } from "interfaces";
import { Typography } from "components/common/typography";
import { InformesMensualesService } from "services/InformesMensuales";

type InformeFormProps = {
  className?: string;
  refetch: any;
  hide?: any;
  informe?: any;
  data?: any;
  isEditable?: boolean;
};

const rules = {
  nro_juntas_planeacion: {
    required: { value: true, message: "Este campo es requerido" },
  },
  nro_juntas_padres: {
    required: { value: true, message: "Este campo es requerido" },
  },
  nro_cedulas_juveniles: {
    required: { value: true, message: "Este campo es requerido" },
  },
  involucrados_sj: {
    required: { value: true, message: "Este campo es requerido" },
  },
  blanco_estudios_biblicos: {
    required: { value: true, message: "Este campo es requerido" },
  },
  blanco_reclutas: {
    required: { value: true, message: "Este campo es requerido" },
  },
  miembro_dando_estudio_biblico: {
    required: { value: true, message: "Este campo es requerido" },
  },
  miembro_recibiendo_estudio_biblico: {
    required: { value: true, message: "Este campo es requerido" },
  },
  nro_bautismos: {
    required: { value: true, message: "Este campo es requerido" },
  },
};

export const InformeForm: React.FC<InformeFormProps> = React.memo(({
  hide,
  refetch,
  isEditable,
  className,
  data,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const { addToast } = useToasts();
  const [fechaRealizado, setFechaRealizado] = React.useState();
  const [fileList, setFileList] = React.useState<UploadFile[] | any>([]);
  const {
    register,
    control,
    handleSubmit,
    setError: setErrorRHF,
    setValue: setValueRHF,
    formState: { isDirty, isValid, errors },
    watch,
  } = useForm<any>({
    mode: "onChange",
  });

  const onHandleSubmit = React.useCallback((form: any) => {

    const finalData = {
      mes: data?.mes,
      reuniones_directiva: form?.nro_juntas_planeacion,
      reuniones_padres: form?.nro_juntas_padres,
      involucrados_sj: form?.involucrados_sj,
      numero_gpss: form?.nro_cedulas_juveniles,
      numero_bautismos: form?.nro_bautismos,
      miembros_recibiendo_e_b: form?.miembro_recibiendo_estudio_biblico,
      miembros_dando_e_b: form?.miembro_dando_estudio_biblico,
      blanco_estudios_biblicos: form?.blanco_estudios_biblicos,
      blanco_reclutas: form?.blanco_reclutas,
    };

    setIsLoading(true);
    const text = data ? "actualizado" : "agregado";
    InformesMensualesService.createInforme(finalData)
      .then((response) => {
        addToast(`Informe ${text} exitosamente`, {
          appearance: "success",
        });
        refetch();
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  }, [data, refetch, addToast, hide]);

  React.useEffect(() => {
    if (!isNil(data)) {
      setValueRHF("nro_juntas_planeacion", data.reuniones_directiva);
      setValueRHF("nro_juntas_padres", data.reuniones_padres);
      setValueRHF("nro_cedulas_juveniles", data.numero_gpss);
      setValueRHF("involucrados_sj", data.involucrados_sj);
      setValueRHF("blanco_estudios_biblicos", data.blanco_estudios_biblicos);
      setValueRHF("blanco_reclutas", data.blanco_reclutas);
      setValueRHF("miembro_dando_estudio_biblico", data.miembros_dando_e_b);
      setValueRHF("miembro_recibiendo_estudio_biblico", data.miembros_recibiendo_e_b);
      setValueRHF("nro_bautismos", data.numero_bautismos);
    }
  }, [data, setValueRHF]);

  return (
    <div className="text-center">
      <div className={clsx("px-4 py-14 rounded-md text-left", className)}>
        <h2 className="text-3xl md:text-4xl font-bold text-center">
          Datos Informe
        </h2>
        {isLoading ? (
          <Spinner type="loadingPage" className="py-10" />
        ) : (
          <form className="w-full" onSubmit={handleSubmit(onHandleSubmit)}>
            <div className="grid grid-cols-2 gap-2 mt-7">
              <div className="col-span-1">
                <Input
                  name="nro_juntas_planeacion"
                  title="Nº Juntas Planeación"
                  labelVisible
                  type="number"
                  isFill={!!watch("nro_juntas_planeacion")}
                  register={register}
                  rules={rules.nro_juntas_planeacion}
                  error={errors.nro_juntas_planeacion}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="nro_juntas_padres"
                  title="Nº Juntas con Padres"
                  type="number"
                  labelVisible
                  isFill={!!watch("nro_juntas_padres")}
                  register={register}
                  rules={rules.nro_juntas_padres}
                  error={errors.nro_juntas_padres}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="nro_cedulas_juveniles"
                  title="N° Células Juveniles"
                  type="number"
                  labelVisible
                  isFill={!!watch("nro_cedulas_juveniles")}
                  register={register}
                  rules={rules.nro_cedulas_juveniles}
                  error={errors.nro_cedulas_juveniles}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="involucrados_sj"
                  title="Involucrados en SJ"
                  type="number"
                  labelVisible
                  isFill={!!watch("involucrados_sj")}
                  register={register}
                  rules={rules.involucrados_sj}
                  error={errors.involucrados_sj}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="blanco_estudios_biblicos"
                  title="Blanco de Estudios Bíblicos"
                  type="number"
                  labelVisible
                  isFill={!!watch("blanco_estudios_biblicos")}
                  register={register}
                  rules={rules.blanco_estudios_biblicos}
                  error={errors.blanco_estudios_biblicos}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="blanco_reclutas"
                  title="Blanco de Reclutas"
                  type="number"
                  labelVisible
                  isFill={!!watch("blanco_reclutas")}
                  register={register}
                  rules={rules.blanco_reclutas}
                  error={errors.blanco_reclutas}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="miembro_dando_estudio_biblico"
                  title="Miembros Dando Estudio Bíblico"
                  type="number"
                  labelVisible
                  isFill={!!watch("miembro_dando_estudio_biblico")}
                  register={register}
                  rules={rules.miembro_dando_estudio_biblico}
                  error={errors.miembro_dando_estudio_biblico}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="miembro_recibiendo_estudio_biblico"
                  title="Miembros Recibiendo Estudio Bíblico"
                  type="number"
                  labelVisible
                  isFill={!!watch("miembro_recibiendo_estudio_biblico")}
                  register={register}
                  rules={rules.miembro_recibiendo_estudio_biblico}
                  error={errors.miembro_recibiendo_estudio_biblico}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
              <div className="col-span-1">
                <Input
                  name="nro_bautismos"
                  title="Bautismos del mes"
                  type="number"
                  labelVisible
                  isFill={!!watch("nro_bautismos")}
                  register={register}
                  rules={rules.nro_bautismos}
                  error={errors.nro_bautismos}
                  className="mb-3 md:mb-5"
                  otherStyles="pt-3 pb-3 rounded-full text-sm"
                  disabled={data && !isEditable}
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 mt-10 px-4 md:px-20">
              {data && isEditable && (
                <Button
                  labelProps="f-18 font-normal"
                  label={data ? "Actualizar" : "Crear"}
                  fill
                  // loading={isLoading}
                  boderRadius="rounded-full"
                  size="full"
                  type="submit"
                  sizesButton="py-3"
                />
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
});
