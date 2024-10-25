import React from "react";
import { Button } from "@mui/material";

function XButton({
  children,
  padding,
  fullWidth,
  onClick,
  backgroundColor,
  border,
}) {
  return (
    <Button
      type="submit"
      onClick={onClick}
      color="primary"
      fullWidth={fullWidth}
      sx={{
        backgroundColor: backgroundColor,
        padding: padding,
        border: border,
        borderRadius: "10px",
        color: "#FFF",
        textTransform: "capitalize",
        "&:hover": {
          backgroundColor: backgroundColor,
          color: "#fff",
        },
      }}
    >
      {children}
    </Button>
  );
}

export default XButton;
