import React from "react";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import ErrorIcon from "@material-ui/icons/Error";
import { removeAuthTokenFromCookies } from "../../utils/auth-helpers";
import { NORTHEASTERN_RED } from "../../constants";

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
const SubText = styled.div`
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

interface LoadingProps {
  errorMsg?: string;
  text?: string;
  subText?: string;
}

export const LoadingScreen = (props: LoadingProps) => {
  const refresh = () => {
    window.location.reload();
  };

  const clearCookies = () => {
    removeAuthTokenFromCookies();
    window.location.reload();
  };
  const defaultSubtest = "Don't worry, it'll take just a second";
  const errorSubText = (
    <>
      <p>
        Try{" "}
        <a href="/" onClick={refresh}>
          refreshing the page
        </a>{" "}
        or{" "}
        <a href="/" onClick={clearCookies}>
          clearing your cookies
        </a>
        .
      </p>
      <p>
        If that doesn't work, try reaching out to your advisor or to us{" "}
        <a href="mailto: graduate@sandboxnu.com">here</a>
      </p>
    </>
  );
  return (
    <Centered>
      {props.errorMsg ? (
        <ErrorIcon style={{ color: NORTHEASTERN_RED, fontSize: 80 }} />
      ) : (
        <CircularProgress style={{ color: NORTHEASTERN_RED }} />
      )}
      <Text> {props.errorMsg || props.text || "Loading"} </Text>
      <SubText>
        {props.errorMsg ? errorSubText : props.subText || defaultSubtest}
      </SubText>
    </Centered>
  );
};
