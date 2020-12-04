import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../state/reducers/state";
import {
  getAcademicYearFromState,
  getGraduationYearFromState,
  getIsAdvisorFromState,
} from "../state";
import { fetchMajorsAndPlans } from "../utils/fetchMajorsAndPlans";
import { AUTH_TOKEN_COOKIE_KEY } from "../utils/auth-helpers";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import ErrorIcon from "@material-ui/icons/Error";
import { AppDispatch } from "../state/store";
import { fetchUserAction } from "../state/thunks/userThunks";

const Centered = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
`;

const Text = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
`;
const SubText = styled.p`
  font-family: Roboto;
  font-style: normal;
  font-weight: 300;
  font-size: 12px;
  line-height: 2px;
  color: gray;
  a {
    color: red;
    text-decoration: none;
  }
`;

interface Props {
  redirectUrl?: string;
}

export const RedirectScreen: React.FC<Props> = ({ redirectUrl }) => {
  const dispatch: AppDispatch = useDispatch();
  const { academicYear, graduationYear, isAdvisor } = useSelector(
    (state: AppState) => ({
      academicYear: getAcademicYearFromState(state),
      graduationYear: getGraduationYearFromState(state),
      isAdvisor: getIsAdvisorFromState(state),
    })
  );
  const [isLoading, setIsLoading] = useState(true);

  // component did mount
  useEffect(() => {
    setIsLoading(true);
    dispatch(fetchMajorsAndPlans()).then(() => {
      const cookie = Cookies.get(AUTH_TOKEN_COOKIE_KEY);
      if (cookie) {
        Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
          path: "/redirect",
          domain: window.location.hostname,
        });
        // remove cookie if it already exists
        Cookies.remove(AUTH_TOKEN_COOKIE_KEY, {
          path: "/",
          domain: window.location.hostname,
        });
        Cookies.set(AUTH_TOKEN_COOKIE_KEY, cookie, {
          path: "/",
          domain: window.location.hostname,
        }); // set persisting cookie for all paths
        dispatch(fetchUserAction(cookie)).then(() => {
          setIsLoading(false);
        });
      }
    });
  }, []);

  const needsToGoToOnboarding = () => {
    return !graduationYear || !academicYear;
  };

  if (!Cookies.get(AUTH_TOKEN_COOKIE_KEY)) {
    return (
      <Centered>
        <ErrorIcon color="secondary" style={{ fontSize: 80 }} />
        <Text> Oh oh, we couldn't authenticate you! </Text>
        <SubText>
          Reach out to your advisor or to us{" "}
          <a href="mailto: graduate@sandboxnu.com">here</a>
        </SubText>
      </Centered>
    );
  }

  if (isLoading) {
    return (
      <Centered>
        <CircularProgress color="secondary" />
        <Text> Getting GraduateNU ready </Text>
        <SubText> Don't worry, it'll take just a second </SubText>
      </Centered>
    );
  }

  if (redirectUrl && redirectUrl !== "/redirect") {
    return <Redirect to={redirectUrl} />;
  }

  if (isAdvisor === false) {
    // student
    if (needsToGoToOnboarding()) {
      return <Redirect to="/onboarding" />;
    } else {
      return <Redirect to="/home" />;
    }
  } else {
    // advisor
    return <Redirect to="/advisor/notifications" />;
  }
};
