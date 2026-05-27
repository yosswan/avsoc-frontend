/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import Pagination, { PaginationProps } from "components/pagination/Pagination";
import { isEmpty } from "lodash";
import styled from "styled-components";

export type Selector<T> = (
  row: T,
  rowIndex?: number
) => string | number | boolean | bigint | JSX.Element;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TableColumnType<T = any> = {
  name: string;
  label: string;
  selector: Selector<T>;
  thClassName?: string;
  tdClassName?: string;
};

export type DataTableProps<T = any> = {
  columns: TableColumnType<T>[];
  data: T[];
};

const StyledTable = styled.table.attrs({
  className: `
		min-w-full 
		divide-y 
		divide-gray-200
`,
})``;

const StyledTHead = styled.thead.attrs({
  className: `
    bg-yellow
`,
})``;

const StyledTBody = styled.tbody.attrs({
  className: `
		bg-white 
		divide-y 
		divide-gray-200
`,
})``;

const PaginationContainer = styled.div.attrs({
  className: `
    mt-10
    justify-center
    flex
`,
})``;

const DataTableComponent = React.memo(<T extends unknown>({
  columns,
  data,
  currentPage,
  limit,
  total,
  setPage,
}: DataTableProps<T> & PaginationProps) => {
  const rows = useMemo(() => data.map((value, i) => {
    const cells = columns.map((column) => {
      return {
        className: column.tdClassName,
        name: column.name,
        value: column.selector(value),
      };
    });
    const key = `tr-${cells[0].name}-${i}`;
    return {
      key,
      cells,
    };
  }), [data, columns]);

  return (
    <>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow-md overflow-hidden border-b border-gray-200 rounded-lg">
            <StyledTable>
              <StyledTHead>
                <tr>
                  {columns.map((column: any) => {
                    return (
                      <th
                        key={`th-${column.name}`}
                        scope="col"
                        className={column.thClassName}
                      >
                        {column.label}
                      </th>
                    );
                  })}
                </tr>
              </StyledTHead>
              <StyledTBody>
                {rows.map((value: any, i: number) => {
                  return (
                    <tr key={value.key}>
                      {value.cells.map((cell: any) => {
                        return (
                          <td
                            key={`td-${cell.name}-${i}`}
                            className={cell.className}
                          >
                            {cell.value}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </StyledTBody>
            </StyledTable>
          </div>
        </div>
      </div>
      {!isEmpty(rows) ? (
        <PaginationContainer>
          <Pagination
            total={total}
            currentPage={currentPage}
            limit={limit}
            setPage={setPage}
          />
        </PaginationContainer>
      ) : (
        <div className="flex justify-center">
          <h3 className="font-medium text-primary text-xl mt-9">Empty data</h3>
        </div>
      )}
    </>
  );
});

export default DataTableComponent;
