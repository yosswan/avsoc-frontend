import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { navigation as menu } from "consts/navigation";

interface NavigationContextInterface {
  navigation: any[];
  setNavigation: React.Dispatch<React.SetStateAction<any[]>>;
  showSubmenu: (item: any, positionMenu: any, positionSubMenu: any) => void;
}

const NavigationContext = createContext<NavigationContextInterface>({
  navigation: menu,
  setNavigation: () => null,
  showSubmenu: () => null,
});

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [navigation, setNavigation] = useState(menu);

  const showSubmenu = useCallback((item: any, positionMenu: any, positionSubMenu: any) => {
    setNavigation((prev: any) =>
      prev.map((section: any, index: any) => ({
        ...section,
        subNavigation: section.subNavigation.map((subItem: any, idx: any) =>
          idx === positionSubMenu
            ? {
                ...subItem,
                dropdownVisible:
                  positionMenu === index
                    ? !subItem.dropdownVisible
                    : subItem.dropdownVisible,
              }
            : subItem
        ),
      }))
    );
  }, []);

  const value = useMemo(
    () => ({ navigation, setNavigation, showSubmenu }),
    [navigation, showSubmenu]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
