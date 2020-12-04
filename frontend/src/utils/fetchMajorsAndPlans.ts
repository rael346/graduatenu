import {
  fetchPlansPendingAction,
  fetchPlansSuccessAction,
  fetchPlansErrorAction,
} from "../state/actions/plansActions";
import {
  fetchMajorsPendingAction,
  fetchMajorsSuccessAction,
  fetchMajorsErrorAction,
} from "../state/actions/majorsActions";
import { Dispatch } from "redux";
import { Major, Schedule } from "../../../common/types";
import { majorIds, majorMap } from "../majors";

//graphql schema for searchNEU's majors endpoint.
const majorSchema: string[] = majorIds.map((majorId: string) => {
  return `major(majorId: "${majorId}") {
        latestOccurrence {
            requirements
            plansOfStudy
        }
    }`;
});

// build a GraphQL query
const querySchema: string = `
query {
${majorSchema.reduce(
  (accumulator: string, currentValue: string, index: number) => {
    return accumulator + `major${String(index)}: ${currentValue}\n`;
  },
  ""
)}
}
`;

//parse out major objects from the response.
const parseMajors = (res: any): Major[] => {
  const majors: Major[] = [];
  for (const key of Object.keys(res)) {
    if (res.hasOwnProperty(key)) {
      majors.push(res[key].latestOccurrence.requirements);
    }
  }
  return majors;
};

//parse out plan objects from the response.
const parsePlans = (res: any): Record<string, Schedule[]> => {
  const record: Record<string, Schedule[]> = {};
  Object.keys(res).forEach((key, index) => {
    if (res.hasOwnProperty(key)) {
      record[majorMap[majorIds[index]]] =
        res[key].latestOccurrence.plansOfStudy;
      index++;
    }
  });
  return record;
};

//use fetch utility to make a post request to the searchNEU graphql api endpoint.
export function fetchMajorsAndPlans() {
  return async (dispatch: Dispatch) => {
    dispatch(fetchMajorsPendingAction());
    dispatch(fetchPlansPendingAction());
    try {
      const res = await fetch("https://searchneu.com/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: querySchema }),
      });
      const res_1 = await res.json();
      if (res_1.error) {
        throw res_1.error;
      }
      const majors: Major[] = parseMajors(res_1.data);
      const record: Record<string, Schedule[]> = parsePlans(res_1.data);
      dispatch(fetchMajorsSuccessAction(majors));
      dispatch(fetchPlansSuccessAction(record));
    } catch (error) {
      dispatch(fetchMajorsErrorAction(error));
      dispatch(fetchPlansErrorAction(error));
    }
  };
}
