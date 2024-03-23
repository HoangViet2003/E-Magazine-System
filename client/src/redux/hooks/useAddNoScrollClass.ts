import { useEffect } from "react";

function useAddNoScrollClass(condition: unknown) {
  useEffect(() => {
    const addNoScrollClass = () => {
      document.body.classList.add("no-scroll");
    };

    const removeNoScrollClass = () => {
      document.body.classList.remove("no-scroll");
    };

    if (condition) {
      addNoScrollClass();
    } else {
      removeNoScrollClass();
    }

    return () => {
      removeNoScrollClass();
    };
  }, [condition]);
}

export default useAddNoScrollClass;
