import { Dispatch } from "redux";
import { findAllPlansForUserFromAPI } from "../../services/PlanService";
import { setUserPlansAction } from "../actions/userPlansActions";

export const fetchUsersPlansAction = (
  userId: number,
  authToken: string,
  academicYear: number
) => {
  return async (dispatch: Dispatch) => {
    // can handle loading and error states here in the future
    const plans = await findAllPlansForUserFromAPI(userId, authToken);
    dispatch(setUserPlansAction(plans, academicYear));
  };
};
