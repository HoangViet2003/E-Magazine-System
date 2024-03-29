import LockIcon from "../../../assets/icons/submission-pages/Lock_fill.svg";
import EmptyIcon from "../../../assets/icons/submission-pages/Empty Icon 203873 1.svg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SubmissionTosModal from "./modal/SubmissionTosModal";
import Button from "../../../ui/Button";
import CreateSubmissionModal from "./modal/CreateSubmissionModal";
import { useSubmission } from "../../../redux/hooks";

export default function SubmissionEmpty({
  isSubmissionOpen,
}: {
  isSubmissionOpen: boolean;
}) {
  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);
  const { submission, getSubmissionByStudent } = useSubmission();

  console.log(submission);

  useEffect(() => {}, []);

  return (
    <>
      <div className="mt-[100px] flex flex-col items-center justify-center gap-[18px]">
        <img src={isSubmissionOpen ? EmptyIcon : LockIcon} alt="Lock Icon" />

        {isSubmissionOpen ? (
          <p>You currently do not have any submission for this contribution</p>
        ) : (
          <p>
            The contribution submission is closed, you cannot submit after the
            closure date
          </p>
        )}

        {!isSubmissionOpen ? (
          <Button onClick={() => navigate("/student")}>RETURN HOME</Button>
        ) : (
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
        )}
      </div>

      <SubmissionTosModal
        isAccepted={isAccepted}
        setIsAccepted={setIsAccepted}
      />

      <CreateSubmissionModal />
    </>
  );
}
