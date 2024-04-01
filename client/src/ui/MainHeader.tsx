import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";
import Comment from "./Comment";

import UlListIcon from "../assets/icons/list-ul.svg";
import InfoLineIcon from "../assets/icons/Icon-info-circle-line.svg";
import CheckIcon from "../assets/icons/check_ring_round_light.svg";
import CommentIcon from "../assets/icons/comment_duotone.svg";
import UnsubmitIcon from "../assets/icons/Refresh_light.svg";
import { Submission } from "../redux/slices/SubmissionSlice";
import { useArticle, useSubmission } from "../redux/hooks";
import Spinner from "./Spinner";
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
  const [openComment, setOpenComment] = useState(false);
  const {
    submission,
    isLoading,
    toggleForSubmit,
    deleteSubmission,
    addSelectedArticlesToSubmission,
    removeArticlesFromSubmission,
  } = useSubmission();
  const { selectedArticles } = useArticle();
  const { submissionId } = useParams();

  return (
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

            <button
              className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100"
              onClick={() => setOpenComment(!openComment)}
            >
              <img src={CommentIcon} />
              Comments
            </button>

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
              onClick={() => deleteSubmission(submissionId)}
            >
              Remove
            </button>

            {openComment && <Comment setOpenComment={setOpenComment} />}
          </div>
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
      </div>
    </div>
  );
};

export default MainHeader;
