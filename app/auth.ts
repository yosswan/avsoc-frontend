import NextAuth, { User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { addDays, format } from 'date-fns';

export interface LoginResponse {
	access_token: string;
	token_type:   string;
	expires_at:   string;
	scopes:       string[];
	scope_actual: string;
	user:         LoggedUser;
}

export interface RefreshResponse {
	access_token: string;
	token_type:   string;
	expires_at:   string;
	scopes:       string[];
}

export interface LoggedUser {
	id: number;
	nombres:    string;
	apellidos:  string;
	foto:       string;
	username:   string;
	email:      string;
	verificado: boolean;
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: true,
  pages: {
    signIn: "/auth/signin",
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials) {
            return null;
          }

          const res = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
              remember_me: true,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) {
            return null;
          }

          const responseData = await res.json() as LoginResponse;
          if (responseData?.access_token) {
            const result = {
							user_id: responseData.user.id,
              verificado: responseData.user.verificado,
							foto: responseData.user.foto,
							nombres: responseData.user.nombres,
							apellidos: responseData.user.apellidos,
							email: responseData.user.email,
							access_token: responseData.access_token,
							expires_at: responseData.expires_at,
							scope_actual: responseData.scope_actual,
            };
            return result;
          }

          return null;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.access_token = user.access_token;
        token.expires_at = user.expires_at;
        token.scope_actual = user.scope_actual;
        token.user_id = user.user_id;
				token.nombres = user.nombres;
				token.apellidos = user.apellidos;
				token.foto = user.foto;
				token.verificado = user.verificado;
      }

      if (trigger === "update" && session) {
        token.access_token = session.access_token || token.access_token;
        token.expires_at = session.expires_at || token.expires_at;
        token.scope_actual = session.scope_actual || token.scope_actual;
        token.verificado = session.verificado || token.verificado;
      }

      if (token.expires_at) {
        const now =  addDays(new Date(), 30).toISOString().replace('T', ' ').substring(0, 19);
        const expiresAt = token.expires_at;
        if (now > expiresAt) {
					try {
						const response = await fetch(`${process.env.NEXT_PUBLIC_API}/auth/refresh`, {
							method: "GET",
							headers: {
								'Authorization': `Bearer ${token.access_token}`
							}
						});

						const tokenOrError = await response.json();

						if (!response.ok) throw tokenOrError;

						const newToken = tokenOrError as RefreshResponse;
						token.access_token = newToken.access_token;
						token.expires_at = newToken.expires_at;
					} catch (error) {
						console.error("Error refreshing access_token", error)
						token.error = "RefreshTokenError"
					}
				}
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          ...session.user,
					user_id: token.user_id,
          verificado: token.verificado,
          foto: token.foto,
          nombres: token.nombres,
          apellidos: token.apellidos,
					access_token: token.access_token,
					expires_at: token.expires_at,
					scope_actual: token.scope_actual,
        };
				session.error = token.error;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  trustHost: true,
});