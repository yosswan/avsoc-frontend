import * as React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Typography } from "components/common/typography";
import { Button } from "components/common/button/button";
import { InputPassword } from "components/common/form/input-password";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useToasts } from "react-toast-notifications";
import { Logo } from "components/logo";
import { GetServerSideProps } from "next";
import { InputEmail } from "components/common/form/input-email";
import { Icons } from "consts/icons";
import { getSession } from "lib/helper";
import { getToken } from "next-auth/jwt";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { isDirty, isValid, errors },
    watch,
  } = useForm({ mode: "onChange" });

  const router = useRouter();
  const { addToast } = useToasts();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const handleSubmitData = async (data: any) => {
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        callbackUrl: "/dashboard",
      });

      if (result?.error) {
        addToast(result.error, { appearance: "error" });
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      addToast("Error de autenticación", { appearance: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const rules = {
    email: {
      required: { value: true, message: "Este campo es requerido" },
    },
    password: {
      required: { value: true, message: "Este campo es requerido" },
    },
    check: {},
  };

  return (
    <>
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
            <InputEmail
              name="email"
              title="Correo electrónico"
              isFill={!!watch("email")}
              register={register}
              rules={rules.email}
              error={errors.email}
              leftImg={Icons.user}
              className="mb-3 md:mb-5"
            />
            <InputPassword
              name="password"
              title="Contraseña"
              isFill={!!watch("password")}
              validate={false}
              register={register}
              rules={rules.password}
              error={errors.password}
              leftImg={Icons.locked}
            />
            <Typography
              type="caption"
              className="mb-3 text-right f-18 font-normal text-gray-500"
            >
              <Link href="/auth/forgot-password">
                <span className="text-[black] cursor-pointer font-normal f-18">
                  {" "}
                  ¿Olvidaste tu contraseña?
                </span>
              </Link>
            </Typography>
            {/* <Typography
							type="caption"
							className="mb-3 text-right f-18 font-normal text-gray-500"
						>
							¿Olvidaste tu contraseña?
							<Link href="/auth/forgot-password">
								<span className="text-primary cursor-pointer font-bold f-18">
									{' '}
									Recupérala
								</span>
							</Link>
						</Typography> */}
            <div className="flex flex-col gap-7 items-center justify-center mt-9 w-full">
              <Button
                labelProps="f-24 font-normal"
                label={isLoading ? "Iniciar Sesión" : "Iniciar Sesión"}
                fill
                loading={isLoading}
                boderRadius="rounded-full"
                size="full"
                type="submit"
                disabled={!isDirty || !isValid || !!isLoading}
              />
              <Typography
                type="caption"
                className="mb-3 text-right f-18 font-normal text-gray-500"
              >
                ¿No tienes cuenta?
                <Link href="/auth/register">
                  <span className="text-primary cursor-pointer font-bold f-18">
                    {" "}
                    Crear Cuenta
                  </span>
                </Link>
              </Typography>
            </div>
          </form>
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

export default SignIn;
