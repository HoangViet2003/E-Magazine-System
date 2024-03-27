import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Table from "../../../ui/Table";

// import MyFacultyOperation from "./MyFacultyOperation";

// import ProfileImg from "../../assets/profile1.png";
import { URL } from "../../../utils/constant";
import { useArticle } from "../../../redux/hooks/useArticle";
import Spinner from "../../../ui/Spinner";
import { useEffect, useState } from "react";
import Pagination from "../../../ui/Pagination";
import MyFacultyOperation from "../MyFacultyOperation";
import FacultyRow from "../FacultyRow";
import { Article } from "../../../redux/slices/ArticleSlice";

export default function MyFacultyTable({
  contributeId,
}: {
  contributeId?: number;
}) {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;
  const { submissionId } = useParams();
  const { getArticlesBySubmissionId, isLoading: loadingArticle } = useArticle();
  const [articles, setArticles] = useState<Article>([]);
  const [articleCount, setArticleCount] = useState(0);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchArticles = async () => {
      if (submissionId) {
        const fetchedArticles = await getArticlesBySubmissionId(
          submissionId,
          page,
        );
        console.log(fetchedArticles);

        setArticles(fetchedArticles?.articles || []);
        setArticleCount(fetchedArticles?.totalLength || 0);
      }
    };

    fetchArticles();
  }, [page]);

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");

    // getArticlesBySubmissionId(submissionId, page);
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
          <Pagination count={articleCount} />
        </>
      ) : (
        <div>No data</div>
      )}
    </>
  );
}
