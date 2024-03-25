import { useNavigate } from "react-router-dom";
import FolderIcon from "../../assets/icons/folder.svg";
import { useContribution } from "../../redux/hooks/useContribution";

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function MyFacultyContribution() {
  const navigate = useNavigate();
  const { contributions } = useContribution();

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Contributions
      </h3>

      <div className="2 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {contributions.map((contribution, index) => (
          <button
            key={index}
            className="rounded border border-borderColor p-4 hover:bg-slate-100"
            onClick={() => navigate(`contributions/${contribution._id}`)}
          >
            <div className={"flex items-center gap-4"}>
              <img src={FolderIcon} />

              <span className={ellipsis + " font-semibold leading-tight"}>
                {contribution.title}

                {contribution.isOpen && (
                  <div
                    className={ellipsis + " text-left text-[10px] font-normal"}
                    style={{ color: "#CA3636" }}
                  >
                    30 days until closure date
                  </div>
                )}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
