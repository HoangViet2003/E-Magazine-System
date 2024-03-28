import UploadImageIcon from "../assets/icons/uploadImg-icons/Upload icon.svg";

export default function DropComponent({ isDragActive, previews, setPreviews }) {
  return (
    <div className="flex h-96 w-96 flex-col items-center justify-center gap-[20px]">
      <img
        src={UploadImageIcon}
        className="h-[60px] w-[69px]"
        alt="Upload Image"
      />

      <div>
        <h4 className="font-semibold">
          Drag & drop files or{" "}
          <span className="text-[#483EA8] underline underline-offset-2">
            Browse
          </span>
        </h4>

        <p className="mt-2 text-center text-xs text-[#676767]">
          {isDragActive
            ? "Drop the files here ..."
            : "Supported formats: JPEG, PNG"}
        </p>
      </div>

      {previews.length > 0 && (
        <div>
          <div className="grid grid-cols-4 w-full gap-2">
            {previews.map((preview, index) =>
              index < 7 ? (
                <div key={index} className="w-23 h-24 overflow-hidden">
                  <img
                    src={preview}
                    alt={`Preview ${index}`}
                    className="w-full h-24 object-cover"
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
    </div>
  );
}
