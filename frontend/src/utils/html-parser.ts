import fs from "fs";

import {
  Schedule,
  ScheduleCourse,
  ScheduleYear,
  SeasonEnum,
  StatusEnum,
  INEUParentMap,
  INEUCourse,
} from "../models/types";

import { getSearchNEUData } from "../../../backend/src/json_parser";

/**
 * Parses a degree audit into a valid schedule.
 * @param auditpath  the path to the degree audit.
 * @return the schedule described by the degree audit.
 */
export const parse_audit = (
  auditpath: string,
  parents: INEUParentMap
): Schedule => {
  // open the file at the path
  const audit: string = fs.readFileSync(auditpath, "utf-8");
  // get all of the parsed courses
  const parsed_courses: INEUCourse[] = parse_courses(audit, parents);

  // sort the parsed courses based on semester  const byTermId: {
  const byTermId: {
    termIds: number[];
    termMap: { [key: number]: ScheduleCourse[] };
  } = {
    termIds: [],
    termMap: {},
  };

  for (const course of parsed_courses) {
    // ensure we have a term in which we can place the course
    if (!byTermId.termIds.includes(course.termId)) {
      byTermId.termIds.push(course.termId);
      byTermId.termMap[course.termId] = [];
    }

    // convert searchneu to schedule, bucketing by termid
    byTermId.termMap[course.termId].push(
      searchcourse_to_schedulecourse(course)
    );
  }

  const schedule: Schedule = {
    years: [],
    yearMap: {},
    id: "example-schedule",
  };

  // get all the years
  for (const termId of byTermId.termIds) {
    if (!schedule.years.includes(Math.floor(termId / 100))) {
      schedule.years.push(Math.floor(termId / 100));
    }
  }

  for (const year of schedule.years) {
    schedule.yearMap[year] = sort_classes_into_year(byTermId.termMap, year);
  }

  return schedule;
};

/**
 * Generates a ScheduleYear with all of the courses in that year.
 * @param termMap all of the courses taken, organized by term.
 * @param year the year we're producing a ScheduleYear for.
 * @return a ScheduleYear with the appropriate classes taken.
 */
const sort_classes_into_year = (
  termMap: { [key: number]: ScheduleCourse[] },
  year: number
): ScheduleYear => {
  // makes the schedule year, then fills each year with classes
  const yearObject = make_scheduleyear(year);

  if (termMap[year * 100 + 10]) {
    for (const course of termMap[year * 100 + 10]) {
      yearObject.fall.status = StatusEnum.CLASSES;
      yearObject.fall.classes.push(course);
    }
  }
  if (termMap[year * 100 + 30]) {
    for (const course of termMap[year * 100 + 30]) {
      yearObject.spring.status = StatusEnum.CLASSES;
      yearObject.spring.classes.push(course);
    }
  }
  if (termMap[year * 100 + 40]) {
    for (const course of termMap[year * 100 + 40]) {
      yearObject.summer1.status = StatusEnum.CLASSES;
      yearObject.summer1.classes.push(course);
    }
  }
  if (termMap[year * 100 + 60]) {
    for (const course of termMap[year * 100 + 60]) {
      yearObject.summer2.status = StatusEnum.CLASSES;
      yearObject.summer2.classes.push(course);
    }
  }

  return yearObject;
};

/**
 * Produces a ScheduleYear object for a given year.
 * @param year the year that the ScheduleYear object should occur in.
 * @return the ScheduleYear corresponding to that year.
 */
const make_scheduleyear = (year: number): ScheduleYear => {
  return {
    year: year,
    fall: {
      season: SeasonEnum.FL,
      year: year,
      termId: year * 100 + 10,
      id: 10,
      status: StatusEnum.INACTIVE,
      classes: [],
    },
    spring: {
      season: SeasonEnum.SP,
      year: year,
      termId: year * 100 + 30,
      id: 30,
      status: StatusEnum.INACTIVE,
      classes: [],
    },
    summer1: {
      season: SeasonEnum.S1,
      year: year,
      termId: year * 100 + 40,
      id: 40,
      status: StatusEnum.INACTIVE,
      classes: [],
    },
    summer2: {
      season: SeasonEnum.S2,
      year: year,
      termId: year * 100 + 60,
      id: 60,
      status: StatusEnum.INACTIVE,
      classes: [],
    },
    isSummerFull: false,
  };
};

