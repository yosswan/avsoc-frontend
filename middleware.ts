import { NextResponse } from "next/server";
import { PermissionsEnums } from "consts/permissionsEnum";
import { ModuleEnums } from "consts/modulesEmuns";
import { PermissionByRol } from "consts/permissionByRol";
import { auth } from "./app/auth";

export default auth((request) => {
	const loginUrl = new URL("/auth/signin", request.url);
  const dashboardUrl = new URL("/dashboard", request.url);
  const { pathname } = request.nextUrl;

  const session = request.auth;
  if (!session) {
    return NextResponse.redirect(loginUrl);
  }

  if (pathname.includes("informes-mensuales") || pathname.includes("miembros")) {
    let module = ModuleEnums.CLUBES;
    if (pathname.includes("informes-mensuales")) {
      module = ModuleEnums.INFORMES_MENSUALES;
    } else if (pathname.includes("miembros")) {
      module = ModuleEnums.MIEMBROS;
    }

		const isValid = routeValidForUser(session, PermissionsEnums.VIEW, module);
		if (!isValid) {
			return NextResponse.redirect(dashboardUrl);
		}
  }

  return NextResponse.next();
})

// export function middleware(request: NextRequest) {
//   const loginUrl = new URL("/auth/signin", request.url);
//   const dashboardUrl = new URL("/dashboard", request.url);
//   const { pathname } = request.nextUrl;

//   const token = request.cookies.get("authjs.session-token") || request.cookies.get("__Secure-authjs.session-token");
// 	console.log('middleware', pathname)
// 	console.log('token', token)
//   if (!token) {
//     return NextResponse.redirect(loginUrl);
//   }

//   if (pathname.includes("informes-mensuales") || pathname.includes("miembros")) {
//     let module = ModuleEnums.CAMPOREE;
//     if (pathname.includes("informes-mensuales")) {
//       module = ModuleEnums.INFORMES_MENSUALES;
//     } else if (pathname.includes("miembros")) {
//       module = ModuleEnums.MIEMBROS;
//     }

//     try {
//       const payload = token.value.split(".")[1];
//       const decoded = JSON.parse(Buffer.from(payload, "base64").toString());
//       const isValid = routeValidForUser(decoded, PermissionsEnums.VIEW, module);

//       if (!isValid) {
//         return NextResponse.redirect(dashboardUrl);
//       }
//     } catch (e) {
//       return NextResponse.redirect(loginUrl);
//     }
//   }

//   return NextResponse.next();
// }

export const routeValidForUser = (data: any, permission: string, module: string) => {
  const rol = data?.user?.scope_actual;
  const findUserRole = PermissionByRol.find((item) => item.role === rol);

  if (findUserRole) {
    const findModule = findUserRole.modules.find((item) => item.name === module);

    if (findModule) {
      return findModule.permissionsActions.includes(permission as any);
    }
  }

  return false;
};

export const config = {
  matcher: ["/dashboard/:path*"],
};