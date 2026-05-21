import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload } from "antd";
import React from "react";
import type { UploadFile } from "antd/es/upload/interface";
import type { RcFile } from "antd/es/upload";
import { Controller } from "react-hook-form";
import { Icon } from "components/icon";
import { Icons } from "consts";
import { Typography } from "../typography";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import clsx from "clsx";
import { FileService } from "services/Image";

const { Dragger } = Upload;

const props: UploadProps = {
  name: "file",
  multiple: true,
  // action: "https://www.mocky.io/v2/5cc8019d300000980a055e76",
  // onChange(info) {
  //   const { status } = info.file;
  //   if (status !== "uploading") {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (status === "done") {
  //     message.success(`${info.file.name} file uploaded successfully.`);
  //   } else if (status === "error") {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // },
  onDrop(e) {

  },
};
export interface AlertProps {
  // color: "success" | "danger";
  // message?: string;
  // customIcon?: string;
  rules: any;
  error: any;
  control: any;
  register: any;
  name: string;
  setValueRHF: any;
  setErrorRHF: any;
  isEdit?: boolean;
  disabled?: boolean;
  image?: string;
  className?: string;
  label?: string;
}

/**
 * Use to notificate the user something happened
 */
export const InputImage: React.FC<AlertProps> = ({
  setValueRHF,
  disabled,
  label,
  name,
  error,
  setErrorRHF,
  register,
  className,
  isEdit,
  rules,
  image,
  control,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState(image);
  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  }

  const handleChange = async (info: any) => {
    if (info.file.status === "uploading") {
			setImageUrl('');
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
			const imageUrl = await FileService.upload(info.file.originFileObj as RcFile);
			setImageUrl(imageUrl);
			setValueRHF(name, imageUrl, { shouldValidate: true });
			setLoading(false);
    }
  };
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );
  return (
    <Controller
      control={control}
      name={name}
      // defaultValue={fileList}
      rules={rules} //optional
      render={({
        field: { onChange },
        fieldState: { invalid, isDirty }, //optional
        formState: { errors: error }, //optional, but necessary if you want to show an error message
      }) => (
        <>
          <div className={clsx("flex-auto", className)}>
            {label && (
              <Typography
                type="label"
                className={clsx("ml-3 font-normal mb-2 block f-18", {"is-required": rules?.required})}
              >
                {label}
              </Typography>
            )}
            <Upload
              {...props}
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              accept=".jpg,.jpeg,.png"
              // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: "100%" }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          {error && error[name]?.message && (
            <span className="flex items-center mt-3 text-alert-error font-montserrat">
              <div className="mr-1 w-4 h-3">
                <Icon
                  src={Icons.exclamation}
                  fillPath
                  className="text-alert-error"
                />
              </div>
              <Typography type="caption" className="f-12">
                {String(error[name]?.message || '')}
              </Typography>
            </span>
          )}
        </>
      )}
    />
  );
};
