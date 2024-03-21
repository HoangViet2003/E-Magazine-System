import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";

const SidebarContext = createContext({
  openSidebar: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenSidebar: (value: boolean) => {},
});

export const useSidebarContext = () => useContext(SidebarContext);

export const SidebarProvider = ({ children }: { children: ReactNode }) => {
  const [openSidebar, setOpenSidebar] = useState(false);

  useEffect(() => {
    const addNoScrollClass = () => {
      document.body.classList.add("no-scroll");
    };

    const removeNoScrollClass = () => {
      document.body.classList.remove("no-scroll");
    };

    if (openSidebar) {
      addNoScrollClass();
    } else {
      removeNoScrollClass();
    }

    return () => {
      removeNoScrollClass();
    };
  }, [openSidebar]);

  return (
    <SidebarContext.Provider value={{ openSidebar, setOpenSidebar }}>
      {children}
    </SidebarContext.Provider>
  );
};
