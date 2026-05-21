import { signIn, useSession } from "next-auth/react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "components/common/button/button";
import { AuthService } from "services";
import { Spinner } from "components/common/spinner/spinner";
import { useToasts } from "react-toast-notifications";
import { GenerateErrorToast } from "lib/helper";
import { get } from "lodash";
import { InputListSearch } from "components/common/form/input-list-search";
import { OptionType, TokenData } from "interfaces";
import { useRouter } from "next/router";
import { useUser } from "hooks/user";
import { useQueryClient } from "react-query";

interface TypeMiembros {
  value: Number;
  label: string;
}

const EditProfile = ({ data, hide, refetch }: any) => {
  // const { data: AllCargos, isLoading: isLoadingCargos } = useQuery<any>(
  //   [UseQueryEnums.GET_ALL_CARGOS],
  //   () => CargosServices.getAll()
  // );
  // const profile = useUser();
  // const dataUser = get(profile, "data", []);
  const { addToast } = useToasts();
  const router = useRouter();
  const { data: session, update } = useSession();
	const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors, isDirty, isValid },
    watch,
  } = useForm({ mode: "onChange" });
  const rules = {
    rol: {
      required: { value: true, message: "Este campo es requerido" },
    },
  };
  // React.useEffect(() => {
  //   if (!isNil(AllCargos)) {
  //     let aux: any = [];
  //     AllCargos.data.map((item: any) => {
  //       aux.push({
  //         text: item.nombre,
  //         value: item.id,
  //         disabled: false,
  //         placeholder: false,
  //       });
  //     });
  //     setDataCargos(aux);
  //   }
  // }, [AllCargos]);

	React.useEffect(() => {
		refetch();
	}, [])
	

  const handleSubmitData = (form: any) => {
    setIsLoading(true);
    AuthService.changeRol({ scope: form?.rol?.value })
      .then((response: TokenData) => {
        addToast("Rol cambiado exitosamente", {
          appearance: "success",
        });
				update(response)
          .then((res: any) => {
            hide();
            queryClient.invalidateQueries();
          })
          .catch((e: any) => {
            console.log("Error update token: ", e);
          })
          .finally(() => {
            setIsLoading(false);
          });
      })
      .catch((e: any) => {
        console.log("Error service profile: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  };

  const scopes_disponibles = get(data, "data.scopes", []);
  const scopes_actual = get(data, "data.scope_actual", null);

  const optionsType = () => {
    const options: any = [];
    scopes_disponibles.map((item: any, index: any) =>
      options.push({
        id: index,
        text: item,
        value: item,
        disabled: false,
        placeholder: false,
      })
    );

    return options;
  };

  return (
    <div className="text-center">
      <h2 className="text-3xl md:text-4xl font-bold">Editar perfil</h2>
      <div className="container-form mt-5 mb-11 text-left">
        {isLoading ? (
          <Spinner type="loadingPage" className="py-10" />
        ) : (
          <form onSubmit={handleSubmit(handleSubmitData)}>
            <div className={"relative py-2 w-full mb-3 md:mb-5"}>
              <InputListSearch
                // myDefaultValue={myDefaultValue}
                name="rol"
                title="Rol actual"
                className="mb-4"
                options={optionsType()}
                register={register}
                customClassNamesOptions="max-h-32 w-full overflow-auto bg-white py-1 text-base sm:text-sm"
                // rules={selectRules}
                // error={selectError}
                // isFill={selectIsFill}
                // handleChange={handleChange}
                rules={rules.rol}
                error={errors.rol}
                handleChange={(data: OptionType) =>
                  setValue("rol", data, { shouldValidate: true })
                }
                // myDefaultValue={watch("rol")}
                // onChangeCustom={(event: any) => {
                //   console.log("siiuuuu", event.target.value);
                //   setValue("tipo", event.target.value);
                // }}

                myDefaultValue={{
                  value: scopes_actual,
                  text: scopes_actual,
                  disabled: false,
                  placeholder: false,
                }}
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
                disabled={watch("rol") === scopes_actual}
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

export default EditProfile;
