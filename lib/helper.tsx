import { Icons, Images } from "consts";
import { PermissionByRol } from "consts/permissionByRol";
import { useUser } from "hooks/user";
import { isNil, isEmpty, get } from "lodash";
import { GetServerSidePropsContext, PreviewData } from "next";
import { ParsedUrlQuery } from "querystring";
import jwt from 'jsonwebtoken';
import { DecodedSessionToken } from "interfaces";

export const formatDates = "YYYY-MM-DD";
export const formatDateComplete = "MMM DD, YYYY";

export const ValidateImageUser = (img: any) => {
  if (
    img === "" ||
    img === " " ||
    !img ||
    isNil(img) ||
    img?.toString()?.toLowerCase() === "string"
  )
    return Icons.noImgUser;

  return img;
};

export const ValidateImage = (img: any, isUser = false) => {
  const image = isUser ? Icons.noImgUser : Images.noImg;

  if (
    img === "" ||
    img === " " ||
    !img ||
    isNil(img) ||
    img?.toString()?.toLowerCase() === "string"
  )
    return image;

  return img;
};

export const ValidateString = (name: any) => {
  if (isNil(name)) {
    return "N/A";
  } else {
    if (
      name === "" ||
      name === " " ||
      !name ||
      isNil(name) ||
      name?.toString()?.toLowerCase() === "string"
    )
      return "N/A";
  }

  return name;
};

export const GenerateErrorHtml = (errors: any) => {
  let errorHtml: any;
  if (Object.keys(errors).length > 0) {
    errorHtml = (
      <ul className="m-0" key={Math.floor(Math.random() * 1000)}>
        {Object.keys(errors).map((item, posicion) => {
          return (
            <li key={posicion}>
              {item} : {errors}
            </li>
          );
        })}
      </ul>
    );
    console.log(errors.propertiesErrors);
  } else {
    errorHtml = (
      <ul className="m-0">
        <li>
          {"Error: "} {errors.message}
        </li>
      </ul>
    );
  }

  return errorHtml;
};

export const GenerateErrorToast = (error: any, addToast: any) => {
  if (error?.errors && Object.keys(error.errors).length > 0) {
    {
      error = error.errors;
      Object.keys(error).map((item) => {
        console.log(error[item]);
        return addToast(`${item} : ${error[item]}`, {
          appearance: "error",
        });
      });
    }
    // console.log(errors.propertiesErrors);
  } else {
    addToast(`${"Error: "} ${error.message}`, {
      appearance: "error",
    });
  }
};

export const routeValidForUser = (
  data: any,
  permission: string,
  module: string
) => {
  const rol = get(data, "scope_actual", undefined);
  const findUserRole = PermissionByRol.find((item) => item.role === rol);

  if (!isNil(findUserRole)) {
    const findModule = findUserRole.modules.find(
      (item) => item.name === module
    );

    if (!isNil(findModule)) {
      return findModule.permissionsActions.includes(permission as any);
    }
  }

  return false;
};

export const isRole = (dataUser: any, roles: string[]) => {
  const rol = get(dataUser, "scope_actual", undefined);

  return roles.includes(rol);
};

export const getSession = (context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>) => {

	// const cookies = context.req.cookies;
	// const possibleCookieNames = [
	// 	'__Secure-next-auth.session-token',
	// 	'next-auth.session-token',
	// 	'__Host-next-auth.session-token',
	// ];
	
	// for (const cookieName of possibleCookieNames) {
	// 	if (cookies[cookieName]) {
	// 		return jwt.decode(cookies[cookieName]) as DecodedSessionToken;
	// 	}
	// }

	if (context.req.cookies['__Secure-next-auth.session-token']) {
		return jwt.decode(context.req.cookies['__Secure-next-auth.session-token']) as DecodedSessionToken;
	}
	return null;
}
