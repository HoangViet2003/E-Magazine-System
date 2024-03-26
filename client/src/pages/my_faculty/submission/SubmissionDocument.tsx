import DocsIcon from "../../../assets/icons/icon-document-text.svg";
import { Article } from "../../../redux/slices/ArticleSlice";
import { URL } from "../../../utils/constant";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

// const ContributionRow: React.FC<{ data: Submission }> = ({ data }) => {

const SubmissionDocument: React.FC<{ articles: Article[] }> = ({
  articles,
}) => {
  const docsfiles = articles.filter((article) => article.type === "word");

  function openNewDocument(id: string) {
    window.open(`${URL}/documents/${id}`, "_blank");
  }

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Documents
      </h3>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {docsfiles && docsfiles.length > 0 ? (
          docsfiles.map((file, index) => (
            <button
              key={index}
              className="rounded border border-borderColor p-4 hover:bg-slate-100"
              onDoubleClick={() => openNewDocument(file._id)}
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
};

export default SubmissionDocument;
