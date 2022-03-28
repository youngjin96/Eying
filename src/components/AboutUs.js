import { Box, Button, Grid, Typography } from '@mui/material';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import React from 'react';

const AboutUs = () => {
    return(
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: '60vh',
                    display: 'flex',
                    background: '#555555',
                    flexGrow: 1,
                    alignItems: "center"
                }}
            >
                <Grid container columns={{ xs: 6, sm: 6, md: 12 }} alignItems="center">
                    <Grid item xs={6} >
                        <Typography variant="h2" style={{color: "white", marginLeft:300}}>
                            We Provide
                        </Typography>
                        <Typography variant="h2" style={{color: "white", marginLeft:300}}>
                            the Predict Data
                        </Typography>
                        <Typography variant="subtitle1" style={{color: "white", marginLeft:300, marginTop:30}}>
                            We Predict People's Gaze On Your PDF
                        </Typography>
                        <Typography variant="subtitle1" style={{color: "white", marginLeft:300}}>
                            We Will Provide Satisfactory Results In Data
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Carousel
                            autoPlay
                            infiniteLoop
                            stopOnHover={false}
                            showThumbs={false}
                            showArrows={false}
                            showStatus={false}
                            transitionTime={1000}
                            interval={2000}
                        >
                            <div>
                                <img src="/img/back.png" style={{ height: 450, width: 700 }} />
                            </div>
                            <div>
                                <img src="/img/example.jpg" style={{ height: 450, width: 700 }} />
                            </div>
                            <div>
                                <img src="/img/example2.png" style={{ height: 450, width: 700 }} />
                            </div>
                        </Carousel>
                    </Grid>
                </Grid>
            </Box>
            <Box
                sx={{
                    width: '100vw',
                    height: '20vh',
                    display: 'flex',
                    
                    flexGrow: 1,
                    alignItems: "center"
                }}
            ></Box>
        </>    
    )
}

export default AboutUs;