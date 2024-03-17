import { RootState } from "./../index";
import { useSelector } from "react-redux";

export const useFolder = () => {
  const { loading, folders } = useSelector((state: RootState) => state.folder);

  return {
    loading,
    folders,
  };
};
