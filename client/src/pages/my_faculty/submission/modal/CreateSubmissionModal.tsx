import { useParams, useSearchParams } from "react-router-dom";
import { useArticle, useSubmission } from "../../../../redux/hooks";
import { useEffect } from "react";
import Button from "../../../../ui/Button";

export default function CreateSubmissionModal({ setOpenFileUpload }) {
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get("contributionId") || "";

  const { createSubmissionForStudent } = useSubmission();
  const { getArticleByStudentId } = useArticle();

  useEffect(() => {
    getArticleByStudentId(1);
  }, []);

  return (
    <dialog id="create_submission" className="modal">
      <div className="modal-box flex flex-col gap-5 rounded-md p-14">
        <h3 className="text-center text-2xl font-semibold text-[#0F0F0F]">
          Create Your Submission
        </h3>

        <form
          method="dialog"
          className="modal-backdrop flex flex-col gap-[10px] p-[10px]"
        >
          <Button
            onClick={() => {
              if (contributionId) {
                createSubmissionForStudent(contributionId);
              }
            }}
          >
            CREATE A BLANK SUBMISSION
          </Button>
          <Button
            onClick={() => {
              const element = document.getElementById(
                "select articles",
              ) as HTMLDialogElement;
              if (element) {
                element.showModal();
              }
            }}
          >
            CHOOSE FROM YOUR FILES
          </Button>
          <Button
            onClick={() => {
              setOpenFileUpload(true);
            }}
          >
            UPLOAD FILE
          </Button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
