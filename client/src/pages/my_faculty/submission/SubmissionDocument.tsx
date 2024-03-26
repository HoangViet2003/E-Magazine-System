import { useNavigate } from "react-router-dom";
import DocsIcon from "../../../assets/icons/icon-document-text.svg";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function SubmissionDocument({ articles }) {
  const navigate = useNavigate();
  const docsfiles = articles.filter((article) => article.type === "word");

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Documents
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {docsfiles.length > 0 ? (
          docsfiles.map((file, index) => (
            <button
              key={index}
              className="rounded border border-borderColor p-4 hover:bg-slate-100"
              onClick={() => navigate(`contributions/${file._id}`)}
            >
              <div className={"flex items-center gap-4"}>
                <img src={DocsIcon} />

                <span className={ellipsis + " font-semibold leading-tight"}>
                  {file.title}
                </span>
              </div>
            </button>
          ))
        ) : (
          <div>No document found.</div>
        )}
      </div>
    </div>
  );
}
