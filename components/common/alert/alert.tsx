import * as React from "react";
import SVG from "react-inlinesvg";
import clsx from "clsx";
import { Icon } from "components/icon";
import { Icons } from "consts";

export interface AlertProps {
  /**
   * color background.
   */
  color?: "success" | "danger" | string;
  /**
   * Message that goes inside the alert.
   */
  message?: string;
  /**
   * Icon use to replace the default.
   */
  customIcon?: string;
  className?: string;
  hideIcon?: boolean;
	whiteIcon?: boolean;
}

/**
 * Use to notificate the user something happened
 */
export const Alert: React.FC<AlertProps> = ({
  message,
  customIcon,
  className,
  children,
  color,
  hideIcon,
	whiteIcon=false,
}) => {
  return (
    <div
      className={clsx(
        "flex items-center px-12 w-680  text-gray-0 text-xl rounded-10",
        { "bg-alert-error": color === "danger" },
        { "bg-alert-success": color === "success" },
        className,
        { "h-24": !className }
      )}
    >
      {!hideIcon && (
        <Icon
          src={Icons.exclamation}
          fillPath
          className={`text-[${whiteIcon ? 'white' : 'black'}] w-4 mr-2 flex-shrink-0`}
        ></Icon>
      )}

      {message || children}
    </div>
  );
};
