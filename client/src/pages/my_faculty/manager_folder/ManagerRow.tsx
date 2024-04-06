import FolderIcon from "../../../assets/icons/folder.svg";
import Table from "../../../ui/Table";

const commonCell =
  "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

export default function ManagerRow({ data }) {
  const { facultyId } = data;

  const date = new Date(facultyId.createdAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  return (
    <Table.Row>
      <div className="m-[auto] select-none">
        <img src={FolderIcon} />
      </div>

      <div
        className={commonCell + " font-semibold"}
        style={{ color: "#272833" }}
      >
        {facultyId.name}'s Submission
      </div>

      <div className={commonCell}>{formattedDate}</div>
    </Table.Row>
  );
}
