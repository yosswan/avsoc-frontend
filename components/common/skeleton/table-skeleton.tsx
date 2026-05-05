import * as React from "react";
import clsx from "clsx";
import Styles from "./table-skeleton.module.scss";

export interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 8,
  columns = 5,
  className,
}) => {
  return (
    <div className={clsx("w-full", className)}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow-md overflow-hidden border-b border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-yellow">
                <tr>
                  {Array.from({ length: columns }).map((_, index) => (
                    <th
                      key={`header-${index}`}
                      className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider"
                    >
                      <div className={clsx("h-4 w-20 rounded", Styles.skeleton)} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.from({ length: rows }).map((_, rowIndex) => (
                  <tr key={`row-${rowIndex}`}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                      <td
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="px-6 py-4 whitespace-nowrap"
                      >
                        {colIndex === 0 ? (
                          <div className="flex items-center">
                            <div className={clsx("w-10 h-10 rounded-full flex-shrink-0 mr-4", Styles.skeleton)} />
                            <div className={clsx("h-4 rounded w-32", Styles.skeleton)} />
                          </div>
                        ) : (
                          <div
                            className={clsx(
                              "h-4 rounded",
                              colIndex === columns - 1 ? "w-16" : "w-32",
                              Styles.skeleton
                            )}
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
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