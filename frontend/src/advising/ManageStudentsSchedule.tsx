import {
  DNDSchedule,
  FullStudentData,
  NamedScheduleView,
  StudentIdentifier,
} from "../models/types";
import React, { useState } from "react";
import { mockEmptySchedule, mockData } from "../data/mockData";
import { ColoredButton } from "../components/common/ColoredButton";
import ScheduleComponent from "../home/Schedule";
import { List, ListItem, ListItemText } from "@material-ui/core";

interface ManageStudentsScheduleProps {
  readonly student: StudentIdentifier;
}

interface StudentInfoSidebarProps {
  readonly fullStudentData: FullStudentData;
  readonly namedScheduleViews: Array<NamedScheduleView>;
  readonly currentSchedule?: DNDSchedule;
  readonly setCurrentSchedule: (schedule?: DNDSchedule) => void;
}

interface SchedulesListProps {
  readonly namedScheduleViews: Array<NamedScheduleView>;
}

const STUDENT: StudentIdentifier = {
  name: "Mario Speedwagon",
  nuid: "12345",
  userId: 1,
  email: "foo@bar.com",
};

const FULL_STUDENT_DATA: FullStudentData = {
  email: "foo@bar.com",
  major: "pain",
  username: "Mario Speedwagon",
  academic_year: 42069,
  graduation_year: 2022,
  coop_cycle: "2 Years, 2 Co-op Cycles",
  nu_id: "12345",
  imageUrl: "https://c8.alamy.com/comp/DHNP21/confused-student-DHNP21.jpg",
};

const NAMED_SCHEDULE_1: NamedScheduleView = {
  name: "Plan 1",
  scheduleView: {
    id: 10,
    schedule: mockEmptySchedule,
    major: "key",
    coopCycle: "1 Year, 2 Co-op Cycles",
  },
};

const NAMED_SCHEDULE_2: NamedScheduleView = {
  name: "Plan 2",
  scheduleView: {
    id: 11,
    schedule: mockData,
    major: "minor",
    coopCycle: "0.5 Years, 1 Co-op Cycles",
  },
};

const SchedulesList: React.FC<SchedulesListProps> = ({
  namedScheduleViews,
}) => {
  return (
    <List>
      {namedScheduleViews.map(schedule => (
        <ListItem>
          <ListItemText primary={schedule.name} />
        </ListItem>
      ))}
    </List>
  );
};

const StudentInfoSidebar: React.FC<StudentInfoSidebarProps> = ({
  fullStudentData,
  namedScheduleViews,
}) => {
  const {
    email,
    major,
    username,
    academic_year,
    coop_cycle,
    imageUrl,
  } = fullStudentData;

  return (
    <div>
      <img src={imageUrl} />
      <div>{username}</div>
      <div>{email}</div>
      <div>{major}</div>
      <div>Year {academic_year}</div>
      <div>{coop_cycle}</div>
      <div>Plans</div>
      <SchedulesList namedScheduleViews={namedScheduleViews} />
      <ColoredButton onClick={() => {}}>Assign template</ColoredButton>
    </div>
  );
};

const ManageStudentsSchedule: React.FC<ManageStudentsScheduleProps> = ({
  student,
}) => {
  const [schedules, setSchedules] = useState([mockEmptySchedule, mockData]);
  const [currentSchedule, setCurrentSchedule] = useState<
    DNDSchedule | undefined
  >(undefined);

  return (
    <>
      <StudentInfoSidebar
        fullStudentData={FULL_STUDENT_DATA}
        namedScheduleViews={[NAMED_SCHEDULE_1, NAMED_SCHEDULE_2]}
        currentSchedule={currentSchedule}
        setCurrentSchedule={setCurrentSchedule}
      />
      <ScheduleComponent schedule={currentSchedule} />
    </>
  );
};

export default ManageStudentsSchedule;
