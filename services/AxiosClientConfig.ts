import axios from "axios";
import { getSession, signIn } from "next-auth/client";

const config = axios.defaults;

config.baseURL = process.env.NEXT_PUBLIC_API;
config.headers = { ...config.headers, "Content-Type": "application/json" };

const client = axios.create(config);

// Body Interceptor
// client.interceptors.request.use(
// 	(config) => {
// 		if (config.data) {
// 			return config?.data;
// 		}
// 		return config;
// 	},
// 	(error) => Promise.reject(error)
// );

// client.interceptors.response.use(
// 	(response) => {
// 		if (response.data) {
// 			response.data = camelcaseKeys(response.data);
// 		}
// 		return response;
// 	},
// 	(error) => Promise.reject(error)
// );
// ----

// Auth Herder Interceptor
client.interceptors.request.use(
  (config) =>
    getSession()
      .then((res) => {
        if (res?.accessToken)
          config.headers.Authorization = "Bearer " + res?.accessToken;
      })
      .then(() => config),
  (error) => Promise.reject(error)
);

// Data Refresh token interceptor
client.interceptors.response.use((response) => {
  if (response.headers["refresh-token"]) {
    getSession().then((res) => {
      signIn("credentials", {
        refreshToken: response.headers["refresh-token"],
        redirect: false,
        oldSession: JSON.stringify(res),
      });
    });
  }

  return response;
});

// Data Response Interceptor
client.interceptors.response.use(
  (response) => {
		const isFile = 
			response.data instanceof Blob || 
			response.data instanceof ArrayBuffer;

		if (isFile) {
			return response; // Devuelve objeto completo (incluye headers)
		}
    return response.data;
  },
  (error) => {
    return Promise.reject({
      ...error?.response?.data,
      status: error?.response?.status,
    });
  }
);

export default client;
