import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TextField } from "@material-ui/core";
import { ILoginData } from "../models/types";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { setStudentAction } from "../state/actions/studentActions";
import { loginUser } from "../services/UserService";
import { setAuthTokenAsCookie } from "../utils/auth-helpers";
import { SecondaryLinkButton } from "../components/common/LinkButtons";

const Wrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  height: 100vh;
`;

const Title = styled.div`
  margin-top: 96px;
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  line-height: 28px;
  color: #000000;
`;

const Subtitle = styled.div`
  margin-top: 8px;
  margin-bottom: 4px;
  font-family: Roboto;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 16px;
  width: 326px;
  text-align: center;
`;

const Box = styled.div`
  border: 1px solid white;
  width: 500px;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  margin-top: 1em;
  display: grid;
  grid-template-columns: auto auto;
  gap: 0em 1em;
`;

enum ErrorType {
  INVALID_CREDENTIALS,
  OTHER,
}

interface LoginScreenState {
  emailStr: string;
  passwordStr: string;
  beenEditedEmail: boolean;
  beenEditedPassword: boolean;
  validEmail: boolean;
  error?: ErrorType;
}

const LoginScreenComponent: React.FC = () => {
  const history = useNavigate();
  const dispatch = useDispatch();
  const [state, setState] = useState<LoginScreenState>({
    emailStr: "",
    passwordStr: "",
    beenEditedEmail: false,
    beenEditedPassword: false,
    validEmail: true,
    error: undefined,
  });

  /**
   * All of the different functions that modify the stored TextField values as they are changed.
   */
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      emailStr: e.target.value,
      beenEditedEmail: true,
    });
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState({
      ...state,
      passwordStr: e.target.value,
      beenEditedPassword: true,
    });
  };

  /**
   * Validates user input, then sends a log in request to the backend using the input data.
   * Checks response for error messages. If the log in succeeds, dispatch actions to set
   * user attributes obtained from the response object, then redirects user to /home.
   */
  const submit = async () => {
    // Regex to determine if email string is a valid address
    const validEmail: boolean =
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(state.emailStr);

    setState({
      ...state,
      validEmail,
    });

    if (validEmail) {
      const user: ILoginData = {
        email: state.emailStr,
        password: state.passwordStr,
      };

      try {
        const { status, data } = await loginUser(user);

        if (data.error || !data.user) {
          // handle response errros
          const isUnauthorized = status === 401;

          setState({
            ...state,
            error: isUnauthorized
              ? ErrorType.INVALID_CREDENTIALS
              : ErrorType.OTHER,
          });
        } else {
          // update redux store with logged in user and set cookies
          dispatch(setStudentAction(data.user))
          setAuthTokenAsCookie(data.user.token);

          /**
           * TODO: Need a better way to check if the user is onboarded or not.
           */
          const isOnboarded = data.user.catalogYear !== null;
          if (isOnboarded) {
            // redirect to home if the user had finished onboarding
            history("/home");
          } else {
            // redirect to onboarding if the user hadn't finished onboarding
            history("/onboarding");
          }
        }
      } catch (err) {
        // something went wrong making the request
        setState({
          ...state,
          error: ErrorType.OTHER,
        });

        console.log("Something went wrong when logging in: ", err);
      }
    }
  };

  /**
   * Renders the email text field
   */
  const renderEmailTextField = (textFieldStr: string, beenEdited: boolean) => {
    const showInvalidCredsError = state.error === ErrorType.INVALID_CREDENTIALS;

    return (
      <TextField
        id="outlined-basic"
        label="Email"
        variant="outlined"
        value={textFieldStr}
        onChange={onChangeEmail}
        placeholder="presidentaoun@northeastern.edu"
        error={
          (textFieldStr.length === 0 && beenEdited) ||
          !state.validEmail ||
          state.error !== undefined
        }
        style={{
          marginTop: 48,
          marginBottom: 16,
          minWidth: 326,
        }}
        helperText={
          (showInvalidCredsError && "Email or password is invalid") ||
          (!state.validEmail && "Please enter a valid email") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid email")
        }
        type="email"
      />
    );
  };

  /**
   * Renders the password text field
   */
  const renderPasswordTextField = (
    textFieldStr: string,
    beenEdited: boolean
  ) => {
    const showInvalidCredsError = state.error === ErrorType.INVALID_CREDENTIALS;
    const showOtherError = state.error === ErrorType.OTHER;

    return (
      <TextField
        id="outlined-basic"
        label="Password"
        variant="outlined"
        value={textFieldStr}
        onChange={onChangePassword}
        error={
          (textFieldStr.length === 0 && beenEdited) || state.error !== undefined
        }
        style={{
          minWidth: 326,
        }}
        helperText={
          (showInvalidCredsError && "Email or password is invalid") ||
          (showOtherError &&
            "Oops, something went wrong. Please try again later.") ||
          ("" && (!beenEdited || textFieldStr.length !== 0)) ||
          (textFieldStr.length === 0 &&
            beenEdited &&
            "Please enter a valid password")
        }
        type="password"
      />
    );
  };

  // indicates if the user came from login button on welcome page
  const location = useLocation();
  const { fromOnBoarding } = (location.state as any) || {
    fromOnBoarding: false,
  };

  return (
    <Wrapper>
      <Title>Log In</Title>
      <Box>
        {renderEmailTextField(state.emailStr, state.beenEditedEmail)}
        {renderPasswordTextField(state.passwordStr, state.beenEditedPassword)}
      </Box>

      <Subtitle>
        New here? Sign up{" "}
        <Link
          style={{ color: "#EB5757" }}
          to={{
            pathname: fromOnBoarding ? "/onboarding" : "/signup",
          }}
        >
          here
        </Link>
        {" or "}
        <Link
          style={{ color: "#EB5757" }}
          to={fromOnBoarding ? "/onboarding" : "/home"}
          state={{ fromOnBoardingGuest: fromOnBoarding }}
        >
          continue as guest
        </Link>
      </Subtitle>
      <ButtonContainer>
        <PrimaryButton onClick={submit}>Log In</PrimaryButton>
        <SecondaryLinkButton to="/">Back</SecondaryLinkButton>
      </ButtonContainer>
    </Wrapper>
  );
};

export const LoginScreen = LoginScreenComponent;
