import React, { useState } from 'react';
import { Box, Button, createTheme, Grid, IconButton, TextField, ThemeProvider, Typography } from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import axios from 'axios';

const Gallery = () => {
    const font = "'Roboto', sans-serif";
    const theme = createTheme({
        typography: {
            fontFamily: font,
            button: {
                textTransform: "none"
            },
        }
    });

    const [name, setName] = useState("");
    const [email,setEmail] = useState("");
    const [phoneNumber,setPhoneNumber] = useState("");
    const [content,setContent] = useState("");

    const onChange = (event) => {
        const { target: { id, value } } = event;
        if (id === "name") {
            setName(value)
        } else if (id === "email") {
            setEmail(value)
        } else if (id === "phoneNumber") {
            setPhoneNumber(value)
        } else if (id === "content") {
            setContent(value)
        }
    }

    const onClickSubmit = async () => {
        try{
            await axios.post("http://3.38.104.20:8000/cs/", {
            'name': name,
            'email': email,
            'phoneNumber': phoneNumber,
            'content': content,
            });
            alert("접수가 완료됐습니다.");
            window.location.reload();
        } catch (error){
            alert("접수하지 못했습니다.");
        }
        
    }

    return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: "100%",
                    flexGrow: 1,
                }}
            >
                <ThemeProvider theme={theme}>
                    <Grid container columns={{ xs: 6, sm: 6, md: 12 }} style={{ color: "#636261" }}>
                        <Grid item xs={6}>
                            <Typography variant="h5" style={{ marginTop: 100, marginLeft: 100 }}>
                                N o t i c e
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: 10, marginLeft: 100 }}>
                                Please Know Our Information
                            </Typography>
                            <Typography variant="body1" style={{ marginTop: 100, marginLeft: 100 }}>
                                [Address]
                            </Typography>
                            <Typography variant="body2" style={{ marginLeft: 100 }}>
                                77, Jeongneung-ro, Seongbuk-gu, Seoul, Republic of Korea
                            </Typography>
                            <Typography variant="body1" style={{ marginTop: 60, marginLeft: 100 }}>
                                [Tel / Fax]
                            </Typography>
                            <Typography variant="body2" style={{ marginLeft: 100 }}>
                                Tel : +82 (02) 1234 5678 / Fax : +82 (02) 1234 5678
                            </Typography>
                            <Typography variant="body1" style={{ marginTop: 60, marginLeft: 100 }}>
                                [E-mail]
                            </Typography>
                            <Typography variant="body2" style={{ marginLeft: 100 }}>
                                eying@eying.com
                            </Typography>
                            <IconButton style={{ color: "#636261", marginTop: 60, marginLeft: 90 }}>
                                <FacebookIcon fontSize="middle" />
                            </IconButton>
                            <IconButton style={{ color: "#636261", marginTop: 60, marginLeft: 10 }}>
                                <InstagramIcon fontSize="middle" />
                            </IconButton>
                            <IconButton style={{ color: "#636261", marginTop: 60, marginLeft: 10 }}>
                                <TwitterIcon fontSize="middle" />
                            </IconButton>
                        </Grid>
                        <Grid container direction="column" item xs={6}>
                            <Typography variant="h5" style={{ marginTop: 100, marginLeft: 100 }}>
                                C o n t a c t
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: 10, marginLeft: 100 }}>
                                Please Write Your Information To Contact Us
                            </Typography>
                            <TextField
                                id="name"
                                label="Name"
                                variant="standard"
                                style={{ marginTop: 80, width: "40%", marginLeft: 100 }}
                                onChange={onChange}
                            />
                            <TextField
                                id="email"
                                label="Email"
                                variant="standard"
                                style={{ marginTop: 60, width: "40%", marginLeft: 100 }}
                                onChange={onChange}
                            />
                            <TextField
                                id="phoneNumber"
                                label="Phone Number"
                                variant="standard"
                                style={{ marginTop: 60, width: "40%", marginLeft: 100 }}
                                onChange={onChange}
                            />
                            <TextField
                                id="content"
                                label="Content"
                                multiline
                                rows={4}
                                style={{ marginTop: 60, width: "40%", marginLeft: 100 }}
                                onChange={onChange}
                            />
                            <Button 
                                variant="contained" 
                                style={{ marginTop: 20, width: "40%", backgroundColor: "#8b7758", marginLeft: 100 }}
                                onClick={onClickSubmit}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </Box>
        </>
    )
}

export default Gallery;