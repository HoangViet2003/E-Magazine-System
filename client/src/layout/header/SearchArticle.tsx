import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchIcon from "../../assets/icons/search.svg";
import HamburgerIcon from "../../assets/icons/hamburger-menu-svgrepo-com.svg";
import FilterForm from "./FilterForm";
import { useSidebarContext } from "../sidebar/SidebarContext";
import { useArticle } from "../../redux/hooks/useArticle";
import { useOutsideClick } from "../../redux/hooks/useOutsideClick";
import DocsIcon from "../../assets/icons/icon-document-text.svg";
import ImgIcon from "../../assets/icons/Img_box_fill.svg";
import ProfileImg from "../../assets/profile1.png";

export default function SearchArticle() {
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate();
  const { setOpenSidebar, openSidebar } = useSidebarContext();
  const { searchArticleQuery, handleSetKeyword, keyword, handleGetSuggestion, suggestionArticles,handleSetSearchMode } = useArticle();
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ref = useOutsideClick(() => setShowSuggestions(false), false) as React.RefObject<HTMLDivElement>;
  const commonCell =
    "overflow-hidden text-ellipsis whitespace-nowrap cursor-default select-none";

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!keyword) return;
    handleSetSearchMode(true);
    searchArticleQuery(keyword);

    // handleSetKeyword(keyword);
    navigate(`/myFaculty`); // Pass keyword as URL param
  }

  const handleChangeSearch = (e: any) => {
    handleSetKeyword(e.target.value);
    if (e.target.value.length > 0) {
      handleGetSuggestion(e.target.value)
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }

  return (
    <div className="relative flex-grow relative">
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden rounded bg-searchBackground"
      >
        <button
          className="px-2 hover:bg-slate-200 xl:hidden"
          onClick={() => setOpenSidebar(!openSidebar)}
        >
          <img src={HamburgerIcon} className="w-10" />
        </button>
        <input
          type="text"
          placeholder="Search articles"
          onChange={(e) => {
            handleChangeSearch(e);
          }}
          className="w-full bg-searchBackground px-4 py-2 outline-none placeholder:text-defaultTextColor"
        />



        <button className="px-4 hover:bg-slate-200">
          <img src={SearchIcon} alt="search" className="w-6 xl:w-5" />
        </button>

        <button
          className="hidden rounded border border-borderColor bg-white px-3 shadow-md hover:bg-slate-100 xl:block"
          onClick={() => setOpenFilter(true)}
        >
          <svg
            className="Q6yead QJZfhe "
            width="20"
            height="24"
            viewBox="0 0 24 24"
            focusable="false"
          >
            <path d="M3 17v2h6v-2H3zM3 5v2h10V5H3zm10 16v-2h8v-2h-8v-2h-2v6h2zM7 9v2H3v2h4v2h2V9H7zm14 4v-2H11v2h10zm-6-4h2V7h4V5h-4V3h-2v6z"></path>
          </svg>
        </button>
        <FilterForm openFilter={openFilter} setOpenFilter={setOpenFilter} />
      </form>
      {showSuggestions && <div className="absolute  z-10 overflow-x-auto top-12 h-[536px] " ref={ref}>
        <ul className=" bg-searchBackground w-full [&_li>*]:rounded-none ">
          {suggestionArticles?.map((article:any) => (
            <li className="flex flex-row justify-between items-center hover:bg-slate-200 p-3 gap-4">
              <img src={article?.type === "word" ? DocsIcon : ImgIcon} />
              <div
                className={commonCell + " font-semibold"}
                style={{ color: "#272833" }}
              >
                {article?.title}
              </div>
              <div className={commonCell + " flex items-center gap-2 ml-auto"}>
                <img
                  src={ProfileImg}
                  alt="profile-img"
                  className="h-8 w-8 rounded-full object-cover"
                />
                {article?.student?.name ?? "N/A"}
              </div>
              <div className={commonCell}>24/12/2023</div>
            </li>
          ))}


        </ul>
      </div>}


    </div>
  );
}
