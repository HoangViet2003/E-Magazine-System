import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";

import UlListIcon from "../assets/icons/list-ul.svg";
import InfoLineIcon from "../assets/icons/Icon-info-circle-line.svg";
import CheckIcon from "../assets/icons/check_ring_round_light.svg";
import UnsubmitIcon from "../assets/icons/Refresh_light.svg";
import { Submission } from "../redux/slices/SubmissionSlice";
import { useArticle, useSubmission } from "../redux/hooks";
import ArticleSelectModal from "../pages/my_faculty/submission/modal/ArticleSelectModal";
import UploadImage from "./UploadFile";
// import ShareIcon from "../assets/icons/Out.svg";

interface MainHeaderProps {
  children: ReactNode;
  isUnsubmittable?: boolean;
  submission?: Submission;
  isEditable?: boolean;
  isEditableOn?: boolean;
  setIsEditableOn?: (value: boolean) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  children,
  isUnsubmittable,
  isEditable,
  isEditableOn,
  setIsEditableOn,
}) => {
  const params = useParams();
  const role = localStorage.getItem("role");
  const {
    submission,
    toggleForSubmit,
    deleteSubmission,
    removeArticlesFromSubmission,
    toggleSelectSubmission,
    handleDownloadSubmission,
  } = useSubmission();
  const { selectedArticles } = useArticle();
  const { submissionId } = useParams();
  const [openFileUpload, setOpenFileUpload] = useState("");

  return (
    <>
      <div className="flex items-center justify-between border-b border-borderColor py-4">
        {children}

        <div className="relative hidden lg:inline-block">
          {params.submissionId && role === "student" && (
            <div className="flex">
              {isEditable && (
                <button
                  className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100"
                  onClick={() =>
                    setIsEditableOn && setIsEditableOn(!isEditableOn)
                  }
                >
                  <img src={CheckIcon} />
                  {isEditableOn ? "Cancel" : "Edit"}
                </button>
              )}

              {isEditableOn && (
                <>
                  <button
                    className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100"
                    onClick={() => {
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
                    Add
                  </button>
                  {submissionId && (
                    <button
                      className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100"
                      onClick={() =>
                        removeArticlesFromSubmission(
                          submissionId,
                          selectedArticles,
                        )
                      }
                    >
                      Delete
                    </button>
                  )}
                </>
              )}

              {isUnsubmittable && submissionId && (
                <button
                  className="flex items-center gap-3 px-2 py-1 text-[#CA3636] hover:bg-slate-100"
                  onClick={() => toggleForSubmit(submissionId)}
                >
                  <img src={UnsubmitIcon} />
                  {submission.unsubmitted ? "Submit" : "Unsubmit"}
                </button>
              )}

              <button
                className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100"
                onClick={async () => {
                  await deleteSubmission(submissionId);
                  window.location.reload();
                }}
              >
                Remove
              </button>
            </div>
          )}

          {params.submissionId && role === "marketing coordinator" && (
            <button
              className="p-2 hover:bg-slate-200"
              onClick={() => toggleSelectSubmission(submissionId)}
            >
              {submission.isSelectedForPublication
                ? "Unselect submission"
                : "Select submission"}
            </button>
          )}

          {!params.submissionId && (
            <>
              <button className="rounded-full p-3 hover:bg-slate-100">
                <img src={UlListIcon} />
              </button>
              <button className="rounded-full p-3 hover:bg-slate-100">
                <img src={InfoLineIcon} />
              </button>
            </>
          )}

          {params.submissionId && role === "marketing manager" && (
            <button
              className="p-2 hover:bg-slate-200"
              onClick={() => handleDownloadSubmission(submissionId)}
            >
              Download
            </button>
          )}
        </div>
      </div>
      <ArticleSelectModal />

      {openFileUpload === "word" && (
        <UploadImage
          isAddSubmission={true}
          type="word"
          setOpenFileUpload={setOpenFileUpload}
        />
      )}

      {openFileUpload === "image" && (
        <UploadImage
          isAddSubmission={true}
          type="image"
          setOpenFileUpload={setOpenFileUpload}
        />
      )}
    </>
  );
};

export default MainHeader;
