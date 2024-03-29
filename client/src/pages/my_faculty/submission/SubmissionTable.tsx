import { useNavigate, useSearchParams } from "react-router-dom";
import Table from "../../../ui/Table";

import { URL } from "../../../utils/constant";
import { useArticle } from "../../../redux/hooks/useArticle";
import Spinner from "../../../ui/Spinner";
import { useEffect, useState } from "react";
import Pagination from "../../../ui/Pagination";
import MyFacultyOperation from "../MyFacultyOperation";
import FacultyRow from "../FacultyRow";
import { useSubmission } from "../../../redux/hooks";

export default function MyFacultyTable({
  contributeId,
}: {
  contributeId?: number;
}) {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const {
    articles,
    getArticlesBySubmissionId,
    isLoading: loadingArticle,
    totalLength,
  } = useArticle();
  const { submission } = useSubmission();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    getArticlesBySubmissionId(page);
  }, [page, submission]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    setPage(page);
  }, [searchParams]);

  // FILTER
  let filteredArticles = articles;

  if (contributeId) {
    filteredArticles = articles.filter(
      (article) => new Date(article.createdAt).getFullYear() === contributeId,
    );
  }

  function openNewDocument(id: string) {
    window.open(`${URL}/documents/${id}`, "_blank");
  }

  function openImageCollection(id: string) {
    navigate(`/images/${id}`);
  }

  // SORT
  const sortedData = filteredArticles.slice().sort((a, b) => {
    if ((a as any)[field] < (b as any)[field]) return -1 * modifier;
    if ((a as any)[field] > (b as any)[field]) return 1 * modifier;
    return 0;
  });

  if (loadingArticle) return <Spinner />;

  return (
    <>
      {loadingArticle ? (
        <Spinner />
      ) : articles && articles.length > 0 ? (
        <>
          <Table columns="0.3fr 2.4fr 1.5fr 1fr 1fr">
            <Table.Header>
              <MyFacultyOperation />
            </Table.Header>

            <Table.Body
              data={sortedData}
              render={(data) => (
                <div
                  onDoubleClick={() => {
                    if (data.type === "word") {
                      openNewDocument(data._id);
                    } else {
                      openImageCollection(data._id);
                    }
                  }}
                  key={data._id}
                >
                  <FacultyRow data={data} />
                </div>
              )}
            />
          </Table>
          <Pagination count={totalLength} />
        </>
      ) : (
        <div>No data</div>
      )}
    </>
  );
}
