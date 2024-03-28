import { createContext, useState, useContext, ReactNode } from "react";
import useAddNoScrollClass from "../../redux/hooks/useAddNoScrollClass";

const SidebarContext = createContext({
  openSidebar: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenSidebar: (value: boolean) => {},
  openImageUpload: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenImageUpload: (value: boolean) => {},
  openDocUpload: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenDocUpload: (value: boolean) => {},
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
