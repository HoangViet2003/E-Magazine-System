import { useNavigate } from "react-router-dom";
import { useArticle } from "../../../redux/hooks/useArticle";
import DocsIcon from "../../../assets/icons/icon-document-text.svg";
import Spinner from "../../../ui/Spinner";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function SubmissionDocument() {
  const navigate = useNavigate();
  const { articles, isLoading } = useArticle();

  const docsfiles = articles.filter((article) => article.type === "word");

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Contributions
      </h3>

      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {docsfiles.map((file, index) => (
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
          ))}
        </div>
      )}
    </div>
  );
}
