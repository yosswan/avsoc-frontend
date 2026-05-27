/* eslint-disable */
import { Listbox, Transition } from "@headlessui/react";
import { ChevronDownIcon, XIcon } from "@heroicons/react/solid";
import { entries, get, isNil } from "lodash";
import React, { Fragment, useCallback, useMemo, useState, useEffect } from "react";
import styled from "styled-components";

type SelectInputProps = {
  name: string;
  label: string;
  options: { [key: string]: string };
  maxwidth?: string;
  value?: string | number;
  className?: string;
  hideDeleteSelected?: boolean;
  setValue: (key: string, value: string | number | undefined) => void;
	disabled?: boolean;
};

const Container = styled.div.attrs<any>(({ $maxwidth, className }: any) => ({
  className: `
    flex-auto,
		${className},
    ${$maxwidth ? $maxwidth : "max-w-[200px]"}
`,
}))<any>``;

export const SelectInput = React.memo(({
  name,
  label,
  options,
  maxwidth,
  value,
  className,
  setValue,
  hideDeleteSelected,
	disabled
}: SelectInputProps) => {
  const [selectedValue, selectValue] = useState<string | number | undefined>(
    value
  );

  useEffect(() => {
    selectValue(value);
  }, [value]);

  const isSelected = useCallback(() => {
    return !isNil(selectedValue);
  }, [selectedValue]);

  const clearFilter = useCallback(() => {
    setValue(name, undefined);
    selectValue(undefined);
  }, [name, setValue]);

  const handleChange = useCallback((val: string) => {
    setValue(name, val);
    selectValue(val);
  }, [name, setValue]);

  const values = useMemo(() => entries(options), [options]);

  return (
    <Container $maxwidth={maxwidth} className={className}>
      <Listbox value={selectedValue ?? ""} onChange={handleChange} disabled={disabled} >
        <div className="relative">
          <Listbox.Button className="relative w-full h-10 pl-3 pr-10 text-left bg-transparent shadow-md cursor-default focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-[black] focus-visible:ring-offset-orange-300 focus-visible:ring-offset-2 focus-visible:border-yellow sm:text-sm border-yellow border rounded-full">
            {(!isSelected() || hideDeleteSelected) && (
              <>
                <span className="block truncate text-[black] text-xs">
                  {!hideDeleteSelected
                    ? label
                    : get(options, selectedValue!, "N/A")}
                </span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronDownIcon
                    className="w-5 h-5 text-[black]"
                    aria-hidden="true"
                  />
                </span>
              </>
            )}
            {isSelected() && !hideDeleteSelected && (
              <>
                <span className="flex justify-between truncate text-[black] font-bold text-xs">
                  {`${get(options, selectedValue!, "N/A")}`}
                </span>
                {!hideDeleteSelected && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <XIcon
                      onClick={clearFilter}
                      className="w-5 h-5 text-[black] cursor-pointer"
                      aria-hidden="true"
                    />
                  </span>
                )}
              </>
            )}
          </Listbox.Button>
          {(!isSelected() || hideDeleteSelected) && (
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute   z-50 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {values.map(([key, value], index) => {
                  return (
                    <Listbox.Option
                      key={`opt-${name}-${index}`}
                      className="cursor-default hover:bg-primary hover:text-white select-none relative py-2 pl-10 pr-4 text-[black]"
                      value={key}
                    >
                      {value}
                    </Listbox.Option>
                  );
                })}
              </Listbox.Options>
            </Transition>
          )}
        </div>
      </Listbox>
    </Container>
  );
});
