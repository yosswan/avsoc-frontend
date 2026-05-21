import { LoadingOutlined } from "@ant-design/icons";

declare module "react" {
  interface DOMAttributes<T> {
    onPointerEnterCapture?: (e: PointerEvent) => void;
    onPointerLeaveCapture?: (e: PointerEvent) => void;
  }
}