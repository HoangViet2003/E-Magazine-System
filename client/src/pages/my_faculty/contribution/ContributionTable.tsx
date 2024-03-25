import Table from "../../../ui/Table";
import ContributionOperation from "./ContributionOperation";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import ContributionRow from "./ContributionRow";
import Spinner from "../../../ui/Spinner";

export default function ContributionTable() {
  const { submissions, isLoading: loadingSubmission } = useSubmission();

  if (loadingSubmission) return <Spinner />;

  return (
    <Table columns="0.3fr 2.4fr 1fr 1fr">
      <Table.Header>
        <ContributionOperation />
      </Table.Header>

      <Table.Body
        data={submissions}
        render={(data) => (
          <div onDoubleClick={() => {}} key={data._id}>
            <ContributionRow data={data} />
          </div>
        )}
      />
    </Table>
  );
}
