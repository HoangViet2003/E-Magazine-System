import FolderIcon from "../../../assets/icons/folder.svg";
import Table from "../../../ui/Table";

const commonCell =
  "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

interface FacultyId {
  createdAt: string; // Assuming createdAt is a string, adjust the type as necessary
  name: string;
}

interface Data {
  facultyId: FacultyId;
}

export default function ManagerRow({ data }: { data: Data }) {
  const { facultyId } = data;

  const date = new Date(facultyId.createdAt);
  const formattedDate = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}/${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}/${date.getFullYear()}`;

  return (
    <Table.Row>
      <div className="m-[auto] select-none">
        <img src={FolderIcon} />
      </div>

      <div
        className={commonCell + " font-semibold"}
        style={{ color: "#272833" }}
      >
        {facultyId.name}
      </div>

      <div className={commonCell}>{formattedDate}</div>
    </Table.Row>
  );
}
