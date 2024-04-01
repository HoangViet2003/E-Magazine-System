import { useNavigate } from "react-router-dom";
import Table from "../../../ui/Table";

import { URL } from "../../../utils/constant";
import { useArticle } from "../../../redux/hooks/useArticle";
import Spinner from "../../../ui/Spinner";
import Pagination from "../../../ui/Pagination";
import MyFacultyOperation from "../MyFacultyOperation";
import { useEffect, useState } from "react";
import SubmissionRow from "./SubmissionRow";
import { Article } from "../../../redux/slices/ArticleSlice";

interface SubmissionTableProps {
  isEditableOn: boolean;
}

const SubmissionTable: React.FC<SubmissionTableProps> = ({ isEditableOn }) => {
  const {
    selectedArticles,
    submissionArticles,
    isLoading: loadingArticle,
    totalLength,
    setSelectedArticlesToState,
  } = useArticle();
  const navigate = useNavigate();
  const [chooseArticle, setChooseArticle] = useState<Article[]>([]);

  function openNewDocument(id: string) {
    window.open(`${URL}/documents/${id}`, "_blank");
  }

  function openImageCollection(id: string) {
    navigate(`/images/${id}`);
  }

  useEffect(() => {
    setChooseArticle([]);
    setSelectedArticlesToState([]);
  }, [isEditableOn]);

  useEffect(() => {
    setSelectedArticlesToState(chooseArticle);
  }, [chooseArticle, setSelectedArticlesToState]);

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
                    if (!isEditableOn) {
                      if (data.type === "word") {
                        openNewDocument(data._id);
                      } else {
                        openImageCollection(data._id);
                      }
                    }
                  }}
                  key={data._id}
                >
                  <SubmissionRow
                    data={data}
                    isEditableOn={isEditableOn}
                    chooseArticle={chooseArticle}
                    setChooseArticle={setChooseArticle}
                  />
                </div>
              )}
            />
          </Table>
          <Pagination count={12} />
        </>
      )}
    </>
  );
};

export default SubmissionTable;
