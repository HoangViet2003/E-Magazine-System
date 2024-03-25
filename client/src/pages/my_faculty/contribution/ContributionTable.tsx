import Table from "../../../ui/Table";
import ContributionOperation from "./ContributionOperation";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import ContributionRow from "./ContributionRow";
import Spinner from "../../../ui/Spinner";
import { useNavigate } from "react-router-dom";

export default function ContributionTable() {
  const { submissions, isLoading: loadingSubmission } = useSubmission();
  const navigate = useNavigate();

  function openFolder(id) {
    navigate(`/myFaculty/contributions/submission/${id}`);
  }

  if (loadingSubmission) return <Spinner />;

  return (
    <Table columns="0.3fr 2.4fr 1fr 1fr">
      <Table.Header>
        <ContributionOperation />
      </Table.Header>

      <Table.Body
        data={submissions}
        render={(data) => (
          <div
            onDoubleClick={() => {
              openFolder(data._id);
            }}
            key={data._id}
          >
            <ContributionRow data={data} />
          </div>
        )}
      />
    </Table>
  );
}
