import { useOutsideClick } from "../../redux/hooks/useOutsideClick";
import CloseIcon from "../../assets/icons/cross-svgrepo-com.svg";
import Select from "../../ui/Select";
import { useState } from "react";
import { useArticle } from "../../redux/hooks";

const labelClassName = "whitespace-nowrap font-bold text-gray-600 my-auto";
const inputClassName =
  "px-6 py-3 border border-gray-400 rounded text-gray-500 outline-blue-500";

interface FilterFormProps {
  openFilter: boolean;
  setOpenFilter: (isOpen: boolean) => void;
}

const FilterForm: React.FC<FilterFormProps> = ({
  openFilter,
  setOpenFilter,
}) => {
  const [type, setType] = useState("");
  const [keyword, setKeyword] = useState("");
  const { handleSetIsFilterMode, searchArticleQuery } = useArticle();
  const ref = useOutsideClick(
    () => setOpenFilter(false),
    false,
  ) as React.RefObject<HTMLDivElement>;

  function handleChangeType(e: any) {
    console.log(e);
  }

  if (!openFilter) return null;

  const handleFilterSubmit = () => {
    handleSetIsFilterMode(true);
    searchArticleQuery(keyword, type);
  };

  return (
    <div
      className="fixed top-20 z-10 w-[700px] border border-borderColor bg-white px-8 py-6 shadow-xl"
      ref={ref}
    >
      <button
        className="absolute right-3 top-3 rounded-full p-1 hover:bg-slate-100"
        onClick={() => setOpenFilter(false)}
      >
        <img src={CloseIcon} width={36} />
      </button>

      <div className="mt-6 grid grid-cols-[10rem,1fr] gap-5">
        <label className={labelClassName}>Type</label>
        <Select
          options={[
            { label: "Any", value: "" },
            { label: "Documents", value: "word" },
            { label: "Photos & images", value: "image" },
          ]}
          value={type}
          onChange={(e) => setType(e.target.value)}
        />

        <label className={labelClassName}>Includes the words</label>
        <input
          className={inputClassName}
          type="text"
          placeholder="Enter words found in the file"
          onChange={(e) => setKeyword(e.target.value)}
        />

        <label className={labelClassName}>Date modified</label>
        <Select
          options={[
            { label: "Any time", value: "anytime" },
            { label: "Today", value: "today" },
            { label: "Yesterday", value: "yesterday" },
            { label: "Last 7 days", value: "last7days" },
            { label: "Last 30 days", value: "last30days" },
          ]}
          value="type"
          onChange={handleChangeType}
        />
      </div>

      <button
        className="float-end me-4 mt-4 rounded bg-blue-500 px-6 py-4 text-white"
        onClick={() => handleFilterSubmit()}
      >
        Search
      </button>
      <button className="float-end mt-4 rounded bg-transparent px-6 py-4">
        Reset
      </button>
    </div>
  );
};

export default FilterForm;
