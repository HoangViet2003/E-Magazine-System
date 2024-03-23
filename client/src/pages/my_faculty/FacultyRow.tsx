import Table from "../../ui/Table";
import DocsIcon from "../../assets/icons/icon-document-text.svg";
import ImgIcon from "../../assets/icons/Img_box_fill.svg";
import { Contribution } from "../../redux/slices/ContributionSlice";
import ProfileImg from "../../assets/profile1.png";

const FacultyRow: React.FC<Contribution> = ({ data }) => {
  const { title, updatedAt, studentName, type } = data;

  const action = "test action";

  const date = new Date(updatedAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  return (
    <Table.Row>
      <div className="m-[auto] select-none">
        <img src={type === "word" ? DocsIcon : ImgIcon} />
      </div>
      <div
        className={commonCell + " font-semibold"}
        style={{ color: "#272833" }}
      >
        {title}
      </div>
      <div className={commonCell}>{action}</div>
      <div className={commonCell + " flex items-center gap-2"}>
        <img
          src={ProfileImg}
          alt="profile-img"
          className="h-8 w-8 rounded-full object-cover"
        />
        {studentName}
        test
      </div>
      <div className={commonCell}>{formattedDate}</div>
    </Table.Row>
  );
};

export default FacultyRow;
