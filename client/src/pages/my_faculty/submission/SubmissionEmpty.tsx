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
import UploadImage from "../../../ui/UploadFile";
import Dropdowns from "../../../ui/Dropdowns";

export default function SubmissionEmpty({
  isSubmissionOpen,
  hasSubmission = false,
}: {
  isSubmissionOpen: boolean;
  hasSubmission?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const contributionId = searchParams.get("contributionId") || "";
  const [openFileUpload, setOpenFileUpload] = useState(false);

  const navigate = useNavigate();
  const [isAccepted, setIsAccepted] = useState(false);
  const { createSubmissionForStudent, isLoading: loadingSubmission } =
    useSubmission();

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
          <Button onClick={() => createSubmissionForStudent(contributionId)}>
            CREATE SUBMISSION
          </Button>
        ) : (
          <div className="flex">
            <Dropdowns>
              <Dropdowns.Dropdown>
                <Dropdowns.Toggle id="upload_submission">
                  <Button type="light">Upload files</Button>
                </Dropdowns.Toggle>

                <Dropdowns.List id="upload_submission">
                  <Dropdowns.Button onClick={() => setOpenFileUpload(true)}>
                    <span className="font-bold" style={{ color: "#004AD7" }}>
                      Documents
                    </span>
                  </Dropdowns.Button>
                  <Dropdowns.Button onClick={() => setOpenFileUpload(true)}>
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

      {/* <SubmissionTosModal
        isAccepted={isAccepted}
        setIsAccepted={setIsAccepted}
      /> */}

      <CreateSubmissionModal setOpenFileUpload={setOpenFileUpload} />
      <ArticleSelectModal />

      {openFileUpload && (
        <UploadImage
          isAddSubmission={true}
          type="word"
          setOpenFileUpload={setOpenFileUpload}
        />
      )}
    </>
  );
}
