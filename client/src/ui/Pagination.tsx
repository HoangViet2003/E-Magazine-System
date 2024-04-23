import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constant";
import AngleIcon from "../assets/icons/angle_fill";
import { useState } from "react";

export default function Pagination({ count }: { count: number }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fillColorPrev, setFillColorPrev] = useState("#6B6C7E");
  const [fillColorNext, setFillColorNext] = useState("#6B6C7E");

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const pageCount = Math.ceil(count / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    searchParams.set("page", `${next}`);
    setSearchParams(searchParams);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    searchParams.set("page", `${prev}`);
    setSearchParams(searchParams);
  }

  if (!count || count === 0 || pageCount <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      <p>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count}</span> results
      </p>

      <div className="flex gap-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex items-center rounded p-2 font-medium text-[#6B6C7E] duration-300 hover:bg-[#004AD7] hover:text-white disabled:cursor-not-allowed disabled:hover:bg-transparent  disabled:hover:text-[#6B6C7E]"
          onMouseEnter={() => setFillColorPrev("#FFF")}
          onMouseLeave={() => setFillColorPrev("#6B6C7E")}
        >
          <AngleIcon fill={fillColorPrev} className="w-8 duration-300" />
          <span>Previous</span>
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === pageCount}
          className="flex items-center rounded p-2 font-medium text-[#6B6C7E] duration-300 hover:bg-[#004AD7] hover:text-white disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#6B6C7E]"
          onMouseEnter={() => setFillColorNext("#FFF")}
          onMouseLeave={() => setFillColorNext("#6B6C7E")}
        >
          <span>Next</span>
          <AngleIcon
            fill={fillColorNext}
            className="w-8 rotate-180 duration-300"
          />
        </button>
      </div>
    </div>
  );
}
