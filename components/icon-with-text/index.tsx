import * as React from "react";
import { ValidateImage, ValidateString } from "lib/helper";
import clsx from "clsx";

export const IconWithText: React.FC<{
  icon?: string;
  text?: string;
  isUser?: boolean;
  classNameContainer?: string;
  isVertical?: boolean;
  children?: React.ReactNode;
}> = ({
  icon,
  text,
  classNameContainer,
  children,
  isUser = false,
  isVertical,
}) => {
  return (
    <div>
      <div
        className={clsx("flex items-center", classNameContainer, {
          "flex-col": isVertical,
        })}
      >
        <div className="flex-shrink-0 h-10 w-10">
          <img
            className="w-10 h-10 object-cover object-center rounded-full"
            src={ValidateImage(icon, isUser)}
            alt=""
          />
        </div>
        <div className={clsx({ "ml-5": !isVertical })}>
          <div className="text-base font-medium text-gray-900 capitalize">
            {ValidateString(text)}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
