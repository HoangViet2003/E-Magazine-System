import { Submission } from "../../../redux/slices/SubmissionSlice";
import Table from "../../../ui/Table";
import FolderIcon from "../../../assets/icons/folder.svg";
import ProfileImg from "../../../assets/profile1.png";

const ContributionRow: React.FC<{ data: Submission }> = ({ data }) => {
  const { student, updatedAt, isSelectedForPublication } = data;

  const date = new Date(updatedAt);
  const formattedDate = `${date.getDate() < 10 ? "0" : ""}${date.getDate()}/${date.getMonth() + 1 < 10 ? "0" : ""}${date.getMonth() + 1}/${date.getFullYear()}`;

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
        {student?.name}'s Submission
      </div>
      <div className={commonCell + " flex items-center gap-2"}>
        <img
          src={ProfileImg}
          alt="profile-img"
          className="h-8 w-8 rounded-full object-cover"
        />
        {student?.name}
      </div>
      <div className={commonCell}>{formattedDate}</div>

      <div className={commonCell}>
        {isSelectedForPublication ? (
          <input
            type="checkbox"
            className="checkbox-success checkbox cursor-default"
            checked
          />
        ) : (
          <input
            type="checkbox"
            className="checkbox-success checkbox"
            disabled={true}
          />
        )}
      </div>
    </Table.Row>
  );
};

export default ContributionRow;
