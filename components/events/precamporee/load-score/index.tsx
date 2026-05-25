import * as React from "react";
import { Button } from "components/common/button/button";
import { Spinner } from "components/common/spinner/spinner";
import { useToasts } from "react-toast-notifications";
import { GenerateErrorToast } from "lib/helper";
import { MiembrosServices } from "services/Miembros";
import { CamporeeServices } from "services/Camporee";
import { Input } from "components/common/form/input";
import { useForm } from "react-hook-form";
import { Alert } from "components/common/alert";
import { UseQueryEnums } from "consts/useQueryEnums";
import { useQueryClient } from "react-query";

const LoadScore = ({ data, hide, refetch, id_camporee }: any) => {
  const { addToast } = useToasts();
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
    defaultValues: {
      puntuacion: data?.puntuacion,
      nota: data?.observacion,
    },
  });

  const rules = {
    puntuacion: {
      required: { value: true, message: "Este campo es requerido" },
      min: { value: 0, message: "Debe ser mayor o igual a 0" },
      max: {
        value: data?.puntuacion_maxima,
        message: `Debe ser menor o igual a ${data?.puntuacion_maxima}`,
      },
    },
    nota: {},
  };
  const [isLoading, setIsLoading] = React.useState(false);

	const queryClient = useQueryClient();

  const onHandleSubmit = (form: any) => {
    setIsLoading(true);
    const finalData = {
      puntuacion: form.puntuacion,
      observacion: form.nota,
    };
    CamporeeServices.LoadScoreInformePrecamporee(
      {
        id_informe_precamporee: data?.id,
      },
      finalData
    )
      .then((response: any) => {
        addToast("Se ha agregado la puntuación exitosamente", {
          appearance: "success",
        });
        refetch();
				queryClient.invalidateQueries(`${UseQueryEnums.GET_ALL_PRECAMPOREE_CAMPOREE}_${id_camporee}`);
				queryClient.invalidateQueries(`${UseQueryEnums.GET_ALL_INFORMES_CAMPOREE}_${id_camporee}`);
        hide();
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  };

  return (
    <div className="text-center">
      <h2 className="text-4xl font-bold text-alert-success">Puntuar Informe</h2>

      {isLoading ? (
        <Spinner type="loadingPage" className="py-10" />
      ) : (
        <>
          {isLoading ? (
            <Spinner type="loadingPage" className="py-10" />
          ) : (
            <form
              className="w-full text-left mt-16"
              onSubmit={handleSubmit(onHandleSubmit)}
            >
              {data?.puntuacion_recomendada && (
                <Alert className="mb-5 bg-[#ffc107]">
                  <p className="text-[black] text-base py-5">
                    Puntuación recomendada: {data?.puntuacion_recomendada}
                  </p>
                </Alert>
              )}
              <Input
                name="puntuacion"
                title="Puntuación"
                type="number"
                labelVisible
                register={register}
                rules={rules.puntuacion}
                error={errors.puntuacion}
                className="mb-3 md:mb-5"
                otherStyles="pt-3 pb-3 rounded-lg text-sm"
              />

              <Input
                name="nota"
                title="Nota"
                labelVisible
                isTextArea
                register={register}
                rules={rules.nota}
                error={errors.nota}
                className="mb-3 md:mb-5"
                otherStyles="pt-3 pb-3 rounded-lg text-sm"
              />

              <div className="flex flex-col md:flex-row gap-4 mt-10 px-4 md:px-20">
                <Button
                  labelProps="f-18 font-normal"
                  label={"Cancelar"}
                  boderRadius="rounded-full"
                  size="full"
                  type="button"
                  sizesButton="py-3"
                  onClick={hide}
                />
                <Button
                  className="bg-alert-success border-alert-success hover:bg-transparent hover:text-alert-success hover:border-alert-success"
                  labelProps="f-18 font-normal"
                  label={"Cargar"}
                  fill
                  boderRadius="rounded-full"
                  size="full"
                  type="submit"
                  sizesButton="py-3"
                />
              </div>
            </form>
          )}
        </>
      )}
    </div>
  );
};

export default LoadScore;
