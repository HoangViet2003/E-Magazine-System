import SubmissionDocument from "./SubmissionDocument";
import SubmissionImage from "./SubmissionImage";

export default function SubmissionFile() {
  return (
    <div className="my-5 flex flex-col gap-5 xl:ps-6">
      <SubmissionDocument />

      <SubmissionImage />
    </div>
  );
}
