import type { DefaultSession } from "next-auth";
import type {JWT} from 'next-auth/jwt'

declare module "next-auth" {
	interface User {
		verificado?: boolean;
		foto?: string;
		nombres?: string;
		apellidos?: string;
		access_token?: string;
    expires_at?: string;
    scope_actual?: string;
		user_id?: number;
	};

	interface Session {
    error?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    expires_at?: string;
    scope_actual?: string;
    verificado?: boolean;
		foto?: string;
		nombres?: string;
		apellidos?: string;
		user_id?: number;
		error?: string;
  }
}