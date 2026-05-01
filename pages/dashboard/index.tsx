import { Alert } from "components/common/alert2";
import { Button } from "components/common/button";
import { LayoutDashboard } from "components/layout";
import { Images } from "consts";
import { useUser } from "hooks/user";
import { GenerateErrorToast, getSession } from "lib/helper";
import { get } from "lodash";
import { GetServerSideProps } from "next";

import * as React from "react";
import { useToasts } from "react-toast-notifications";
import { AuthService } from "services";

const Dashboard = () => {
  const user = useUser(true);
  const profile = get(user, "data.user", []);
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = React.useState(false);

  const onVerifyEmail = () => {
    setIsLoading(true);

    AuthService.sendEmailVerification()
      .then((response) => {
        addToast("Correo de verificacion enviado exitosamente", {
          appearance: "success",
        });
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
  };

  return (
    <LayoutDashboard title="AVSOC">
      <div className="py-4">
        <div className="flex flex-col justify-center">
          <img
            src={Images.logoWithColor}
            className="mx-auto max-w-[250px] w-full"
            alt=""
          />
          <h1 className="f-50 font-bold text-center mt-6">Bienvenido,</h1>
          <h4 className="text-2xl font-bold text-center">
            {profile?.nombres} {profile?.apellidos}
          </h4>
        </div>
        {profile?.verificado === false && (
          <div className="w-2/4 mx-auto mt-10 text-center">
            <Alert title="ALERTA" type="error">
              <p>Debe verificar su correo para poder hacer uso de el sistema</p>
              <div className="container-button mt-6 justify-center flex items-center max-w-[200px] mx-auto">
                <Button
                  className="bg-alert-error border-alert-error hover:bg-transparent hover:text-alert-error hover:border-alert-error"
                  labelProps="f-18 font-normal"
                  label={isLoading ? "Enviando..." : "Verificar"}
                  fill
                  loading={isLoading}
                  boderRadius="rounded-full"
                  size="full"
                  type="submit"
                  disabled={!!isLoading}
                  sizesButton="py-3"
                  onClick={onVerifyEmail}
                />
              </div>
            </Alert>
          </div>
        )}
      </div>
    </LayoutDashboard>
  );
};

export default Dashboard;
