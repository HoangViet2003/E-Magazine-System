import { useNavigate } from "react-router-dom";
import { useContribution } from "../../../redux/hooks";
import Spinner from "../../../ui/Spinner";
import Table from "../../../ui/Table";
import ManagerRow from "./ManagerRow";
import ManagerOperation from "./ManagerOperation";

export default function ManagerTable() {
  const { managerContributions, isLoading } = useContribution();
  const navigate = useNavigate();

  function openFolder(id: string) {
    navigate(`/myFaculty/contributions/${id}`);
    // searchParams.set("contributionId", contributionId || "");
    // setSearchParams(searchParams);
  }

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <Table columns="0.3fr 2.4fr  1fr">
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
