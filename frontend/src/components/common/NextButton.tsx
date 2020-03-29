import React from "react";
import { Button } from "@material-ui/core";
import { red, green, blue, grey } from "@material-ui/core/colors";

export const NextButton: React.FC = () => {
  return (
    <Button
      variant="contained"
      color="secondary"
      style={{ backgroundColor: red[400], marginTop: 24, marginBottom: 12 }}
    >
      Next
    </Button>
  );
};
