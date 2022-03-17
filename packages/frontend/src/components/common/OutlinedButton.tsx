import React from "react";
import { Button } from "@material-ui/core";
import { withStyles, Theme } from "@material-ui/core/styles";

export const ColorButton = withStyles((_theme: Theme) => ({
  root: {
    color: "#EB5757",
    width: "200px;",
    height: "36px",
    borderColor: "#EB5757",
    backgroundColor: "#ffffff",
    "&:hover": {
      backgroundColor: "#DB4747",
      color: "#ffffff",
      borderColor: "#EB5757",
    },
  },
}))(Button);

export const OutlinedButton: React.FC = (props) => {
  return (
    <ColorButton variant="outlined" color="primary">
      {props.children}
    </ColorButton>
  );
};
