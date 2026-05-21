import clsx from "clsx";
import * as React from "react";
import SVG from "react-inlinesvg";
import styles from "./icon.module.scss";

interface IconProps {
  src: string;
  width?: string;
  height?: string;
  className?: string;
  pointer?: boolean;
  fillPath?: boolean | any;
  fillLine?: boolean;
  fillCircle?: boolean;
  fillRect?: boolean;
  fill?: string;
  onClick?: any;
}

export const Icon: React.FC<IconProps> = ({
  src,
  className,
  pointer = false,
  fillPath = false,
  fillLine = false,
  fillRect = false,
  fillCircle = false,
  fill,
  onClick,
}) => {
  return (
    <SVG
      src={src}
      onClick={onClick}
      // style={stylesProps}
      fill={fill}
      className={clsx(
        className,
        { "cursor-pointer": pointer },
        [fillPath && styles.svgFillPath],
        [fillCircle && styles.svgFillCircle],
        [fillLine && styles.svgFillLine],
        [fillRect && styles.svgFillRect]
      )}
    />
  );
};
