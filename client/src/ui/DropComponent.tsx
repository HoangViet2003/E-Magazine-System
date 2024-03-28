// import UploadImageIcon from "../assets/icons/uploadImg-icons/Upload icon.svg";
import UploadImageIcon from "../assets/icons/uploadImg-icons/uploadIcon";
import WordIcon from "../assets/icons/textEditor-icons/icon-document-text.svg";

export default function DropComponent({
  isDragActive,
  previews,
  setPreviews,
  type,
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-[20px]">
      <UploadImageIcon fill={type === "image" ? "#483EA8" : "#004AD7"} />

      <div>
        <h4 className="font-semibold">
          Drag & drop files or{" "}
          <span
            className={
              type === "image"
                ? "text-[#483EA8]"
                : "text-[#004AD7]" + " underline underline-offset-2"
            }
          >
            Browse
          </span>
        </h4>

        <p className="mt-2 text-center text-xs text-[#676767]">
          {isDragActive
            ? "Drop the files here ..."
            : type === "image"
              ? "Supported formats: JPEG, PNG"
              : "Supported formats: DOC, DOCX"}
        </p>
      </div>

      {previews.length > 0 && type === "image" && (
        <div>
          <div className="grid w-full grid-cols-4 gap-2">
            {previews.map((preview, index) =>
              index < 7 ? (
                <div key={index} className="h-22 w-20 overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="h-24 w-full object-cover"
                  />
                </div>
              ) : null,
            )}

            {previews.length > 7 && (
              <div className="flex w-full items-center justify-center border bg-slate-200">
                + {previews.length - 7}
              </div>
            )}
          </div>
        </div>
      )}

      {previews.length > 0 && type === "word" && (
        <div>
          <div className="grid w-full grid-cols-4 gap-2">
            {previews.map((preview, index) =>
              index < 7 ? (
                <div
                  key={index}
                  className="flex h-20 w-20 flex-col items-center overflow-hidden"
                >
                  <img
                    src={WordIcon}
                    alt={`Preview ${index}`}
                    className="h-16 object-cover"
                  />
                  <p className="w-20 overflow-hidden text-ellipsis whitespace-nowrap text-center text-sm">
                    {preview}
                  </p>
                </div>
              ) : null,
            )}

            {previews.length > 7 && (
              <div className="flex w-full items-center justify-center border bg-slate-200">
                + {previews.length - 7}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
