import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { DecodedSessionToken } from 'interfaces';
import { PermissionsEnums } from 'consts/permissionsEnum';
import { ModuleEnums } from 'consts/modulesEmuns';
import { decodeJwt } from 'jose';
import { PermissionByRol } from 'consts/permissionByRol';

export function middleware(request: NextRequest) {
	// console.log('middleware', request.nextUrl)
	const loginUrl = new URL('/auth/signin', request.url);
	const dashboardUrl = new URL('/dashboard', request.url);
  
	// 1. Obtener el token de las cookies
	// console.log('cookies', request.cookies)
	const token = request.cookies.get('__Secure-next-auth.session-token') || request.cookies.get('next-auth.session-token');
	if (!token) {
		// console.log('no token')
    return NextResponse.redirect(loginUrl);
  }
	const session =	decodeJwt(token) as DecodedSessionToken;

  // 2. Lógica de protección
  if (!session) {
		// console.log('no session')
    return NextResponse.redirect(loginUrl);
  }

	if (
		request.nextUrl.pathname.includes('informes-mensuales') ||
		request.nextUrl.pathname.includes('miembros')
	) {
		let module = ModuleEnums.CAMPOREE;
		if (request.nextUrl.pathname.includes('informes-mensuales')) {
			module = ModuleEnums.INFORMES_MENSUALES;
		} else if (request.nextUrl.pathname.includes('miembros')) {
			module = ModuleEnums.MIEMBROS;
		}
		// console.log('module', module)
		const isValid = routeValidForUser(
			session,
			PermissionsEnums.VIEW,
			module
		);
	
		if (!isValid) {
			// console.log('no valid')
			return NextResponse.redirect(dashboardUrl);
		}
	}

  // Si hay token, permitimos el paso
  return NextResponse.next();
}

export const routeValidForUser = (
  data: any,
  permission: string,
  module: string
) => {
  const rol = data.scope_actual;
  const findUserRole = PermissionByRol.find((item) => item.role === rol);

  if (findUserRole) {
    const findModule = findUserRole.modules.find(
      (item) => item.name === module
    );

    if (findModule) {
      return findModule.permissionsActions.includes(permission as any);
    }
  }

  return false;
};

// 3. Configuración del "Matcher"
// Esto es vital: define qué rutas activan este middleware
export const config = {
  matcher: [
		'/dashboard/:path*',
  ],
};