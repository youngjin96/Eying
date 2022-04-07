import { createTheme, Grid, ThemeProvider, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import * as React from 'react';


const Footer = () => {
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
        <footer style={{ clear: "both", zIndex: 1, height: "-3em", position: "relative", width: "100%", background: "#515251", marginTop: 50 }}>
            <ThemeProvider theme={theme}>
                <Grid container columns={{ xs: 6, sm: 6, md: 12 }}>
                    <Grid item xs={6}>
                        <Typography variant="h4" style={{ marginLeft: 10, marginTop: 40 }}>
                            <Link to="home" style={{ textDecoration: 'none', textTransform: 'none', color: 'white' }}>
                                EYING
                            </Link>
                        </Typography>
                        <Typography variant="body2" style={{ marginLeft: 10, color: "#b2b2b2" }}>
                            ⓒ 2022 EYING
                        </Typography>
                        <Typography variant="body2" style={{ marginLeft: 10, marginTop: 20, color: "#898a89" }}>
                            Tel. 000-0000-0000 | Fax. 00-0000-0000 | eying@eying.com
                        </Typography>
                        <Typography variant="body2" style={{ marginLeft: 10, color: "#898a89" }}>
                            Seoul, Korea ㅣ Biz License 000-00-00000
                        </Typography>
                        <Typography variant="body2" style={{ marginLeft: 10, color: "#898a89" }}>
                            Hosting by Eying
                        </Typography>
                    </Grid>
                    <Grid container justifyContent="flex-end" item xs={6}>
                        <Typography style={{ marginTop: 40, marginRight:50 }}>
                            <Link to="about_us" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                ABOUT US
                            </Link>
                        </Typography>
                        <Typography style={{ marginLeft: 10, marginTop: 40, marginRight:50 }}>
                            <Link to="upload" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                UPLOAD
                            </Link>
                        </Typography>
                        <Typography style={{ marginLeft: 10, marginTop: 40, marginRight:50 }}>
                            <Link to="contact" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                CONTACT
                            </Link>
                        </Typography>
                        <Typography style={{ marginLeft: 10, marginTop: 40, marginRight:50 }}>
                            <Link to="track" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                TRACK
                            </Link>
                        </Typography>
                        <Typography style={{ marginLeft: 10, marginTop: 40, marginRight:50 }}>
                            <Link to="FAQ" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                FAQ
                            </Link>
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <hr style={{borderColor: "#898a89", width: "95%", marginTop: 30}} />
                    </Grid>
                    <Grid container justifyContent="flex-end" item xs={12}>
                        <Typography style={{ marginTop: 10, marginRight:20 }}>
                            <Link to="service_center" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                Terms of Use
                            </Link>
                        </Typography>
                        <Typography style={{ marginTop: 10, marginRight:20, color: "#b2b2b2"}}>
                            |
                        </Typography>
                        <Typography style={{ marginTop: 10, marginRight:50 }}>
                            <Link to="service_center" style={{ textDecoration: 'none', textTransform: 'none', color: "#b2b2b2" }}>
                                Privacy
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </ThemeProvider>
        </footer>
    )
}

export default Footer;