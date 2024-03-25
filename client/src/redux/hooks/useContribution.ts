import { RootState } from "../index";
import { useSelector } from "react-redux";

export const useContribution = () => {
  const { isLoading, contributions } = useSelector((state: RootState) => state.contribution);

  return {
    isLoading,
    contributions,
  };
};
