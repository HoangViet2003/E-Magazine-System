import { useNavigate, useSearchParams } from "react-router-dom";
import { useContribution } from "../../../redux/hooks";
import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import ManagerRow from "./ManagerRow";
import ManagerOperation from "./ManagerOperation";

export default function ManagerTable() {
  const navigate = useNavigate();
  const { managerContributions, isLoading } = useContribution();

  function openFolder(id: string) {
    navigate(`/myFaculty/contributions/${id}`);
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table columns="0.3fr 2.4fr 1fr">
          <Table.Header>
            <ManagerOperation />
          </Table.Header>

          <Table.Body
            data={managerContributions}
            render={(data) => (
              <div
                onDoubleClick={() => {
                  openFolder(data._id);
                }}
                key={data._id}
              >
                <ManagerRow data={data} />
              </div>
            )}
          />
        </Table>
      )}
    </>
  );
}
