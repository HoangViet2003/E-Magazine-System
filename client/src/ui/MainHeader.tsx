import { ReactNode, useState } from "react";
import { useParams } from "react-router-dom";

import UlListIcon from "../assets/icons/list-ul.svg";
import InfoLineIcon from "../assets/icons/Icon-info-circle-line.svg";
import { useArticle, useSubmission } from "../redux/hooks";
import ArticleSelectModal from "../pages/my_faculty/submission/modal/ArticleSelectModal";
import UploadImage from "./UploadFile";
import Dropdowns from "./Dropdowns";
import useWindowWidth from "../redux/hooks/useWindowWidth";
import OptionIcon from "../assets/icons/options-svgrepo-com.svg";
// import ShareIcon from "../assets/icons/Out.svg";

interface MainHeaderProps {
  children: ReactNode;
  isEditable?: boolean;
  isEditableOn?: boolean;
  setIsEditableOn?: (value: boolean) => void;
}

const MainHeader: React.FC<MainHeaderProps> = ({
  children,
  isEditable,
  isEditableOn,
  setIsEditableOn,
}) => {
  const params = useParams();
  const role = localStorage.getItem("role");
  const {
    submission,
    removeArticlesFromSubmission,
    toggleSelectSubmission,
    downloadSubmission,
  } = useSubmission();
  const { selectedArticles } = useArticle();
  const { submissionId } = useParams();
  const [openFileUpload, setOpenFileUpload] = useState("");
  const windowWidth = useWindowWidth();

  return (
    <>
      <div className="flex items-center justify-between border-b border-borderColor py-4">
        {children}

        <div className="relative inline-block">
          {params.submissionId && role === "student" && (
            <div className="flex flex-row-reverse items-center gap-2">
              {isEditable && (
                <label className="label cursor-pointer gap-5">
                  {!isEditableOn && (
                    <span className="label-text text-base">Edit</span>
                  )}
                  <input
                    type="checkbox"
                    className={` ${isEditableOn ? "toggle border-[#004AD7] bg-[#004AD7] hover:bg-blue-700 " : "toggle border-[#949699] bg-[#949699] "}`}
                    checked={isEditableOn}
                    onChange={() =>
                      setIsEditableOn && setIsEditableOn(!isEditableOn)
                    }
                  />
                </label>
              )}

              {isEditableOn &&
                (windowWidth > 576 ? (
                  <>
                    {submissionId && (
                      <button
                        className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100 disabled:cursor-not-allowed"
                        onClick={async () => {
                          if (selectedArticles && selectedArticles.length > 0) {
                            await removeArticlesFromSubmission(
                              submissionId,
                              selectedArticles,
                            );
                            window.location.reload();
                          }
                        }}
                        disabled={
                          !selectedArticles || selectedArticles.length === 0
                        }
                      >
                        Delete
                      </button>
                    )}

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

                    <Dropdowns>
                      <Dropdowns.Dropdown>
                        <Dropdowns.Toggle id="upload_submission">
                          <span className="flex items-center gap-3 px-2 py-1 hover:bg-slate-100">
                            Upload files
                          </span>
                        </Dropdowns.Toggle>

                        <Dropdowns.List id="upload_submission">
                          <Dropdowns.Button
                            onClick={() => setOpenFileUpload("word")}
                          >
                            <span
                              className="font-bold"
                              style={{ color: "#004AD7" }}
                            >
                              Documents
                            </span>
                          </Dropdowns.Button>
                          <Dropdowns.Button
                            onClick={() => setOpenFileUpload("image")}
                          >
                            <span
                              className="font-bold"
                              style={{ color: "#CA3636" }}
                            >
                              Images
                            </span>
                          </Dropdowns.Button>
                        </Dropdowns.List>
                      </Dropdowns.Dropdown>
                    </Dropdowns>
                  </>
                ) : (
                  <Dropdowns>
                    <Dropdowns.Dropdown>
                      <Dropdowns.Toggle
                        id="update_article"
                        startPosition="right"
                      >
                        <div className="rounded hover:bg-slate-200">
                          <img src={OptionIcon} className="w-8" />
                        </div>
                      </Dropdowns.Toggle>

                      <Dropdowns.List id="update_article" startPosition="right">
                        <Dropdowns.Button
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
                          <span>Add</span>
                        </Dropdowns.Button>
                        <Dropdowns.Button
                          onClick={async () => {
                            if (
                              selectedArticles &&
                              selectedArticles.length > 0
                            ) {
                              await removeArticlesFromSubmission(
                                submissionId,
                                selectedArticles,
                              );
                              window.location.reload();
                            }
                          }}
                        >
                          <span>Delete</span>
                        </Dropdowns.Button>
                      </Dropdowns.List>
                    </Dropdowns.Dropdown>
                  </Dropdowns>
                ))}
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
              onClick={() => downloadSubmission(submissionId)}
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
