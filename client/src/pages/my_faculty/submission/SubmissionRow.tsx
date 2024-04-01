import { Article } from "../../../redux/slices/ArticleSlice";

import Table from "../../../ui/Table";
import DocsIcon from "../../../assets/icons/icon-document-text.svg";
import ImgIcon from "../../../assets/icons/Img_box_fill.svg";
import ProfileImg from "../../../assets/profile1.png";
import { useArticle } from "../../../redux/hooks";
import { useState } from "react";

interface SubmissionRowProps {
  data: Article;
  chooseArticle: Article[];
  setChooseArticle: (updater: (articles: Article[]) => Article[]) => void;
  isEditableOn: boolean;
}

const SubmissionRow: React.FC<SubmissionRowProps> = ({
  data,
  chooseArticle,
  setChooseArticle,
  isEditableOn,
}) => {
  const { selectedArticles, setSelectedArticlesToState } = useArticle();
  const { title, updatedAt, student, type } = data;
  const action = "test action";

  const date = updatedAt ? new Date(updatedAt) : new Date();
  const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

  const isSelected = chooseArticle.some((article) => article._id === data._id);

  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  function handleRowClick() {
    setChooseArticle((prevSelectedArticles) => {
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
      onClick={() => isEditableOn && handleRowClick()}
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
        <div className={commonCell}>{action}</div>
        <div className={commonCell + " flex items-center gap-2"}>
          <img
            src={ProfileImg}
            alt="profile-img"
            className="h-8 w-8 rounded-full object-cover"
          />
          {student?.name ?? "N/A"}
        </div>

        <div className={commonCell}>{formattedDate}</div>
      </Table.Row>
    </div>
  );
};

export default SubmissionRow;
