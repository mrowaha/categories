import React from "react";

function useOutsideAlerter(ref : React.MutableRefObject<any>, callback : () => void) {
  React.useEffect(() => {
    function handleClickOutside(event : MouseEvent) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideAlerter;