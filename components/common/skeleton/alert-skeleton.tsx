import * as React from "react";
import clsx from "clsx";
import Styles from "./alert-skeleton.module.scss";

export interface AlertSkeletonProps {
  className?: string;
}

export const AlertSkeleton: React.FC<AlertSkeletonProps> = ({ className }) => {
  return (
    <div
      className={clsx(
        "mb-5 bg-gray-200 rounded-xl h-16 w-full",
        className
      )}
    >
      <div className="flex items-center justify-center h-full py-5">
        <div className="flex items-center gap-2">
          <div className={clsx("h-4 w-32 rounded", Styles.skeleton)} />
          <div className={clsx("h-6 w-16 rounded-lg", Styles.skeleton)} />
        </div>
      </div>
    </div>
  );
};