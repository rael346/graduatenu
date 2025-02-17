import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { ClassBlock, NonDraggableClassBlock } from "../ClassBlocks";
import { AddBlock } from "../ClassBlocks/AddBlock";
import { ClassList } from "../ClassList";
import { EmptyBlock } from "../EmptyBlock";
import { AddClassSearchModal } from "../AddClassSearchModal";
import {
  DNDScheduleCourse,
  DNDScheduleTerm,
  StatusEnum,
} from "../../models/types";
import {
  courseToString,
  ScheduleCourse,
  SeasonWord,
  Status,
  IWarning,
  CourseWarning,
} from "@graduate/common";
import styled from "styled-components";
import { AppState } from "../../state/reducers/state";
import { connect } from "react-redux";
import {
  getCourseWarningsFromState,
  getCurrentClassCounterFromState,
  safelyGetTransferCoursesFromState,
  safelyGetWarningsFromState,
} from "../../state";
import { Dispatch } from "redux";
import {
  addCoursesToActivePlanAction,
  changeSemesterStatusForActivePlanAction,
  removeClassFromActivePlanAction,
  undoRemoveClassFromActivePlanAction,
} from "../../state/actions/userPlansActions";
import { Tooltip } from "@material-ui/core";
import {
  GENERIC_COURSE_ID,
  GENERIC_COURSE_SUBJECT,
  SEMESTER_MIN_HEIGHT,
} from "../../constants";
import {
  convertTermIdToSeason,
  findCourseWarnings,
} from "../../utils/schedule-helpers";
import { UndoDelete } from "../UndoDelete";
import ScheduleChangeTracker from "../../utils/ScheduleChangeTracker";

const OutsideContainer = styled.div`
  flex: 1;
  width: 100%;
`;

const Container = styled.div<any>`
  border: 1px solid rgba(235, 87, 87, 0.5);
  box-sizing: border-box;
  position: relative;
  height: 100%;
  background-color: ${(props) =>
    props.warning ? "rgba(235, 87, 87, 0.6)" : "rgb(255, 255, 255, 0)"};
`;

