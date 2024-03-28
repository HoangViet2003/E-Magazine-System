import { useEffect, useRef, useState } from "react";
import WordsIcon from "../../assets/icons/textEditor-icons/icon-document-text.svg";
import StarOutlineIcon from "../../assets/icons/textEditor-icons/star-outlined-svgrepo-com.svg";
// import StarFillIcon from "../../assets/icons/textEditor-icons/star-svgrepo-com.svg";
import { useArticle } from "../../redux/hooks";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SpinnerMini from "../../ui/SpinnerMini";

interface TextEditorHeaderProps {
  title: string;
  handleUpdateDocument: () => void;
  isLoading?: boolean;
}

export default function TextEditorHeader({ title, handleUpdateDocument, isLoading }: TextEditorHeaderProps) {
  const { updateArticle } = useArticle();
  console.log(isLoading)
  const { id } = useParams<{ id: string }>();

  const [docTitle, setDocTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    setDocTitle(title);
  }, [title]);


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
    const form = new FormData();
    form.append("title", docTitle);
    updateArticle(id ?? '', form);
    toast.success("Document Saved");
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

      <button className="btn btn-xs sm:btn-sm md:btn-md lg:btn-md bg-blue-500 text-white" onClick={handleUpdateDocument}>{isLoading ? <SpinnerMini /> : "Save"}</button>    </div>
  );
}
