import { useNavigate } from "react-router-dom";
import ProfileImg from "../../../assets/profile1.png";
import { useAuth } from "../../../redux/hooks";
import { User } from "../../../redux/slices/UserSlice";
import Table from "../../../ui/Table";
import Button from "../../../ui/Button";

const AccountRow: React.FC<{ data: User }> = ({ data }) => {
  const { deleteUser } = useAuth();
  const { _id, name, email, role } = data;
  const navigate = useNavigate();

  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  const handleDeleteClick = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (confirmed) {
      deleteUser(_id);
    }
  };

  return (
    <div onDoubleClick={() => navigate("/account/create", { state: { data } })}>
      <Table.Row>
        <div className="m-[auto] w-12 select-none ">
          <img src={ProfileImg} className="rounded-full" />
        </div>

        <div
          className={commonCell + " font-semibold"}
          style={{ color: "#272833" }}
        >
          {name}
        </div>

        <div className={commonCell}>{email}</div>

        <div className={commonCell + " flex items-center gap-2"}>{role}</div>

        <div className={commonCell}>
          <Button className="px-4 py-1" onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      </Table.Row>
    </div>
  );
};

export default AccountRow;
