import LockIcon from "../../../assets/icons/submission-pages/Lock_fill.svg";
import EmptyIcon from "../../../assets/icons/submission-pages/Empty Icon 203873 1.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionTosModal from "./modal/SubmissionTosModal";
import Button from "../../../ui/Button";
import CreateSubmissionModal from "./modal/CreateSubmissionModal";
import { useSubmission } from "../../../redux/hooks";

import ArticleSelectModal from "./modal/ArticleSelectModal";
import Spinner from "../../../ui/Spinner";

export default function SubmissionEmpty({
  isSubmissionOpen,
  hasSubmission = false,
}: {
  isSubmissionOpen: boolean;
  hasSubmission?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get("contributionId") || "";

  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);
  const {
    submission,
    getSubmissionByContributionStudent,
    isLoading: loadingSubmission,
  } = useSubmission();

  if (loadingSubmission) return <Spinner />;

  return (
    <>
      <div className="mt-[100px] flex flex-col items-center justify-center gap-[18px]">
        <img src={isSubmissionOpen ? EmptyIcon : LockIcon} alt="Lock Icon" />

        {isSubmissionOpen ? (
          !hasSubmission ? (
            <p>
              You currently do not have any submission for this contribution
            </p>
          ) : (
            <p>You currently do not have any articles for this contribution</p>
          )
        ) : (
          <p>
            The contribution submission is closed, you cannot submit after the
            closure date
          </p>
        )}

        {!isSubmissionOpen ? (
          <Button onClick={() => navigate("/student")}>RETURN HOME</Button>
        ) : !hasSubmission ? (
          <Button
            onClick={() => {
              setIsAccepted(false);
              const modal = document.getElementById(
                "terms_and_conditions",
              ) as HTMLDialogElement | null;
              if (modal) {
                modal.showModal();
              } else {
                console.error("Modal not found");
              }
            }}
          >
            CREATE CONTRIBUTION
          </Button>
        ) : (
          <div>
            <Button type="light">Upload files</Button>
            <Button
              onClick={() => {
                setIsAccepted(false);
                const modal = document.getElementById(
                  "select articles",
                ) as HTMLDialogElement | null;
                if (modal) {
                  modal.showModal();
                } else {
                  console.error("Modal not found");
                }
              }}
            >
              ADD YOUR FILES
            </Button>
          </div>
        )}
      </div>

      <SubmissionTosModal
        isAccepted={isAccepted}
        setIsAccepted={setIsAccepted}
      />

      <CreateSubmissionModal />
      <ArticleSelectModal />
    </>
  );
}
