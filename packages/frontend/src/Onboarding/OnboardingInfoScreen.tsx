import { Form, Formik } from "formik";
import { MenuItem, TextField, Tooltip } from "@material-ui/core";
import React from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router";
import { Dispatch } from "redux";
import * as Yup from "yup";
import styled from "styled-components";
import { IPlanData, ITemplatePlan, IUserData } from "../models/types";
import {
  setStudentAcademicYearAction,
  setStudentAction,
  setStudentCatalogYearAction,
  setStudentConcentrationAction,
  setStudentCoopCycleAction,
  setStudentFullNameAction,
  setStudentGraduationYearAction,
  setStudentMajorAction,
} from "../state/actions/studentActions";
import { addNewPlanAction } from "../state/actions/userPlansActions";
import { GenericOnboardingTemplate } from "./GenericOnboarding";
import { getMajorsFromState, getStudentFromState } from "../state";
import { Major } from "@graduate/common";
import { AppState } from "../state/reducers/state";
import { Autocomplete } from "@material-ui/lab";
import { SaveInParentConcentrationDropdown } from "../components/ConcentrationDropdown";
import { BASE_FORMATTED_COOP_CYCLES } from "../plans/coopCycles";
import { nullOrNumber, nullOrString } from "../utils/plan-helpers";
import { NextButton } from "../components/common/NextButton";

const StyleForm = styled(Form)`
  display: flex;
  flex-direction: column;
`;

const marginBottomSpace = 12;

interface OnboardingReduxDispatchProps {
  setStudentAction: (student: IUserData) => void;
  setFullName: (fullName: string) => void;
  setAcademicYear: (academicYear: number | null) => void;
  setGraduationYear: (graduationYear: number | null) => void;
  setCatalogYear: (catalogYear: number | null) => void;
  setMajor: (major: string | null) => void;
  setConcentration: (concentration: string | null) => void;
  setCoopCycle: (coopCycle: string | null) => void;
}

interface OnboardingReduxStateProps {
  student: IUserData | undefined;
  majors: Major[];
}

type Props = OnboardingReduxDispatchProps & OnboardingReduxStateProps;

