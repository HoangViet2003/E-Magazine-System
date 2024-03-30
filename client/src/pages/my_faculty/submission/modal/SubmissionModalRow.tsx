import { Article } from "../../../../redux/slices/ArticleSlice";

import Table from "../../../../ui/Table";
import DocsIcon from "../../../../assets/icons/icon-document-text.svg";
import ImgIcon from "../../../../assets/icons/Img_box_fill.svg";

interface SubmissionModalRowProps {
  data: Article;
  selectedArticle: Article[];
  setSelectedArticle: (updater: (articles: Article[]) => Article[]) => void;
}

const SubmissionModalRow: React.FC<SubmissionModalRowProps> = ({
  data,
  selectedArticle,
  setSelectedArticle,
}) => {
  const { title, updatedAt, type } = data;

  const date = new Date(updatedAt);
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const isSelected = selectedArticle.some(
    (article) => article._id === data._id,
  );

  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  function handleRowClick() {
    setSelectedArticle((prevSelectedArticles) => {
      if (Array.isArray(prevSelectedArticles)) {
        const isDataAlreadySelected = prevSelectedArticles.some(
          (article) => article._id === data._id,
        );
        if (!isDataAlreadySelected) {
          return [...prevSelectedArticles, data];
        } else {
          return prevSelectedArticles.filter(
            (article) => article._id !== data._id,
          );
        }
      } else {
        return [data];
      }
    });
  }

  return (
    <div
      onClick={() => handleRowClick()}
      className={`${isSelected ? " bg-slate-300" : ""}`}
    >
      <Table.Row>
        <div className={"m-[auto] select-none"}>
          <img src={type === "word" ? DocsIcon : ImgIcon} />
        </div>
        <div
          className={commonCell + " font-semibold"}
          style={{ color: "#272833" }}
        >
          {title}
        </div>

        <div className={commonCell}>{formattedDate}</div>
      </Table.Row>
    </div>
  );
};

export default SubmissionModalRow;
