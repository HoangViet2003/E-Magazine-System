import Table from "../../../ui/Table";
import ContributionOperation from "./ContributionOperation";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import ContributionRow from "./ContributionRow";
import Spinner from "../../../ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

export default function ContributionTable() {
  const {
    submissions,
    isLoading: loadingSubmission,
    getSubmissionsByContributionId,
  } = useSubmission();
  const navigate = useNavigate();
  const { contributionId } = useParams();
  // const [searchParams, setSearchParams] = useSearchParams();
  // const role = localStorage.getItem("role");

  console.log(submissions);

  useEffect(() => {
    if (contributionId) getSubmissionsByContributionId(contributionId);
  }, [contributionId]);

  function openFolder(id: string) {
    navigate(
      `/myFaculty/contributions/submissions/${id}?contributionId=${contributionId}`,
    );
  }

  return (
    <>
      {loadingSubmission ? (
        <Spinner />
      ) : (
        <Table columns="0.3fr 2.4fr 1fr 1fr 0.3fr">
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
      )}
    </>
  );
}
