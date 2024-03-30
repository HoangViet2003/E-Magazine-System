import { useSearchParams } from "react-router-dom";
import OrderArrowIcon from "../../../../assets/icons/order-arrow-up.svg";
const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function SubmissionModalOperation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  const [field, direction] = sortBy.split("-");

  function handleChange(value: string) {
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  }

  return (
    <>
      <div></div>
      <div
        className={ellipsis + " flex cursor-pointer select-none gap-1"}
        onClick={() =>
          sortBy === "title-asc"
            ? handleChange("title-desc")
            : handleChange("title-asc")
        }
      >
        Name
        {field === "title" && (
          <img
            src={OrderArrowIcon}
            className={direction === "desc" ? "rotate-180" : ""}
          />
        )}
      </div>

      <div
        className={ellipsis + " flex cursor-pointer select-none gap-1"}
        onClick={() =>
          sortBy === "updatedAt-asc"
            ? handleChange("updatedAt-desc")
            : handleChange("updatedAt-asc")
        }
      >
        Modified Date
        {field === "updatedAt" && (
          <img
            src={OrderArrowIcon}
            className={direction === "desc" ? "rotate-180" : ""}
          />
        )}
      </div>
    </>
  );
}
