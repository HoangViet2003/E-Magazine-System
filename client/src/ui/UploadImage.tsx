import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useArticle } from "../redux/hooks";

import { useSidebarContext } from "../layout/sidebar/SidebarContext";
import DropComponent from "./DropComponent";

export default function UploadImage() {
  const { openUploadImage, setOpenUploadImage } = useSidebarContext();
  const [previews, setPreviews] = useState<string[]>([]);
  const { uploadArticleImage } = useArticle();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
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
    }
  }, []);

  const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      multiple: true,
    });

  async function handleOnSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    console.log(acceptedFiles);

    if (typeof acceptedFiles[0] === "undefined") return;

    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("type", "image");
    formData.append("title", "test");

    uploadArticleImage(formData);
    setOpenUploadImage(false);
  }

  return (
    openUploadImage && (
      <>
        <div className="fixed left-2/4 top-2/4 z-10 h-[620px] w-[540px] -translate-x-2/4 -translate-y-2/4 bg-white px-10 py-7 shadow-md">
          <form className="h-full" onSubmit={handleOnSubmit}>
            <div className="grid h-full grid-rows-[auto_1fr_auto] gap-[30px] ">
              <h1 className="text-center text-2xl font-semibold">Upload</h1>

              <div className="flex items-center justify-center rounded border border-dashed border-[#384EB74D] bg-[#F8F8FF]">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <DropComponent
                      isDragActive={isDragActive}
                      previews={previews}
                      setPreviews={setPreviews}
                    />
                  ) : (
                    <DropComponent
                      isDragActive={isDragActive}
                      previews={previews}
                      setPreviews={setPreviews}
                    />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-[#483EA8] p-3 font-semibold text-white opacity-50 duration-300 hover:opacity-100"
              >
                Upload File
              </button>
            </div>
          </form>
        </div>

        <div
          className="fixed left-0 top-0 h-screen w-screen bg-black opacity-30"
          onClick={() => {
            setOpenUploadImage(false);
            setPreviews([]);
          }}
        ></div>
      </>
    )
  );
}
