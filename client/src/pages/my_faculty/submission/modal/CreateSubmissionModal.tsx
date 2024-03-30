import Button from "../../../../ui/Button";

export default function CreateSubmissionModal() {
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
          <Button>CREATE A BLANK SUBMISSION</Button>
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
          <Button>UPLOAD FILE</Button>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
