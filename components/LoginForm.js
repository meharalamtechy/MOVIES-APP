import { useState } from 'react';
import { useRouter } from 'next/router';
import React from "react";
import {
  Container,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Image from 'next/image';
import XCustomTextField from "../components/textinput/index";
import XButton from "../components/XButton/index";

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
});

export default function LoginForm() {
  const router = useRouter();

 
  const handleSubmit = async (values) => {
    const { email, password } = values;
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const result = await response.json();
  
      if (result.success) {
        console.log(result.message);
        router.push('/movies');  
      } else {
        console.log('Login failed:', result.message);
        alert(result.message);
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  };
  
  

  return (

<Box sx={{ backgroundColor: "#093545", position: "relative", height: "100vh" }}>
  <Container
    maxWidth="xs"
    sx={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "calc(100vh - 100px)", 
    }}
  >
    <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h1"
            gutterBottom
            sx={{ color: "#fff", fontSize: "64px", fontWeight: "500" }}
          >
            Sign In
          </Typography>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ values, handleChange, errors, touched }) => (
              <Form>
                <XCustomTextField
                  name="email"
                  label="Email"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  margin="normal"
                  fullWidth
                  backgroundColor="#224957"
                  textColor="#FFF"
                  value={values.email}
                  onChange={handleChange}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                />
                <XCustomTextField
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  autoComplete="current-password"
                  margin="normal"
                  fullWidth
                  backgroundColor="#224957"
                  textColor="#FFF"
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="rememberMe"
                        color="primary"
                        checked={values.rememberMe}
                        onChange={handleChange}
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "#224957",
                          },
                          "&.Mui-checked .MuiSvgIcon-root": {
                            color: "#224957",
                          },
                        }}
                      />
                    }
                    label="Remember Me"
                    sx={{ color: "#fff" }}
                  />
                </Box>

                <XButton
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  padding="12px 126px 12px 126px"
                  backgroundColor="#2BD17E"
                >
                  Login
                </XButton>
              </Form>
            )}
          </Formik>
        </Box>
  </Container>


  <Box
    sx={{
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
    }}
  >
    <Image
      src="/Vector.png" 
      alt="Wave"
      width={1440} 
      height={150} 
      objectFit="cover" 
    />
  </Box>
</Box>

  );
}
