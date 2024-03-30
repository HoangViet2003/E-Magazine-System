import { useSearchParams } from "react-router-dom";
import { useSidebarContext } from "../../../../layout/sidebar/SidebarContext";
import { useSubmission } from "../../../../redux/hooks";
import Button from "../../../../ui/Button";

export default function CreateSubmissionModal() {
  const { setOpenDocUpload } = useSidebarContext();
  const { createSubmissionForStudent } = useSubmission();
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get("contributionId") || "";

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
              setOpenDocUpload(true);
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
