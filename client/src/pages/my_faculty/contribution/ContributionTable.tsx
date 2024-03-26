import Table from "../../../ui/Table";
import ContributionOperation from "./ContributionOperation";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import ContributionRow from "./ContributionRow";
import Spinner from "../../../ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Submission } from "../../../redux/slices/SubmissionSlice";

export default function ContributionTable() {
  const { isLoading: loadingSubmission, getSubmissionByContributionId } =
    useSubmission();
  const navigate = useNavigate();
  const { contributeId } = useParams();
  const [submissions, setSubmissions] = useState<Submission>([]);

  useEffect(() => {
    getSubmissionByContributionId(contributeId);
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      if (contributeId) {
        const fetchedSubmission =
          await getSubmissionByContributionId(contributeId);
        setSubmissions(fetchedSubmission);
      }
    };

    fetchArticles();
  }, [contributeId]);

  function openFolder(id) {
    navigate(`/myFaculty/contributions/submission/${id}`);
  }

  // if (loadingSubmission) return <Spinner />;

  return (
    <>
      {loadingSubmission ? (
        <Spinner />
      ) : (
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
      )}
    </>
  );
}
