import { useSearchParams } from "react-router-dom";

import OrderArrowIcon from "../../../assets/icons/order-arrow-up.svg";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function ContributionOperation() {
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
          sortBy === "name-asc"
            ? handleChange("name-desc")
            : handleChange("name-asc")
        }
      >
        Name
        {field === "name" && (
          <img
            src={OrderArrowIcon}
            className={direction === "desc" ? "rotate-180" : ""}
          />
        )}
      </div>
      {/* <div className={ellipsis + " cursor-default select-none"}>
        Latest action
      </div> */}
      <div
        className={ellipsis + " flex cursor-pointer select-none gap-1"}
        onClick={() =>
          sortBy === "owner-asc"
            ? handleChange("owner-desc")
            : handleChange("owner-asc")
        }
      >
        Owner
        {field === "owner" && (
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
