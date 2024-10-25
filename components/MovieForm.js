import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Grid, Card, CardMedia, CardContent, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useDropzone } from 'react-dropzone';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import XCustomTextField from '../components/textinput';
import XButton from '../components/XButton';
import axios from 'axios';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import Image from 'next/image';// Import Image from Next.js

// Styled component for DropZone
const DropZone = {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    cursor: "pointer",
    minHeight: "200px",
    backgroundColor: "#224957",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
};

// Validation schema
const validationSchema = Yup.object({
    title: Yup.string().required("Title is required"),
    year: Yup.number()
        .required("Publishing year is required")
        .min(1900, "Year must be greater than 1900")
        .max(new Date().getFullYear(), "Year cannot be in the future"),
});

export default function MovieForm({ onSave, movieID }) {
    const [imageFile, setImageFile] = useState(null); // Store the selected file
    const [imagePreview, setImagePreview] = useState(''); // Store the preview URL for the selected file
    const [serverImageURL, setServerImageURL] = useState(''); // Store the URL of the image after upload
    const router = useRouter();

    // Dropzone setup
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        multiple: false,
        onDrop: (files) => {
            if (files.length > 0) {
                const file = files[0];
                setImageFile(file);
                setImagePreview(URL.createObjectURL(file)); // Create a URL for the preview
                setServerImageURL(''); // Clear the server URL if a new file is selected
                console.log("Image File Selected:", file); // Debugging log
            }
        },
    });

    const handleSubmit = async (values) => {
        console.log(imageFile, "imageFile");
        
        const movieData = {
            ...values,
            poster: imageFile ? imageFile : imagePreview, // Attach the image file to the data
        };

        const formData = new FormData();
        for (const key in movieData) {
            formData.append(key, movieData[key]); // Append each value to FormData
        }
        console.log("formData", formData, "movieData", movieData)
        try {
            // Determine the endpoint and method based on movieID
            const endpoint = movieID ? `/api/movies/${movieID}` : '/api/movies';
            const method = movieID ? 'put' : 'post';

            const response = await axios[method](endpoint, movieData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Response Data:', response.data); // Inspect the returned data
            if (movieID) {
                // If editing, you might want to update your local state or image URL
                setServerImageURL(response.data.poster); // Assuming the response contains the poster URL
            } else {
                setImagePreview(''); // Clear the image preview after adding a new movie
            }

            onSave(); // Trigger refresh on save
            // router.push('/movies'); // Navigate back to movie list
        } catch (error) {
            console.error('Failed to save movie:', error);
            alert('Failed to save movie. Please try again.'); // Notify the user of the failure
        }
    };

    // Function to fetch movie details
    const fetchMovieDetails = async (setFieldValue) => {
        try {
            const response = await axios.get(`/api/movies/${movieID}`);
            setFieldValue('title', response.data.data.title);
            setFieldValue('year', response.data.data.year);
            setImagePreview(response.data.data.poster); // Assuming the API returns poster URL
        } catch (error) {
            console.error('Failed to fetch movie details:', error);
        }
    };

    return (
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          backgroundColor: "#093545",
          padding: "70px",
          boxSizing: "border-box",
          position: "relative", // This ensures the absolute-positioned image is relative to this container
        }}
      >
        <IconButton
          sx={{ position: "absolute", top: 16, left: 16, color: "#fff" }}
          onClick={() => onSave()}
        >
          <ArrowBackIcon />
        </IconButton>
      
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: "#FFFFFF", marginBottom: "56px" }}
        >
          {movieID ? "Edit" : "Create a New Movie"}
        </Typography>
      
        <Grid container spacing={2}>
          <Grid item xs={12} md={5}>
            {/* Image Dropzone */}
            <Box {...getRootProps()} sx={DropZone}>
              <input {...getInputProps()} />
              <FileDownloadIcon fontSize="large" sx={{ color: "#FFFFFF" }} />
              <Typography variant="h6" gutterBottom sx={{ color: "#FFFFFF" }}>
                Drag an image here
              </Typography>
            </Box>
      
            {/* Show Image Preview Before Upload or Server Image URL After Upload */}
            {(imagePreview || serverImageURL) && (
              <Card sx={{ marginTop: 2 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={serverImageURL || imagePreview} // Show server URL after upload, else show preview
                  alt="Selected"
                />
                <CardContent>
                  <Typography variant="subtitle1">
                    {imageFile?.name || "Uploaded image"}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
      
          <Grid item xs={12} md={6}>
            <Formik
              initialValues={{
                title: "",
                year: "",
              }}
              validationSchema={validationSchema}
              onSubmit={(values) => {
                console.log("Form Values:", values); // Verify form values are populated
                handleSubmit(values); // Pass form values to handleSubmit
              }}
            >
              {({ errors, touched, setFieldValue }) => {
                useEffect(() => {
                  if (movieID) {
                    fetchMovieDetails(setFieldValue); // Fetch the details with setFieldValue
                  }
                }, [movieID]);
      
                return (
                  <Form>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Field
                        as={XCustomTextField}
                        name="title"
                        placeholder="Title"
                        width="342px"
                        backgroundColor="#224957"
                        textColor="#FFF"
                      />
                      {errors.title && touched.title ? <div>{errors.title}</div> : null}
      
                      <Field
                        as={XCustomTextField}
                        name="year"
                        placeholder="Publishing Year"
                        type="number"
                        width="241px"
                        backgroundColor="#224957"
                        textColor="#FFF"
                      />
                      {errors.year && touched.year ? <div>{errors.year}</div> : null}
      
                      <Box sx={{ display: "flex", gap: 2, marginTop: "40px" }}>
                        <XButton
                          type="button"
                          variant="outlined"
                          color="#fff"
                          border="1px solid #fff"
                          padding="8px 28px 8px 28px"
                          onClick={() => onSave()}
                        >
                          Cancel
                        </XButton>
                        <XButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          padding="8px 28px 8px 28px"
                          backgroundColor="#2BD17E"
                        >
                          Submit
                        </XButton>
                      </Box>
                    </Box>
                  </Form>
                );
              }}
            </Formik>
          </Grid>
        </Grid>
      
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            right:"0%",
            display: "flex",
            justifyContent: "center", // This will horizontally center the image
            alignItems: "center", // Vertically center the image if needed
          }}
        >
          <Image
            src="/Vector.png" // Make sure the path is correct
            alt="Wave Icon"
            width={1440} // Adjust width based on design
            height={100} // Adjust height based on design
          />
        </Box>
      </Box>
      
      
    );
}
