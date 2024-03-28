import {
  MouseEvent,
  ReactNode,
  createContext,
  useContext,
  useState,
} from "react";
import { useOutsideClick } from "../redux/hooks/useOutsideClick";
import { createPortal } from "react-dom";

interface DropdownsContextValue {
  openId: string | undefined;
  close: () => void;
  open: (id: string) => void;
  setPosition: (position: { x: number; y: number }) => void;
  position: { x: number; y: number } | null;
}

const DropdownsContext = createContext<DropdownsContextValue | null>(null);

function Dropdown({ children }: { children: ReactNode }) {
  return <div className="flex items-center ">{children}</div>;
}

function Dropdowns({ children }: { children: ReactNode }) {
  const [openId, setOpenId] = useState<string | undefined>();
  const close = () => setOpenId("");
  const open = setOpenId;

  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null,
  );

  return (
    <DropdownsContext.Provider
      value={{
        openId,
        close,
        open,
        position,
        setPosition,
      }}
    >
      {children}
    </DropdownsContext.Provider>
  );
}

function Toggle({
  id,
  children,
  startPosition = "left",
}: {
  id: string;
  children: ReactNode;
  startPosition?: string;
}) {
  const { openId, close, open, setPosition } = useContext(
    DropdownsContext,
  ) as DropdownsContextValue;

  function handleClick(e: MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const buttonElement = (e.target as Element).closest("button");
    if (buttonElement) {
      const rect = buttonElement.getBoundingClientRect();

      if (startPosition === "left")
        setPosition({
          x: rect.x,
          y: rect.y + rect.height + 8,
        });
      else
        setPosition({
          x: window.innerWidth - rect.width - rect.x,
          y: rect.y + rect.height + 8,
        });

      openId === "" || openId !== id ? open(id) : close();
    }
  }

  return <button onClick={handleClick}>{children}</button>;
}

function List({
  id,
  children,
  startPosition = "left",
}: {
  id: string;
  children: ReactNode;
  startPosition?: string;
}) {
  const { openId, position, close } = useContext(
    DropdownsContext,
  ) as DropdownsContextValue;
  const ref = useOutsideClick(close, false);

  const x = Math.round(position?.x ?? 0);
  const y = Math.round(position?.y ?? 0);

  if (openId !== id) return null;

  return createPortal(
    <ul
      className={`fixed z-20 w-60 rounded-sm border border-borderColor bg-white shadow-lg`}
      style={
        startPosition === "left" ? { top: y, left: x } : { top: y, right: x }
      }
      ref={ref as React.RefObject<HTMLUListElement>}
    >
      {children}
    </ul>,
    document.body,
  );
}

function Button({
  children,
  icon,
  onClick,
}: {
  children: ReactNode;
  icon: ReactNode | string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  const { close } = useContext(DropdownsContext) as DropdownsContextValue;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    onClick?.(event);
    close();
  }

  return (
    <li>
      <button
        className="flex w-full items-center gap-3 bg-none px-6 py-2 hover:bg-slate-100"
        onClick={handleClick}
      >
        {typeof icon === "string" ? <img src={icon} alt="" /> : icon}
        <span className="">{children}</span>
      </button>
    </li>
  );
}

Dropdowns.Dropdown = Dropdown;
Dropdowns.Toggle = Toggle;
Dropdowns.List = List;
Dropdowns.Button = Button;

export default Dropdowns;
