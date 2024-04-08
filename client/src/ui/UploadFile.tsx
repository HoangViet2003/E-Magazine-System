import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useArticle } from "../redux/hooks";

import { useSidebarContext } from "../layout/sidebar/SidebarContext";
import DropComponent from "./DropComponent";
import SpinnerMini from "./SpinnerMini";
import { useParams } from "react-router";
import { useNavigate } from "react-router-dom";
import { URL } from "../utils/constant";

export default function UploadImage({
  type,
  isAddSubmission = false,
  setOpenFileUpload,
}: {
  type: string;
  isAddSubmission?: boolean;
  setOpenFileUpload?: (value: string) => void;
}) {
  const { submissionId } = useParams();
  const { setOpenImageUpload, setOpenDocUpload } = useSidebarContext();
  const navigate = useNavigate();

  const {
    uploadArticle,
    isLoading: loadingArticle,
    uploadArticleThenAddToSubmission,
  } = useArticle();

  const [previews, setPreviews] = useState<string[]>([]);
  const [title, setTitle] = useState("");

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      if (type === "image") {
        acceptedFiles.forEach((file) => {
          if (file.type === "image/jpeg" || file.type === "image/png") {
            const reader = new FileReader();

            reader.onload = () => {
              setPreviews((prevPreviews) => [
                ...prevPreviews,
                reader.result as string,
              ]);
            };

            reader.readAsDataURL(file);
          } else {
            console.error(
              "Invalid file type. Only JPEG and PNG images are accepted.",
            );
          }
        });
      } else {
        acceptedFiles.forEach((file) => {
          if (
            file.type === "application/msword" ||
            file.type ===
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          ) {
            setPreviews((prevPreviews) => [...prevPreviews, file.name]);
          } else {
            console.error(
              "Invalid file type. Only Doc and Docx files are accepted.",
            );
          }
        });
      }
    }
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: true,
    });

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (typeof acceptedFiles[0] === "undefined") return;

    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });
    formData.append("title", title);
    if (type === "image") formData.append("type", "image");
    else formData.append("type", "word");

    if (isAddSubmission) {
      if (submissionId)
        await uploadArticleThenAddToSubmission(formData, submissionId);
    } else {
      await uploadArticle(formData);
    }

    setOpenDocUpload(false);
    setOpenImageUpload(false);
    if (setOpenFileUpload) {
      setOpenFileUpload("");
    }
    const currentUrl = window.location.href.replace(URL, "");
    const newUrl = currentUrl.replace(/&?page=\d+/, "");
    navigate(newUrl);
  }

  return (
    <>
      <div className="fixed left-2/4 top-2/4 z-50 h-[620px] w-[540px] -translate-x-2/4 -translate-y-2/4 bg-white px-10 py-7 shadow-md">
        <form className="h-full" onSubmit={handleOnSubmit}>
          <div
            className={
              "grid h-full gap-[30px]" +
              (type === "image"
                ? " grid-rows-[auto_auto_1fr_auto]"
                : " grid-rows-[auto_1fr_auto]")
            }
          >
            <h1 className="text-center text-2xl font-semibold">Upload</h1>

            {type === "image" && (
              <input
                type="text"
                placeholder="Title"
                className="input w-full border border-borderColor "
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            )}

            <div
              className={
                "flex items-center justify-center rounded border border-dashed" +
                (type === "image"
                  ? " border-[#384EB74D] bg-[#F8F8FF]"
                  : " border-[#386fb74d] bg-[#b9cbfa4d]")
              }
            >
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <DropComponent
                    isDragActive={isDragActive}
                    previews={previews}
                    type={type}
                  />
                ) : (
                  <DropComponent
                    isDragActive={isDragActive}
                    previews={previews}
                    type={type}
                  />
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={
                typeof acceptedFiles[0] === "undefined" ||
                (type === "image" && title === "")
              }
              className={
                (type === "image" ? "bg-[#483EA8]" : "bg-[#004AD7]") +
                " rounded p-3 font-semibold text-white opacity-50 duration-300 hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-50"
              }
            >
              {loadingArticle ? (
                <SpinnerMini />
              ) : type === "image" ? (
                "CREATE NEW GALLERY"
              ) : (
                "UPLOAD FILE"
              )}
            </button>
          </div>
        </form>
      </div>

      <div
        className="fixed left-0 top-0 h-screen w-screen bg-black opacity-30"
        onClick={() => {
          setOpenImageUpload(false);
          setOpenDocUpload(false);
          setPreviews([]);
          if (setOpenFileUpload) {
            setOpenFileUpload("");
          }
        }}
      ></div>
    </>
  );
}
