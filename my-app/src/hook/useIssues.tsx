import { useEffect, useState } from "react";
import { getIssues } from "./../service";
import { useDispatch, useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { RootState } from '../type';
import { toast } from "react-toastify";

const useIssues = (page: number): { isLoading: boolean; } => {
  const [isLoading, setIsLoading] = useState(false);
  const [cookies] = useCookies(['token', 'owner', 'repo']);
  const dispatch = useDispatch();
  const filterState = useSelector((state: RootState) => state.filterStateReducer);
  const filterOrder = useSelector((state: RootState) => state.filterOrderReducer);
  const preSearchKey = useSelector((state: RootState) => state.filterKeywordReducer.keyword);

  useEffect(() => {
    if (page == 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsLoading(true);
    }
    const fetchIssues = async () => {
      try {
        await getIssues(dispatch, filterState, filterOrder, preSearchKey, cookies['token'], cookies['owner'], cookies['repo'], page);
      } catch (err) {
        toast.error('Server error');
      }
      setIsLoading(false);
    };

    fetchIssues();
  }, [page, filterState, filterOrder, preSearchKey]);

  return { isLoading };
};

export default useIssues;