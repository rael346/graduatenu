import { Dispatch } from "redux";
import { fetchUserFromAPI } from "../../services/UserService";
import { getScheduleCoursesFromSimplifiedCourseDataAPI } from "../../utils/course-helpers";
import {
  setCompletedCoursesAction,
  setTransferCoursesAction,
  setUserAction,
} from "../actions/userActions";

export const fetchUserAction = (authToken: string) => {
  return async (dispatch: Dispatch) => {
    // can handle loading and error states here in the future
    const response = await fetchUserFromAPI(authToken);
    dispatch(setUserAction(response.user));

    // appropriately set completed and transfer courses
    await Promise.all([
      getScheduleCoursesFromSimplifiedCourseDataAPI(
        response.user.coursesCompleted
      ).then(courses => {
        dispatch(setCompletedCoursesAction(courses));
      }),
      getScheduleCoursesFromSimplifiedCourseDataAPI(
        response.user.coursesTransfer
      ).then(courses => {
        dispatch(setTransferCoursesAction(courses));
      }),
    ]);
  };
};
