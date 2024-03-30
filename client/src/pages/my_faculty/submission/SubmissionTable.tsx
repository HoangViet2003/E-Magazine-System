import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Table from "../../../ui/Table";

import { URL } from "../../../utils/constant";
import { useArticle } from "../../../redux/hooks/useArticle";
import Spinner from "../../../ui/Spinner";
import { useEffect, useState } from "react";
import Pagination from "../../../ui/Pagination";
import MyFacultyOperation from "../MyFacultyOperation";
import FacultyRow from "../FacultyRow";

export default function SubmissionTable() {
  const {
    submissionArticles,
    getArticlesBySubmissionId,
    resetSubmissionArticlesState,
    isLoading: loadingArticle,
    totalLength,
  } = useArticle();
  const navigate = useNavigate();
  const { submissionId } = useParams();
  const [searchParams] = useSearchParams();

  // useEffect(() => {
  //   if (submissionId) getArticlesBySubmissionId(submissionId, page);

  //   return () => resetSubmissionArticlesState();
  // }, [page, submissionId]);

  // useEffect(() => {
  //   const page = parseInt(searchParams.get("page") || "1");
  //   setPage(page);
  // }, [searchParams]);

  function openNewDocument(id: string) {
    window.open(`${URL}/documents/${id}`, "_blank");
  }

  function openImageCollection(id: string) {
    navigate(`/images/${id}`);
  }

  return (
    <>
      {loadingArticle ? (
        <Spinner />
      ) : (
        <>
          <Table columns="0.3fr 2.4fr 1.5fr 1fr 1fr">
            <Table.Header>
              <MyFacultyOperation />
            </Table.Header>

            <Table.Body
              data={submissionArticles}
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
      )}
    </>
  );
}
