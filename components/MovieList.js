import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardMedia,
    Pagination,
    Stack,
    CircularProgress,
    Container,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/router";
import axios from "axios";
import XButton from "./XButton"; 
import Image from 'next/image';

const MovieList = ({ onAddNewMovie, onUpdateCurrentMovie }) => {
    const router = useRouter();
    const [moviesList, setMoviesList] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 10,
    });

    const handleGoBack = () => {
        router.back();
    };

    useEffect(() => {
        const getAllMovieList = async () => {
            setLoading(true);
            try {
                const { page, limit } = queryParams;
                const response = await axios.get(
                    `/api/movies?page=${page}&limit=${limit}`
                );
                if (response.data && response.data.data) {
                    setMoviesList(response.data.data);
                    const totalNoOfPages = Math.ceil(
                        response.data.totalCount / queryParams.limit
                    );
                    setTotalPages(totalNoOfPages);
                }
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };
        getAllMovieList();
    }, [queryParams]);

    const handlePageChange = (event, newPage) => {
        setQueryParams((prevParams) => ({
            ...prevParams,
            page: newPage,
        }));
    };

    const editMovie = (movieId) => {
        onUpdateCurrentMovie(movieId);
    };

    const handleLogout = () => {
        router.push("/");
    };

    return moviesList && moviesList.length > 0 ? (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: "#093545",
                minHeight: "100vh",
                position: "relative", 
            }}
        >
            <IconButton
                sx={{ position: "absolute", top: 16, left: 16, color: "#fff" }}
                onClick={handleGoBack}
            >
                <ArrowBackIcon />
            </IconButton>

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "70px",
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            marginRight: 1,
                            fontSize: "40px",
                            fontWeight: "400",
                            color: "#FFFFFF",
                        }}
                    >
                        My Movies
                    </Typography>
                    <IconButton
                        sx={{ color: "#FFFFFF", textAlign: "center" }}
                        onClick={onAddNewMovie}
                    >
                        <AddCircleOutlineIcon />
                    </IconButton>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Typography
                        variant="h6"
                        sx={{
                            marginRight: 1,
                            color: "#FFFFFF",
                            fontSize: "16px",
                            fontWeight: "400",
                        }}
                    >
                        Logout
                    </Typography>
                    <IconButton sx={{ color: "#FFFFFF" }} onClick={handleLogout}>
                        <LogoutIcon />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ paddingX: "70px" }}>
                <Box
                    sx={{
                        display: "grid",
                        gap: 2,
                        gridTemplateColumns: "repeat(5, 1fr)",
                        mb: 2,
                    }}
                >
                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "center",
                                width: "100%",
                            }}
                        >
                            <CircularProgress sx={{ color: "#fff" }} />
                        </Box>
                    ) : (
                        moviesList.map((movie) => (
                            <Card
                                key={movie._id}
                                sx={{
                                    maxWidth: 345,
                                    backgroundColor: "#092C39",
                                    color: "#fff",
                                    borderRadius: "16px",
                                    padding: "8px 8px 16px 8px",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={`http://localhost:3000${movie.poster}`}

                                    onClick={() => editMovie(movie._id)}
                                    alt={movie.title}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        // e.target.src = "/poster_placeholder.png";
                                    }}
                                />
                                <CardContent>
                                    <Typography
                                        sx={{ fontSize: "20px", fontWeight: "500px" }}
                                    >
                                        {movie.title}
                                    </Typography>
                                    <Typography variant="body2" color="#fff">
                                        {movie.year}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </Box>

                <Stack spacing={2} alignItems="center" sx={{ marginY: "40px" }}>
                    <Pagination
                        sx={{
                            "& .Mui-selected": {
                                backgroundColor: "#2BD17E",
                                color: "#fff",
                            },
                        }}
                        count={totalPages}
                        shape="rounded"
                        showFirstButton
                        showLastButton
                        page={queryParams.page}
                        onChange={handlePageChange}
                    />
                </Stack>
            </Box>

           
            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center", 
                }}
            >
                <Image
                    src="/Vector.png"
                    alt="Wave Icon"
                    width={1440}
                    height={100}
                />
            </Box>
        </Box>
    ) : (
        <Box
            sx={{
                backgroundColor: "#093545",
                minHeight: "100vh",
                position: "relative", 
            }}
        >
            <IconButton
                sx={{ position: "absolute", top: 16, left: 16, color: "#fff" }}
                onClick={handleGoBack}
            >
                <ArrowBackIcon />
            </IconButton>
            <Container
                maxWidth="xs"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100vh",
                    width: "100%",
                }}
            >
                <Box sx={{ mb: 2 }}>
                    <Typography
                        variant="h2"
                        gutterBottom
                        sx={{
                            color: "#fff",
                            fontSize: "40px",
                            fontWeight: "500",
                            textAlign: "center",
                            maxWidth: "500px",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Your movie list is empty
                    </Typography>
                </Box>
                <XButton
                    onClick={onAddNewMovie}
                    variant="contained"
                    color="primary"
                    padding="12px 28px 12px 28px"
                    backgroundColor="#2BD17E"
                >
                    Add a New Movie
                </XButton>
            </Container>


            <Box
                sx={{
                    position: "absolute",
                    bottom: 0,
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Image
                    src="/Vector.png"
                    alt="Wave Icon"
                    width={1440}
                    height={100}
                />
            </Box>
        </Box>
    );

};

export default MovieList;
