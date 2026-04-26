import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";

export const usePageLoader = () => {
  const dispatch = useDispatch();

  const withPageLoader = async (callback) => {
    dispatch(showLoading());

    try {
      return await callback();
    } finally {
      dispatch(hideLoading());
    }
  };

  return { withPageLoader };
};
