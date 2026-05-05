import * as React from "react";
import clsx from "clsx";
import Styles from "./card-skeleton.module.scss";

export interface CardSkeletonProps {
  rows?: number;
  className?: string;
}

export const CardSkeleton: React.FC<CardSkeletonProps> = ({
  rows = 6,
  className,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      <ul className="grid grid-cols-1 gap-6 lg:grid-cols-2 3xl:grid-cols-3">
        {Array.from({ length: rows }).map((_, index) => (
          <li
            key={`card-${index}`}
            className="col-span-1 bg-white rounded-lg shadow shadow-yellow divide-y divide-gray-200"
          >
            <div className="w-full flex-col flex items-center p-6 space-x-6">
              <div className="flex-1 w-full">
                <div className="flex items-center space-x-3 text-center justify-center">
                  <div className={clsx("h-5 w-32 rounded", Styles.skeleton)} />
                </div>
                <div className="mt-2">
                  <div className={clsx("h-4 w-full rounded", Styles.skeleton)} />
                  <div className={clsx("h-4 w-3/4 mt-1 rounded", Styles.skeleton)} />
                </div>
                <div className="mt-8 flex-grow flex w-full flex-col justify-start gap-y-4">
                  <div className="flex items-center gap-2">
                    <div className={clsx("h-4 w-4 rounded", Styles.skeleton)} />
                    <div className={clsx("h-4 w-24 rounded", Styles.skeleton)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={clsx("h-4 w-4 rounded", Styles.skeleton)} />
                    <div className={clsx("h-4 w-20 rounded", Styles.skeleton)} />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="-mt-px flex divide-x divide-gray-200">
                <div className="w-0 flex-1 flex">
                  <div className={clsx("relative w-0 flex-1 inline-flex items-center justify-center py-4 rounded-bl-lg")}>
                    <div className={clsx("h-4 w-12 ml-3 rounded", Styles.skeleton)} />
                  </div>
                </div>
                <div className="-ml-px w-0 flex-1 flex">
                  <div className={clsx("relative w-0 flex-1 inline-flex items-center justify-center py-4 rounded-br-lg")}>
                    <div className={clsx("h-4 w-14 ml-3 rounded", Styles.skeleton)} />
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <div className="flex items-center space-x-2">
          <div className={clsx("w-8 h-8 rounded", Styles.skeleton)} />
          <div className={clsx("w-8 h-8 rounded", Styles.skeleton)} />
          <div className={clsx("w-8 h-8 rounded", Styles.skeleton)} />
        </div>
      </div>
    </div>
  );
};