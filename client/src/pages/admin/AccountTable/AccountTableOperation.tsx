import { useSearchParams } from "react-router-dom";
import OrderArrowIcon from "../../../assets/icons/order-arrow-up.svg";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function AccountTableOperation() {
  const [searchParams, setSearchParams] = useSearchParams();
  const sortBy = searchParams.get("sortBy") || "";

  const [field, direction] = sortBy.split("-");

  function handleChange(value: string) {
    searchParams.set("sortBy", value);
    setSearchParams(searchParams);
  }

  return (
    <>
      <div className={ellipsis + " flex cursor-pointer select-none gap-1"}>
        Profile Image
      </div>

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

      <div
        className={ellipsis + " flex cursor-pointer select-none gap-1"}
        onClick={() =>
          sortBy === "owner-asc"
            ? handleChange("owner-desc")
            : handleChange("owner-asc")
        }
      >
        Email
        {field === "owner" && (
          <img
            src={OrderArrowIcon}
            className={direction === "desc" ? "rotate-180" : ""}
          />
        )}
      </div>

      <div className={ellipsis + " flex cursor-pointer select-none gap-1"}>
        Action
      </div>

      <div className={ellipsis + " flex cursor-pointer select-none gap-1"}>
        Action
      </div>
    </>
  );
}
