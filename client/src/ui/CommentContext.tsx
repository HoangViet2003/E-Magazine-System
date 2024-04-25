import { createContext, useState, useContext, ReactNode } from "react";

const CommentContext = createContext({
  openComment: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setOpenComment: (value: boolean) => {},
});

export const useCommentContext = () => useContext(CommentContext);

export const CommentProvider = ({ children }: { children: ReactNode }) => {
  const [openComment, setOpenComment] = useState(false);
  return (
    <CommentContext.Provider
      value={{
        openComment,
        setOpenComment,
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
