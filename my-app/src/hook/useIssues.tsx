import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { RootState } from "../type";
import { getIssues } from "./../service";

const useIssues = (): { isLoading: boolean; fetchMoreIssues: () => void } => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(["token", "owner", "repo"]);
  const [page, setPage] = useState<number>(1);
  const dispatch = useDispatch();
  const filterState = useSelector((state: RootState) => state.filterStateReducer);
  const filterOrder = useSelector((state: RootState) => state.filterOrderReducer);
  const preSearchKey = useSelector((state: RootState) => state.filterKeywordReducer.keyword);

  const fetchIssues = async (pageNum) => {
    try {
      await getIssues(dispatch, filterState, filterOrder, preSearchKey, cookies["token"], cookies["owner"], cookies["repo"], pageNum);
    } catch (err) {
      toast.error("Server error");
    }

    setIsLoading(false);
  };

  useEffect(() => {
    window.scrollTo({
      top: 0, behavior: "smooth"
    });
    setIsLoading(true);
    fetchIssues(1);
    setPage(1);
  }, [filterState, filterOrder, preSearchKey]);

  const fetchMoreIssues = () => {
    fetchIssues(page + 1);
    setPage(page + 1);
  };

  return {
    isLoading,
    fetchMoreIssues
  };
};

export default useIssues;