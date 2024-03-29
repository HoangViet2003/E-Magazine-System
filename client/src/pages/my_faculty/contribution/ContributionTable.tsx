import Table from "../../../ui/Table";
import ContributionOperation from "./ContributionOperation";
import { useSubmission } from "../../../redux/hooks/useSubmission";
import ContributionRow from "./ContributionRow";
import Spinner from "../../../ui/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ContributionTable() {
  const {
    submissions,
    isLoading: loadingSubmission,
    getSubmissionsByContributionId,
  } = useSubmission();
  const navigate = useNavigate();
  const { contributionId } = useParams();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (contributionId) getSubmissionsByContributionId(contributionId);
  }, [contributionId]);

  function openFolder(id: string) {
    if (role === "student") navigate(`/student/contributions/submission/${id}`);
    else {
      navigate(`/myFaculty/contributions/submission/${id}`);
    }
  }

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
