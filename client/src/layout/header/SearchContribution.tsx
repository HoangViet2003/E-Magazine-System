import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchIcon from "../../assets/icons/search.svg";

export default function SearchContribution() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!keyword) return;
    navigate(`/`);
    setKeyword("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-searchBackground flex flex-grow overflow-hidden rounded"
    >
      <input
        type="text"
        placeholder="Search contributions"
        onChange={(e) => {
          setKeyword(e.target.value);
        }}
        className="bg-searchBackground placeholder:text-defaultTextColor w-full px-4 py-2"
      />
      <button className="px-4">
        <img src={SearchIcon} alt="search" className="w-5" />
      </button>
    </form>
  );
}
