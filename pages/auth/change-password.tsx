import * as React from "react";
import { Typography } from "components/common/typography";
import { FirstForm, SecondForm } from "components/auth/forgot-password";
import { useRouter } from "next/router";
import { Logo } from "components/logo";
import { useToasts } from "react-toast-notifications";
import { GetServerSideProps } from "next";

import { AuthService } from "services";
import { GenerateErrorToast, getSession } from "lib/helper";
import { getToken } from "next-auth/jwt";

const ForgotPassword = () => {
  const router = useRouter();
  const { token } = router.query;
  const { email } = router.query;
  const [isLoading, setIsLoading] = React.useState(false);
  const { addToast } = useToasts();

  const onSubmit = (form: any) => {
    const dataForm = {
      email,
      token,
      password: form?.newPassword,
      password_confirmation: form?.confirmPassword,
    };
    setIsLoading(true);
    AuthService.changePassword(dataForm)
      .then((response: any) => {
        addToast("Se ha cambiado su contraseña con éxito", {
          appearance: "success",
        });
        router.push("/auth/signin");
        setIsLoading(false);
      })
      .catch((e: any) => {
        console.log("Error: ", e);
        GenerateErrorToast(e, addToast);
        setIsLoading(false);
      });
    setIsLoading(false);
  };

  return (
    <>
      <div className="container-auth bg-primary">
        <div className="rounded-2xl center flex flex-col items-center justify-center text-left box w-full m-auto bg-white">
          <Logo
            className="mb-4"
            type="withColor"
            classNameImg="max-w-[302px]"
          />
          <Typography
            type="title"
            className="mb-9 text-3xl font-normal text-gray-500 mt-10 leading-tight"
          >
            Ingresa tu nueva contraseña
          </Typography>
          <SecondForm onHandleSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </div>
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

export default ForgotPassword;
