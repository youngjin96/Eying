import React from 'react';

import { Box, Grid, createTheme, ThemeProvider, Typography } from '@mui/material';

import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Home = () => {
    const font = "'Roboto', sans-serif";
    const theme = createTheme({
        typography: {
            fontFamily: font,
            button: {
                textTransform: "none"
            },
        }
    });

    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: 750,
                    display: 'flex',
                    background: '#e9e4da',
                    flexGrow: 1,
                }}
            >
                <Grid container columns={{ xs: 6, sm: 6, md: 12 }} alignItems="center">
                    <Grid item xs={5} style={{ color: "rgb(121, 121, 121)" }}>
                        <ThemeProvider theme={theme}>
                            <Typography variant="h6" style={{ marginLeft: 20 }}>
                                We Provide
                            </Typography>
                            <Typography variant="h6" style={{ marginLeft: 20 }}>
                                the Gazed Data
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: 30, marginLeft: 20 }}>
                                We Predict People's Gaze On Your PDF
                            </Typography>
                            <Typography variant="body2" style={{ marginLeft: 20 }}>
                                We Will Provide Satisfactory Results In Data
                            </Typography>
                        </ThemeProvider>
                    </Grid>
                    <Grid item xs={7}>
                        <Carousel
                            autoPlay
                            infiniteLoop
                            stopOnHover={false}
                            showThumbs={false}
                            showArrows={false}
                            showStatus={false}
                            transitionTime={2000}
                            interval={3000}
                        >
                            <div>
                                <img src="/img/firstExample.png" style={{ height: 550, width: "95%" }} />
                            </div>
                            <div>
                                <img src="/img/thirdExample.png" style={{ height: 550, width: "95%" }} />
                            </div>
                            <div>
                                <img src="/img/secondExample.png" style={{ height: 550, width: "95%" }} />
                            </div>
                            <div>
                                <img src="/img/fourthExample.png" style={{ height: 550, width: "95%" }} />
                            </div>
                        </Carousel>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Home;