import { useNavigate } from "react-router-dom";
import FolderIcon from "../../assets/icons/folder.svg";

const fakeFolder = [
  {
    title: "2024 Contributions",
    isOpen: true,
    year: 2024,
  },
  {
    title: "2023 Contributionssdfsdfsdsfdfdf",
    isOpen: false,
    year: 2023,
  },
  {
    title: "2022 Contributions",
    isOpen: false,
    year: 2022,
  },
  {
    title: "2021 Contributions",
    isOpen: false,
    year: 2021,
  },
];

const ellipsis = "overflow-hidden text-ellipsis whitespace-nowrap";

export default function MyFacultyFolder() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4" style={{ color: "#272833" }}>
      <h3 className="font-semibold" style={{ color: "#6B6C7E" }}>
        Folders
      </h3>

      <div className="flex gap-[10px]">
        {fakeFolder.map((folder, index) => (
          <button
            key={index}
            className="w-60 rounded border border-borderColor p-4 hover:bg-slate-100"
            onClick={() => navigate(`${folder.year}`)}
          >
            <div className={"flex items-center gap-4"}>
              <img src={FolderIcon} />

              <span className={ellipsis + " font-semibold leading-tight"}>
                {folder.title}

                {folder.isOpen && (
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
