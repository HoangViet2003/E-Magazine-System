import { useEffect, useRef, useState } from "react";
import WordsIcon from "../../assets/icons/textEditor-icons/icon-document-text.svg";
import StarOutlineIcon from "../../assets/icons/textEditor-icons/star-outlined-svgrepo-com.svg";
// import StarFillIcon from "../../assets/icons/textEditor-icons/star-svgrepo-com.svg";

export default function TextEditorHeader() {
  const [docTitle, setDocTitle] = useState("Untitled Document");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        // handleSubmit(event);
        // Call function
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    (e.target as HTMLElement).blur();

    console.log("test");
  }

  return (
    <div className="editor-header flex items-center gap-3 p-3">
      <div className="w flex items-center gap-3">
        <img src={WordsIcon} alt="" />
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className="w-fit rounded border border-transparent bg-transparent px-1 text-lg font-medium text-[#6B6C7E] outline-offset-2 outline-[#004AD7] hover:border-[#6B6C7E]"
            value={docTitle}
            onChange={(e) => setDocTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(e);
              }
            }}
          />
        </form>
      </div>

      <img src={StarOutlineIcon} className="w-5" alt="" />

      <span className="text-[#6B6C7E]">Saving</span>
    </div>
  );
}