const ClassListWrapper = styled.div`
  display: flex;
  min-height: ${SEMESTER_MIN_HEIGHT}px;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

interface ReduxStoreSemesterBlockProps {
  courseWarnings: CourseWarning[];
  warnings: IWarning[];
  currentClassCounter: number;
  transferCourses: ScheduleCourse[];
}

interface ReduxDispatchSemesterBlockProps {
  handleAddClasses: (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) => void;
  onDeleteClass: (
    course: DNDScheduleCourse,
    semester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) => void;
  onUndoDeleteClass: () => void;
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord,
    transferCourses: ScheduleCourse[]
  ) => void;
}

interface SemesterBlockProps {
  semester: DNDScheduleTerm;
  isEditable: boolean;
}

type Props = SemesterBlockProps &
  ReduxStoreSemesterBlockProps &
  ReduxDispatchSemesterBlockProps;

type NonEditProps = SemesterBlockProps & ReduxStoreSemesterBlockProps;

interface SemesterBlockState {
  modalVisible: boolean;
  snackbarOpen: boolean;
  deletedClass?: DNDScheduleCourse;
}

function renderTooltip(warnings: IWarning[]) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {warnings.map((w, index) => {
        return <span key={index}>{w.message}</span>;
      })}
    </div>
  );
}

const NonEditableSemesterBlockComponent = (props: NonEditProps) => {
  const renderBody = (props: NonEditProps) => {
    const { semester, courseWarnings } = props;
    return semester.classes.map((scheduleCourse, index) => {
      if (!!scheduleCourse) {
        return (
          <NonDraggableClassBlock
            key={index}
            course={scheduleCourse}
            warnings={findCourseWarnings(courseWarnings, scheduleCourse)}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            onDelete={() => {}}
            hideDelete={true}
          />
        );
      } else return <EmptyBlock key={index} />;
    });
  };
  return (
    <OutsideContainer>
      <Container warning={false}>
        <ClassListWrapper>
          {props.warnings.length > 0 ? (
            <Tooltip
              title={renderTooltip(props.warnings)}
              placement="top"
              arrow
            >
              <>{renderBody(props)}</>
            </Tooltip>
          ) : (
            renderBody(props)
          )}
        </ClassListWrapper>
      </Container>
    </OutsideContainer>
  );
};

class EditableSemesterBlockComponent extends React.Component<
  Props,
  SemesterBlockState
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      modalVisible: false,
      snackbarOpen: false,
      deletedClass: undefined,
    };
  }

  showModal() {
    this.setState({ modalVisible: true });
  }

  hideModal() {
    this.setState({ modalVisible: false });
  }

  openSnackbar = () => {
    this.setState({
      snackbarOpen: true,
    });
  };

  handleSnackbarClose = (
    event: React.SyntheticEvent<any, Event>,
    reason: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({
      snackbarOpen: false,
    });
  };

  onDeleteClass = (course: DNDScheduleCourse, semester: DNDScheduleTerm) => {
    ScheduleChangeTracker.getInstance().addRemoveClassChange(
      courseToString(course),
      semester.termId
    );
    this.setState(
      {
        snackbarOpen: true,
        deletedClass: course,
      },
      () =>
        this.props.onDeleteClass(course, semester, this.props.transferCourses)
    );
  };

  undoButtonPressed = () => {
    this.setState(
      {
        snackbarOpen: false,
      },
      this.props.onUndoDeleteClass
    );
  };

  closeSnackBar = () => {
    this.setState({
      snackbarOpen: false,
    });
  };

  // another day of doing it is making another interface and have a flag isGenericCourse
  // but would have to change A LOT of code / renaming from DNDScheduleCourse to the new thing
  isGenericCourse(scheduleCourse: DNDScheduleCourse) {
    return (
      scheduleCourse.classId === GENERIC_COURSE_ID &&
      scheduleCourse.subject === GENERIC_COURSE_SUBJECT
    );
  }

  renderBody() {
    const { semester, courseWarnings } = this.props;
    const status = semester.status;
    if (
      status === "CLASSES" ||
      status === "HOVERINACTIVE" ||
      status === "COOP"
    ) {
      return semester.classes.map((scheduleCourse, index) => {
        if (!!scheduleCourse) {
          return (
            <ClassBlock
              key={index}
              class={scheduleCourse}
              semester={semester}
              index={index}
              warnings={findCourseWarnings(courseWarnings, scheduleCourse)}
              onDelete={this.onDeleteClass.bind(this, scheduleCourse, semester)}
              currentClassCounter={this.props.currentClassCounter}
              canEditBlockName={this.isGenericCourse(scheduleCourse)}
            />
          );
        }
        return <EmptyBlock key={index} />;
      });
    }
  }

  renderContainer() {
    const { semester, warnings, isEditable } = this.props;
    const status = semester.status;
    return (
      <Container warning={warnings.length > 0}>
        <ClassListWrapper>
          <Droppable droppableId={semester.termId.toString()}>
            {(provided) => (
              <ClassList
                innerRef={provided.innerRef as any}
                {...provided.droppableProps}
              >
                {this.renderBody()}
                {provided.placeholder}
                {isEditable &&
                  !(
                    status === StatusEnum.INACTIVE ||
                    status === StatusEnum.HOVERINACTIVE
                  ) && <AddBlock onClick={this.showModal.bind(this)} />}
              </ClassList>
            )}
          </Droppable>
        </ClassListWrapper>
      </Container>
    );
  }

  render() {
    const { snackbarOpen, deletedClass, modalVisible } = this.state;
    return (
      <OutsideContainer>
        <UndoDelete
          deletedClass={deletedClass}
          snackbarOpen={snackbarOpen}
          handleSnackbarClose={this.handleSnackbarClose.bind(this)}
          undoButtonPressed={this.undoButtonPressed.bind(this)}
          closeSnackBar={this.closeSnackBar.bind(this)}
        />
        <AddClassSearchModal
          visible={modalVisible}
          handleClose={this.hideModal.bind(this)}
          handleSubmit={(courses: ScheduleCourse[]) => {
            // Change this semester status upon adding a class if it's not already a CLASSES semester.
            if (
              this.props.semester.status !== "CLASSES" &&
              this.props.semester.status !== "COOP"
            ) {
              this.props.handleStatusChange(
                "CLASSES",
                this.props.semester.year,
                convertTermIdToSeason(this.props.semester.termId)!,
                this.props.transferCourses
              );
            }

            // Add the given courses to this semester through redux
            this.props.handleAddClasses(
              courses,
              this.props.semester,
              this.props.transferCourses
            );
            courses.forEach((course) => {
              ScheduleChangeTracker.getInstance().addAddClassChange(
                courseToString(course),
                this.props.semester.termId
              );
            });
          }}
        />
        {this.props.warnings.length > 0 ? (
          <Tooltip
            title={renderTooltip(this.props.warnings)}
            placement="top"
            arrow
          >
            {this.renderContainer()}
          </Tooltip>
        ) : (
          this.renderContainer()
        )}
      </OutsideContainer>
    );
  }
}

const mapStateToProps = (state: AppState, ownProps: SemesterBlockProps) => ({
  warnings: safelyGetWarningsFromState(state).filter(
    (w) => w.termId === ownProps.semester.termId
  ),
  courseWarnings: getCourseWarningsFromState(state, ownProps.semester),
  currentClassCounter: getCurrentClassCounterFromState(state)!,
  transferCourses: safelyGetTransferCoursesFromState(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  handleAddClasses: (
    courses: ScheduleCourse[],
    semester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) =>
    dispatch(addCoursesToActivePlanAction(courses, semester, transferCourses)),
  onDeleteClass: (
    course: DNDScheduleCourse,
    semester: DNDScheduleTerm,
    transferCourses: ScheduleCourse[]
  ) =>
    dispatch(
      removeClassFromActivePlanAction(course, semester, transferCourses)
    ),
  onUndoDeleteClass: () => dispatch(undoRemoveClassFromActivePlanAction()),
  handleStatusChange: (
    newStatus: Status,
    year: number,
    tappedSemester: SeasonWord,
    transferCourses: ScheduleCourse[]
  ) =>
    dispatch(
      changeSemesterStatusForActivePlanAction(
        newStatus,
        year,
        tappedSemester,
        transferCourses
      )
    ),
});

const EditableSemesterBlock = connect<
  ReduxStoreSemesterBlockProps,
  ReduxDispatchSemesterBlockProps,
  SemesterBlockProps,
  AppState
>(
  mapStateToProps,
  mapDispatchToProps
)(EditableSemesterBlockComponent);

const NonEditableSemesterBlock = connect(mapStateToProps)(
  NonEditableSemesterBlockComponent
);

export const SemesterBlock : React.FC<SemesterBlockProps> = (props) => {
    const { isEditable } = props;
    return isEditable ? (
      <EditableSemesterBlock {...props}></EditableSemesterBlock>
    ) : (
      <NonEditableSemesterBlock {...props}></NonEditableSemesterBlock>
    );
  }