const OnboardingScreenComponent: React.FC<Props> = ({
  majors,
  setFullName,
  setAcademicYear,
  setGraduationYear,
  setCatalogYear,
  setMajor,
  setConcentration,
  setCoopCycle,
}: Props) => {
  const history = useNavigate();

  const catalogYearSet = [
    ...Array.from(new Set(majors.map((major) => major.yearVersion.toString()))),
  ].sort();

  const majorNames = (catalogYear: string) => {
    return majors.filter(
      (major) => major.yearVersion === parseInt(catalogYear)
    );
  };

  const getMajor = (
    majorName: string,
    catalogYear: string
  ): Major | undefined => {
    const majorResults = majors.filter(
      (major) =>
        major.name == majorName && major.yearVersion === parseInt(catalogYear)
    );

    return majorResults.length > 0 ? majorResults[0] : undefined;
  };

  const OnboardingFormValidation = Yup.object().shape({
    fullName: Yup.string().max(255).required("Required"),
    academicYear: Yup.string().max(255).nullable().required("Required"),
    gradYear: Yup.string().max(255).nullable().required("Required"),
    catalogYear: Yup.string().max(255).nullable().required("Required"),
    major: Yup.string().when("catalogYear", {
      is: (value: string | any[]) => value == null,
      then: Yup.string()
        .nullable()
        .required("Please first select a catalog year."),
      otherwise: Yup.string().nullable().required("Required"),
    }),
    concentration: Yup.string().max(255).nullable(),
    coopCycle: Yup.string().max(255).nullable().required("Required"),
  });

  const handleSubmit = (values: {
    fullName: string;
    academicYear: string;
    gradYear: string;
    catalogYear: string;
    major: string;
    concentration: string;
    coopCycle: string;
  }): void => {
    setFullName(values.fullName);
    setAcademicYear(nullOrNumber(parseInt(values.academicYear)));
    setGraduationYear(nullOrNumber(parseInt(values.gradYear)));
    setCatalogYear(nullOrNumber(parseInt(values.catalogYear)));
    setMajor(values.major);
    setConcentration(nullOrString(values.concentration));
    setCoopCycle(nullOrString(values.coopCycle));

    history("/completedCourses");
  };

  return (
    <GenericOnboardingTemplate screen={0}>
      <Formik
        initialValues={{
          fullName: "",
          academicYear: "",
          gradYear: "",
          catalogYear: "",
          major: "",
          concentration: "",
          coopCycle: "",
        }}
        validationSchema={OnboardingFormValidation}
        onSubmit={(values) => handleSubmit(values)}
      >
        {({
          errors,
          touched,
          values,
          handleChange,
          handleBlur,
          setFieldValue,
          setTouched,
        }) => (
          <StyleForm>
            <TextField
              style={{ marginBottom: marginBottomSpace }}
              id="fullName"
              name="fullName"
              label="Full Name"
              variant="outlined"
              value={values.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.fullName && Boolean(errors.fullName)}
              helperText={
                errors.fullName && touched.fullName && errors.fullName
              }
            />
            <TextField
              style={{ marginBottom: marginBottomSpace }}
              id="academicYear"
              name="academicYear"
              select
              label="Academic Year"
              variant="outlined"
              value={values.academicYear}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.academicYear && Boolean(errors.academicYear)}
              helperText={
                errors.academicYear &&
                touched.academicYear &&
                errors.academicYear
              }
            >
              <MenuItem value={1}>1st Year</MenuItem>
              <MenuItem value={2}>2nd Year</MenuItem>
              <MenuItem value={3}>3rd Year</MenuItem>
              <MenuItem value={4}>4th Year</MenuItem>
              <MenuItem value={5}>5th Year</MenuItem>
            </TextField>
            <TextField
              style={{ marginBottom: marginBottomSpace }}
              id="gradYear"
              name="gradYear"
              select
              label="Graduation Year"
              variant="outlined"
              value={values.gradYear}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.gradYear && Boolean(errors.gradYear)}
              helperText={
                errors.gradYear && touched.gradYear && errors.gradYear
              }
            >
              {Array.from({ length: 5 }, (_, index) => index).map((count) => {
                const currentYear: number = new Date().getFullYear();
                return (
                  <MenuItem
                    key={currentYear + count}
                    value={currentYear + count}
                  >
                    {currentYear + count}
                  </MenuItem>
                );
              })}
            </TextField>
            <Tooltip
              title="Catalog Year refers to the year your major credits are associated to. This is usually the year you declared your Major."
              placement="top"
            >
              <Autocomplete
                style={{ marginBottom: marginBottomSpace }}
                disableListWrap
                options={catalogYearSet}
                onChange={(_, value) => setFieldValue("catalogYear", value)}
                onBlur={() => setTouched({ ["catalogYear"]: true })}
                value={values.catalogYear || null}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    id="catalogYear"
                    name="catalogYear"
                    label="Select a Catalog Year"
                    variant="outlined"
                    value={values.catalogYear}
                    error={touched.catalogYear && Boolean(errors.catalogYear)}
                    helperText={
                      errors.catalogYear &&
                      touched.catalogYear &&
                      errors.catalogYear
                    }
                  />
                )}
              />
            </Tooltip>
            <Autocomplete
              style={{ marginBottom: marginBottomSpace }}
              disableListWrap
              options={majorNames(values.catalogYear).map((maj) => maj.name)}
              onChange={(_, value) => setFieldValue("major", value)}
              onBlur={() => setTouched({ ["major"]: true })}
              value={values.major || null}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="major"
                  name="major"
                  label="Select a Major"
                  variant="outlined"
                  value={values.major}
                  error={touched.major && Boolean(errors.major)}
                  helperText={errors.major && touched.major && errors.major}
                />
              )}
            />
            <SaveInParentConcentrationDropdown
              style={{ marginBottom: marginBottomSpace }}
              major={getMajor(values.major, values.catalogYear)}
              concentration={values.concentration || null}
              setConcentration={(value) =>
                setFieldValue("concentration", value)
              }
              useLabel={true}
              showError={Boolean(errors.coopCycle)}
            />
            <Autocomplete
              style={{ marginBottom: marginBottomSpace }}
              disableListWrap
              options={BASE_FORMATTED_COOP_CYCLES}
              renderInput={(params) => (
                <TextField
                  {...params}
                  id="coopCycle"
                  name="coopCycle"
                  variant="outlined"
                  label="Select A Co-op Cycle"
                  value={values.coopCycle}
                  error={touched.coopCycle && Boolean(errors.coopCycle)}
                  helperText={
                    errors.coopCycle && touched.coopCycle && errors.coopCycle
                  }
                />
              )}
              value={values.coopCycle || null}
              onChange={(_, value) => setFieldValue("coopCycle", value)}
              onBlur={() => setTouched({ ["coopCycle"]: true })}
            />
            <NextButton type="submit" />
          </StyleForm>
        )}
      </Formik>
    </GenericOnboardingTemplate>
  );
};

/**
 * Callback to be passed into connect, responsible for dispatching redux actions to update the appstate.
 * @param dispatch responsible for dispatching actions to the redux store.
 */
const mapStateToProps = (state: AppState) => ({
  student: getStudentFromState(state),
  majors: getMajorsFromState(state),
});

/**
 * Callback to be passed into connect, to make properties of the AppState available as this components props.
 * @param state the AppState
 */
const mapDispatchToProps = (dispatch: Dispatch) => ({
  setStudentAction: (student: IUserData) => dispatch(setStudentAction(student)),
  setFullName: (fullName: string) =>
    dispatch(setStudentFullNameAction(fullName)),
  setMajor: (major: string | null) => dispatch(setStudentMajorAction(major)),
  setConcentration: (concentration: string | null) =>
    dispatch(setStudentConcentrationAction(concentration)),
  setAcademicYear: (academicYear: number | null) =>
    dispatch(setStudentAcademicYearAction(academicYear)),
  setGraduationYear: (gradYear: number | null) =>
    dispatch(setStudentGraduationYearAction(gradYear)),
  setCatalogYear: (catalogYear: number | null) =>
    dispatch(setStudentCatalogYearAction(catalogYear)),
  setCoopCycle: (coopCycle: string | null) =>
    dispatch(setStudentCoopCycleAction(coopCycle)),
  addNewPlanAction: (plan: IPlanData | ITemplatePlan, academicYear?: number) =>
    dispatch(addNewPlanAction(plan, academicYear)),
});

/**
 * Convert this React component to a component that's connected to the redux store.
 * When rendering the connecting component, the props assigned in mapStateToProps, do not need to
 * be passed down as props from the parent component.
 */
export const OnboardingInfoScreen = connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingScreenComponent);
