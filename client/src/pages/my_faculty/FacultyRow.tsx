import Table from "../../ui/Table";
import DocsIcon from "../../assets/icons/icon-document-text.svg";

interface FacultyRowProps {
  data: {
    _id: string;
    name: string;
    action: string;
    profile: string;
    owner: string;
    updatedAt: string;
  };
}

const FacultyRow: React.FC<FacultyRowProps> = ({ data }) => {
  const { name, action, profile, owner, updatedAt } = data;

  const date = new Date(updatedAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  return (
    <Table.Row>
      <div className="m-[auto] select-none">
        <img src={DocsIcon} />
      </div>
      <div
        className={commonCell + " font-semibold"}
        style={{ color: "#272833" }}
      >
        {name}
      </div>
      <div className={commonCell}>{action}</div>
      <div className={commonCell + " flex items-center gap-2"}>
        <img
          src={profile}
          alt="profile-img"
          className="h-8 w-8 rounded-full object-cover"
        />
        {owner}
      </div>
      <div className={commonCell}>{formattedDate}</div>
    </Table.Row>
  );
};

export default FacultyRow;
