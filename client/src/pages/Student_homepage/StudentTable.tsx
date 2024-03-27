import { useNavigate, useSearchParams } from "react-router-dom";
import { useArticle } from "../../redux/hooks/useArticle";

export default function StudentTable() {
  const [searchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "updatedAt-desc";
  const [field, direction] = sortBy.split("-");
  const modifier = direction === "asc" ? 1 : -1;

  const { articles, isLoading: loadingArticle } = useArticle();

  const navigate = useNavigate();

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
    navigate(`/myFaculty/images/${id}`);
  }

  // SORT
  const sortedData = filteredArticles.slice().sort((a, b) => {
    if ((a as any)[field] < (b as any)[field]) return -1 * modifier;
    if ((a as any)[field] > (b as any)[field]) return 1 * modifier;
    return 0;
  });

  if (loadingArticle) return <Spinner />;

  return (
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
  );
}
