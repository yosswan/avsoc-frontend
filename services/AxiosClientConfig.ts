import axios, { AxiosRequestConfig } from "axios";
import { getSession, signIn } from "next-auth/react";

const config: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
};

const client = axios.create(config);

client.interceptors.request.use(
  (config) =>
    getSession()
      .then((res) => {
        if (res?.user?.access_token)
          config.headers.Authorization = "Bearer " + res?.user?.access_token;
      })
      .then(() => config),
  (error) => Promise.reject(error)
);

client.interceptors.response.use(
  (response) => {
    const isFile =
      response.data instanceof Blob ||
      response.data instanceof ArrayBuffer;

    if (isFile) {
      return response;
    }
    return response.data;
  },
  async (error) => {
    return Promise.reject({
      ...error?.response?.data,
      status: error?.response?.status,
    });
  }
);

export default client;