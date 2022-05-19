import React from 'react';

import { Box, createTheme, Grid, IconButton, ThemeProvider, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';

const AboutUs = () => {
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
                    height: '100%',
                    display: 'flex',
                    flexGrow: 1,
                }}
            >
                <ThemeProvider theme={theme}>
                    <Grid container columns={{ xs: 3, sm: 6, md: 12 }} justifyContent="space-around">
                        <Grid item xs={12} style={{ color: "#636261", marginTop: 80, textAlign: "center" }}>
                            <Typography variant="h5">
                                Who We Are
                            </Typography>
                            <hr style={{ width: "85%", marginTop: 20 }} />
                        </Grid>
                        <Grid item xs={3} style={{ textAlign: "center", marginTop: 100 }}>
                            <img src="/img/1.png" style={{ width: 200, height: 200 }} />
                            <Typography style={{ color: "#636261" }}>
                                Song YoungJin
                            </Typography>
                            <Typography variant="caption" style={{ color: "#636261" }}>
                                sssk03016@naver.com
                            </Typography>
                        </Grid>
                        <Grid item xs={3} style={{ textAlign: "center", marginTop: 100 }}>
                            <img src="/img/2.png" style={{ width: 200, height: 200 }} />
                            <Typography style={{ color: "#636261" }}>
                                Kim ChangGyu
                            </Typography>
                            <Typography variant="caption" style={{ color: "#636261" }}>
                                kimc980106@naver.com
                            </Typography>
                        </Grid>
                        <Grid item xs={3} style={{ textAlign: "center", marginTop: 100 }}>
                            <img src="/img/3.png" style={{ width: 200, height: 200 }} />
                            <Typography style={{ color: "#636261" }}>
                                Chae JiYun
                            </Typography>
                            <Typography variant="caption" style={{ color: "#636261" }}>
                                cjy3378@kookmin.ac.kr
                            </Typography>
                        </Grid>
                        <Grid item xs={3} style={{ textAlign: "center", marginTop: 100 }}>
                            <img src="/img/4.png" style={{ width: 200, height: 200 }} />
                            <Typography style={{ color: "#636261" }}>
                                Ko DongHun
                            </Typography>
                            <Typography variant="caption" style={{ color: "#636261" }}>
                                kdhkdh0101@kookmin.ac.kr
                            </Typography>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </Box>
            <Box
                sx={{
                    width: '100vw',
                    height: '100%',
                    display: 'column',
                    background: "#ecebe9",
                    flexGrow: 1,
                    marginTop: 20
                }}
            >
                <ThemeProvider theme={theme}>
                    <Grid container columns={{ xs: 3, sm: 6, md: 12 }}>
                        <Grid item xs={12} style={{ height: 150 }}>
                            <ThemeProvider theme={theme}>
                                <Typography variant="h5" style={{ textAlign: "center", color: "#636261", marginTop: 80 }}>
                                    A d d r e s s
                                </Typography>
                            </ThemeProvider>
                        </Grid>
                        <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                            <img src="/img/location.png" style={{ width: "70%", height: 500 }} />
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center", marginTop: 20 }}>
                            <Typography variant="caption" style={{ color: "#636261", marginTop: 10 }}>
                                77, Jeongneung-ro, Seongbuk-gu, Seoul, Republic of Korea
                            </Typography>
                        </Grid>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Typography variant="caption" style={{ color: "#636261" }}>
                                Tel. 070-1234-5647  |  Fax. 02-1234-5678  |  kookmin@kookmin.com
                            </Typography>
                        </Grid>
                        <Grid container direction="row" justifyContent="center" alignItems="center" style={{ textAlign: "center", marginTop: 30, marginBottom: 20 }}>
                            <IconButton style={{ color: "#636261" }}>
                                <FacebookIcon fontSize="large" />
                            </IconButton>
                            <IconButton style={{ color: "#636261", marginLeft: 20 }}>
                                <InstagramIcon fontSize="large" />
                            </IconButton>
                            <IconButton style={{ color: "#636261", marginLeft: 20 }}>
                                <TwitterIcon fontSize="large" />
                            </IconButton>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </Box>
        </>
    )
}

export default AboutUs;