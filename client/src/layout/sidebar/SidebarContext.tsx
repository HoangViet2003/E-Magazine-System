import { createContext, useState, useContext, ReactNode } from "react";
import useAddNoScrollClass from "../../redux/hooks/useAddNoScrollClass";

const SidebarContext = createContext({
  openSidebar: false,
  setOpenSidebar: (value: boolean) => {
    console.log(value);
  },
  openImageUpload: false,
  setOpenImageUpload: (value: boolean) => {
    console.log(value);
  },
  openDocUpload: false,
  setOpenDocUpload: (value: boolean) => {
    console.log(value);
  },
});

export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openDocUpload, setOpenDocUpload] = useState(false);
  const [openImageUpload, setOpenImageUpload] = useState(false);

  useAddNoScrollClass(openSidebar);
  useAddNoScrollClass(openImageUpload);

  return (
    <SidebarContext.Provider
      value={{
        openSidebar,
        setOpenSidebar,
        openImageUpload,
        setOpenImageUpload,
        openDocUpload,
        setOpenDocUpload,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
