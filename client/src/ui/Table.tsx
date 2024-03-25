import { ReactNode, createContext, useContext } from "react";

const commonRow = "grid items-center gap-x-4 py-4 text-sm";

interface TableContextType {
  columns: string;
}

interface BodyProps {
  data: any;
  render: (item: any) => ReactNode;
}

const TableContext = createContext<TableContextType | null>(null);

function Table({
  columns,
  children,
}: {
  columns: string;
  children: ReactNode;
}) {
  return (
    <TableContext.Provider value={{ columns }}>
      <div role="table">{children}</div>
    </TableContext.Provider>
  );
}

function Header({ children }: { children: ReactNode }) {
  const context = useContext(TableContext);
  const gridTemplateColumns = context?.columns;

  return (
    <div
      role="row"
      className={commonRow + " font-semibold"}
      style={{ gridTemplateColumns: gridTemplateColumns, color: "#6B6C7E" }}
    >
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  const context = useContext(TableContext);
  const gridTemplateColumns = context?.columns;

  return (
    <div
      role="row"
      className={commonRow + " border-b border-borderColor hover:bg-slate-100"}
      style={{ gridTemplateColumns: gridTemplateColumns, color: "#6B6C7E" }}
    >
      {children}
    </div>
  );
}

function Body({ data, render }: BodyProps) {
  if (!data.length) return <div>No data to show at the moment</div>;

  return <div>{data.map(render)}</div>;
}

Table.Header = Header;
Table.Body = Body;
Table.Row = Row;

export default Table;
