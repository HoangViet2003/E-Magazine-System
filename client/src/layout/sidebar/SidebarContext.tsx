import { createContext, useState, useContext, ReactNode } from "react";
import useAddNoScrollClass from "../../redux/hooks/useAddNoScrollClass";

const SidebarContext = createContext({
  openSidebar: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenSidebar: (value: boolean) => {},
  openUploadImage: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenUploadImage: (value: boolean) => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openUploadImage, setOpenUploadImage] = useState(false);

  useAddNoScrollClass(openSidebar);
  useAddNoScrollClass(openUploadImage);

  return (
    <SidebarContext.Provider
      value={{
        openSidebar,
        setOpenSidebar,
        openUploadImage,
        setOpenUploadImage,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
