import { useEffect, useState } from "react";
import { useArticle, useSubmission } from "../../../../redux/hooks";

import SubmissionModalOperation from "./SubmissionModalOperation";
import SubmissionModalRow from "./SubmissionModalRow";

import Button from "../../../../ui/Button";
import Table from "../../../../ui/Table";
import Spinner from "../../../../ui/Spinner";
import { useParams, useSearchParams } from "react-router-dom";
import { Article } from "../../../../redux/slices/ArticleSlice";

export default function ArticleSelectModal() {
  const { submissionId } = useParams();
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const [searchInput, setSearchInput] = useState("");
  const [filterArticles, setFilterArticle] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article[]>([]);

  const { articles, getUnselectedArticleStudent, isLoading } = useArticle();
  const { addSelectedArticlesToSubmission } = useSubmission();

  useEffect(() => {
    if (submissionId) getUnselectedArticleStudent(submissionId);
  }, []);

  // FILTER
  useEffect(() => {
    setFilterArticle(
      articles.filter((article) =>
        article.title.toLowerCase().includes(searchInput.toLowerCase()),
      ),
    );
  }, [articles, searchInput]);

  // SORT
  const sortedData = filterArticles.slice().sort((a, b) => {
    if ((a as any)[field] < (b as any)[field]) return -1 * modifier;
    if ((a as any)[field] > (b as any)[field]) return 1 * modifier;
    return 0;
  });

  return (
    <dialog id="select articles" className="modal ">
      <div className="modal-box flex max-w-[1100px] flex-col items-center gap-5 rounded-md">
        <h3 className="text-2xl font-semibold">Select Your Articles</h3>
        <label className="input input-bordered flex h-10 w-72 items-center gap-2 self-end bg-[#E7E7ED]">
          <input
            type="text"
            className="grow placeholder-[#272833]"
            placeholder="Search your articles"
            onChange={(e) => setSearchInput(e.target.value)}
            value={searchInput}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 "
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>

        {isLoading ? (
          <Spinner />
        ) : (
          <div className="max-h-74 w-full overflow-scroll overflow-y-auto overflow-x-hidden">
            <Table columns="0.2fr 3fr 0.5fr">
              <Table.Header>
                <SubmissionModalOperation />
              </Table.Header>

              <Table.Body
                data={sortedData}
                render={(data) => (
                  <div key={data._id}>
                    <SubmissionModalRow
                      data={data}
                      selectedArticle={selectedArticle}
                      setSelectedArticle={setSelectedArticle}
                    />
                  </div>
                )}
              />
            </Table>
          </div>
        )}

        <form method="dialog" className="self-end">
          <Button type="light">Cancel</Button>
          <Button
            className="px-10"
            disabled={!(selectedArticle && selectedArticle.length > 0)}
            onClick={() => {
              if (submissionId)
                addSelectedArticlesToSubmission(submissionId, selectedArticle);
            }}
          >
            Select
          </Button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
