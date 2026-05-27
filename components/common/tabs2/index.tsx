import clsx from "clsx";
import React, { useCallback } from "react";

export interface TypographyProps {
  tabs: any;
  setTabs: any;
}

function TabsComponent({ tabs, setTabs }: TypographyProps) {
  const handleChangeTab = useCallback((index: any) => {
    setTabs((prev: any) =>
      prev.map((tab: any, i: any) => ({
        ...tab,
        current: i === index,
      }))
    );
  }, [setTabs]);

  const currentTab = tabs.find((tab: any) => tab.current);
  const CurrentComponent = currentTab?.component;

  return (
    <>
      <div className="block w-full">
        <div className="">
          <nav className="-mb-px flex gap-2" aria-label="Tabs">
            {tabs.map((tab: any, index: any) => (
              <p
                key={tab.name}
                className={clsx(
                  tab.current
                    ? "border-yellow bg-yellow text-primary font-bold"
                    : "border-primary text-primary hover:text-gray-100 hover:border-gray-300",
                  "w-1/3 py-2 px-1 text-center border text-xs sm:text-lg cursor-pointer rounded"
                )}
                aria-current={tab.current ? "page" : undefined}
                onClick={() => handleChangeTab(index)}
              >
                {tab.name}
              </p>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex mt-10 w-full">
        {CurrentComponent && <CurrentComponent />}
      </div>
    </>
  );
}
export const Tabs = React.memo(TabsComponent);
