import React from "react";
import { Route } from "react-router-dom";

export function UnprotectedRoute({
  component,
  path,
}: {
  component:
    | React.ComponentType<any>;
  path: string;
}) {
  // TODO: Figure out how auth token works
  // if (getAuthToken()) {
  //   return <Route path={path} component={RedirectScreen} />;
  // } else {
  return <Route path={path} element={component} />;
  // }
}
