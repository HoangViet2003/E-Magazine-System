import { useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchIcon from "../../assets/icons/search.svg";
import FilterForm from "./FilterForm";

export default function SearchContribution() {
  const [keyword, setKeyword] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!keyword) return;
    navigate(`/`);
    setKeyword("");
  }

  return (
    <div className="relative ms-6 flex-grow ">
      <form
        onSubmit={handleSubmit}
        className="flex overflow-hidden rounded bg-searchBackground"
      >
        <input
          type="text"
          placeholder="Search contributions"
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          className="w-full bg-searchBackground px-4 py-2 placeholder:text-defaultTextColor"
        />
        <button className="px-4 hover:bg-slate-200">
          <img src={SearchIcon} alt="search" className="w-5" />
        </button>

        <button
          className="rounded border border-borderColor bg-white px-3 shadow-md hover:bg-slate-100"
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
    </div>
  );
}
