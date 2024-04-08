import LockIcon from "../../../assets/icons/submission-pages/Lock_fill.svg";
import EmptyIcon from "../../../assets/icons/submission-pages/Empty Icon 203873 1.svg";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import SubmissionTosModal from "./modal/SubmissionTosModal";
import Button from "../../../ui/Button";
import { useSubmission } from "../../../redux/hooks";

import ArticleSelectModal from "./modal/ArticleSelectModal";
import Spinner from "../../../ui/Spinner";
import UploadImage from "../../../ui/UploadFile";
import Dropdowns from "../../../ui/Dropdowns";

export default function SubmissionEmpty({
  isSubmissionOpen,
  hasSubmission = false,
}: {
  isSubmissionOpen: boolean;
  hasSubmission?: boolean;
}) {
  const [openFileUpload, setOpenFileUpload] = useState("");

  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);
  const { isLoading: loadingSubmission } = useSubmission();

  if (loadingSubmission) return <Spinner />;

  return (
    <>
      <div className="mt-[100px] flex flex-col items-center justify-center gap-[18px] text-center">
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
            CREATE SUBMISSION
          </Button>
        ) : (
          <div className="flex flex-wrap justify-center">
            <Dropdowns>
              <Dropdowns.Dropdown>
                <Dropdowns.Toggle id="upload_submission">
                  <span className="block rounded px-10 py-3 font-semibold text-[#004AD7]">
                    Upload files
                  </span>
                </Dropdowns.Toggle>

                <Dropdowns.List id="upload_submission">
                  <Dropdowns.Button onClick={() => setOpenFileUpload("word")}>
                    <span className="font-bold" style={{ color: "#004AD7" }}>
                      Documents
                    </span>
                  </Dropdowns.Button>
                  <Dropdowns.Button onClick={() => setOpenFileUpload("image")}>
                    <span className="font-bold" style={{ color: "#CA3636" }}>
                      Images
                    </span>
                  </Dropdowns.Button>
                </Dropdowns.List>
              </Dropdowns.Dropdown>
            </Dropdowns>

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
}