/**
 * Converts a SearchNEU course into its corresponding ScheduleCourse.
 * @param course the SearchNEU course to convert.
 * @return the ScheduleCourse with the important information from the SearchNEU course.
 */
const searchcourse_to_schedulecourse = (course: INEUCourse): ScheduleCourse => {
  return {
    name: course.name,
    classId: String(course.classId),
    subject: course.subject,
    prereqs: course.prereqs,
    coreqs: course.coreqs,
    numCreditsMin: course.minCredits,
    numCreditsMax: course.maxCredits,
  };
};

/**
 * Finds all of the courses in the degree audit.
 * @param audit the entire text of the degree audit
 * @return an array of courses found in the audit
 */
const parse_courses = (audit: string, parents: INEUParentMap): INEUCourse[] => {
  // anything that starts with a term is a course (except those with no AP / IB credit assigned)
  const course_regex: RegExp = new RegExp(
    "(FL|SP|S1|S2|SM)\\d\\d.+(?!NO AP|NO IB)"
  );

  /**
   * Fills out all of the course information from a course string.
   * @param cstring the line of text from the degree audit that should contain a course.
   * @return the course if it can be found, undefined otherwise.
   */
  const fillCourse = (cstring: string): INEUCourse | undefined => {
    const courseString: string = cstring.substring(
      cstring.search("(FL|SP|S1|S2|SM)\\d\\d")
    );

    // uses some magic to hunt down all of the course information.
    const season: SeasonEnum = courseString.substring(0, 2) as SeasonEnum; // guaranteed by regex
    const year: number | undefined = parseInt(courseString.substring(2, 4), 10);
    const subject: string = courseString.substring(4, 9).replace(/\s/g, "");
    const termId: number | undefined = get_termid(season, year);
    const classId: number | undefined = parseInt(
      courseString.substring(9, 13),
      10
    );
    const creditHours: number | undefined = parseFloat(
      courseString.substring(18, 22)
    );

    // not a valid course if the course id is not a number
    if (!classId || !creditHours) return undefined;

    let course: INEUCourse | undefined = getSearchNEUData(
      {
        subject,
        classId,
        termId,
      },
      parents
    );

    // if we couldn't find the course in a current term,
    // find the course without a term attached
    if (!course) {
      course = getSearchNEUData(
        {
          subject,
          classId,
        },
        parents
      );
    }

    // assumes that we can find all courses on degree audits.
    return course;
  };

  // all of the strings that can contain course information without duplicates
  return audit
    .split("\n")
    .filter(s => course_regex.test(s))
    .map(fillCourse) // convert each string into a complete course.
    .filter(
      (
        course,
        index,
        arr // remove undefined and duplicate values
      ) =>
        course &&
        !arr.filter(
          (
            c,
            i // undefined values are removed, so casting is legal
          ) => JSON.stringify(course) === JSON.stringify(c) && i < index
        ).length
    ) as INEUCourse[];
};

/**
 * Retrieved the termId with the season and year of the course.
 * @param season the two-character code for the course's season
 * @param year the two-character year in which the course was taken
 * @return the termid if it can be found; undefined otherwise
 */
const get_termid = (
  season: SeasonEnum,
  year: number | undefined
): number | undefined => {
  if (!year) return undefined;

  // Makes the assumption that all years will be in the 21st century
  // As different technology will likely be used in 81 years, this is fine
  let termid: number = (2000 + year) * 100;

  switch (season) {
    case SeasonEnum.FL: // Fall term
      // add 1 to the year as well
      termid += 110;
      break;
    case SeasonEnum.SP: // Spring term
      termid += 30;
      break;
    case SeasonEnum.S1: // Summer 1 term
      termid += 40;
      break;
    case SeasonEnum.S2: // Summer 2 term
      termid += 60;
      break;
    case SeasonEnum.SM: // Full Summer term
      termid += 50;
      break;
    default:
      throw new Error(
        "The given season was not a member of the enumeration required."
      );
  }

  return termid;
};
