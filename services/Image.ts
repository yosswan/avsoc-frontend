import { AxiosInstance } from "axios";
import axiosClient from "./AxiosClientConfig";
import { RcFile } from "antd/lib/upload";

class Service {
  constructor(private client: AxiosInstance) {}

  async upload(file: RcFile): Promise<string> {
		const form = new FormData();
		form.append('file', file);
		const isImage = file.type === "image/jpeg" || file.type === "image/png";
		const endpoint = isImage ? `/compress_image` : `/upload_file`
    const fileName = await this.client.post(endpoint, form);
		return `${process.env.NEXT_PUBLIC_STORAGE}/${fileName}`;
  }

  async delete(fileUrl: string): Promise<void> {
    await this.client.delete('/files', {
      params: { url: fileUrl },
    });
  }
}

export const FileService = new Service(axiosClient);
