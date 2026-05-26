import { AxiosInstance } from "axios";
import axiosClient from "./AxiosClientConfig";

class Service {
  constructor(private client: AxiosInstance) {}

  async getAll(params: any): Promise<any> {
    const { idConsejo } = params;
    return this.client.get(
      `/presidentes_federacion/personas_disponibles/${idConsejo}`,
      { params }
    );
  }
}

export const PresidentesFederacion = new Service(axiosClient);
