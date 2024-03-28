import { useNavigate, useSearchParams } from "react-router-dom";
import Table from "../../ui/Table";

import FacultyRow from "./FacultyRow";
import MyFacultyOperation from "./MyFacultyOperation";

// import ProfileImg from "../../assets/profile1.png";
import { URL } from "../../utils/constant";
import { useArticle } from "../../redux/hooks/useArticle";
import Spinner from "../../ui/Spinner";
import { useEffect } from "react";
import Pagination from "../../ui/Pagination";

export default function MyFacultyTable({
  contributeId,
}: {
  contributeId?: number;
}) {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  const {
    articles,
    isLoading: loadingArticle,
    totalLength: articleLength,
    getArticleByStudentId,
    fetchAllArticle,
  } = useArticle();

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");

    if (role === "student") {
      getArticleByStudentId(page);
    } else {
      fetchAllArticle(page);
    }
  }, [searchParams]);

  // FILTER
  let filteredArticles = articles;

  if (contributeId) {
    filteredArticles = articles.filter(
      (article) => new Date(article.createdAt).getFullYear() === contributeId,
    );
  }

  // SORT
  const sortedData = filteredArticles.slice().sort((a, b) => {
    if ((a as any)[field] < (b as any)[field]) return -1 * modifier;
    if ((a as any)[field] > (b as any)[field]) return 1 * modifier;
    return 0;
  });

  function openNewDocument(id: string) {
    window.open(`${URL}/documents/${id}`, "_blank");
  }

  function openImageCollection(id: string) {
    navigate(`/images/${id}`);
  }

  if (loadingArticle) return <Spinner />;

  return (
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

      <Pagination count={articleLength} />
    </>
  );
}
