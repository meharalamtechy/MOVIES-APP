import React from "react";
import { TextField } from "@mui/material";
import { useField } from "formik";

function XCustomTextField({
  label,
  backgroundColor,
  placeholder,
  textColor,
  width,
  ...props
}) {
  const [field, meta] = useField(props);

  return (
    <TextField
      {...field}
      {...props}
      variant="outlined"
      margin="normal"
      fullWidth
      placeholder={placeholder}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
      sx={{
        width:width,
        borderRadius: "20px",
        "& .MuiInputBase-root": {
          backgroundColor: backgroundColor || "transparent",
          color: textColor || "inherit",
          borderRadius: "10px",
          height: "50px",
        },
        "& .MuiOutlinedInput-root": {
          "&:hover fieldset": {
            borderColor: "transparent",
          },
          "&.Mui-focused fieldset": {
            borderColor: "transparent",
          },
        },
        "& .MuiFormLabel-root": {
          color: textColor || "inherit",
        },
      }}
    />
  );
}

export default XCustomTextField;
