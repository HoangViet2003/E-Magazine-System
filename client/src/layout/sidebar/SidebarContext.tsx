import { createContext, useState, useContext, ReactNode } from "react";
import useAddNoScrollClass from "../../redux/hooks/useAddNoScrollClass";

const SidebarContext = createContext({
  openSidebar: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenSidebar: (value: boolean) => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  useAddNoScrollClass(openSidebar);

  return (
    <SidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
