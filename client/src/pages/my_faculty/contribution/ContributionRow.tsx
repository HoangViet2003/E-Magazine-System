import { Submission } from "../../../redux/slices/SubmissionSlice";
import Table from "../../../ui/Table";
import FolderIcon from "../../../assets/icons/folder.svg";
import ProfileImg from "../../../assets/profile1.png";

const ContributionRow: React.FC<{ data: Submission }> = ({ data }) => {
  const { title, user, updatedAt } = data;

  const date = new Date(updatedAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  return (
    <Table.Row>
      <div className="m-[auto] select-none">
        <img src={FolderIcon} />
      </div>
      <div
        className={commonCell + " font-semibold"}
        style={{ color: "#272833" }}
      >
        {user.name}'s Submission
      </div>
      <div className={commonCell + " flex items-center gap-2"}>
        <img
          src={ProfileImg}
          alt="profile-img"
          className="h-8 w-8 rounded-full object-cover"
        />
        {user.name}
      </div>
      <div className={commonCell}>{formattedDate}</div>
    </Table.Row>
  );
};

export default ContributionRow;
