import React, { useEffect, useState } from 'react';

import axios from 'axios';

import { Button, Box, createTheme, Grid, ThemeProvider, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const font = "'Roboto', sans-serif";
const theme = createTheme({
    typography: {
        fontFamily: font,
        button: {
            textTransform: "none"
        },
    }
});

const columns = [
    { field: 'id', headerName: '번호', flex: 0.2, align: 'center', headerAlign: "center" },
    { field: 'title', headerName: '제목', flex: 2, align: 'center', headerAlign: "center" },
    { field: 'name', headerName: '작성자', flex: 0.7, align: 'center', headerAlign: "center" },
    { field: 'created_at', headerName: '등록일', flex: 0.5, align: 'right', headerAlign: "center" },
];

const Service_center = () => {
    const [isClickedFaq, setIsClickedFaq] = useState(false);
    const [faqs, setFaqs] = useState([]);
    const [title, setTitle] = useState("");
    const [writer, setWriter] = useState("");
    const [uploadDate, setUploadDate] = useState("");
    const [content, setContent] = useState("");

    useEffect(() => {
        axios.get('https://eying.ga/cs/search/', {
            params: {
                isFAQ : true
            }
        }).then(res => {
            setFaqs(res.data);
        });
    }, []);

    const onClickBack = () => {
        setIsClickedFaq(false);
    }

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: "100%",
                    flexGrow: 1,
                }}
            >
                <ThemeProvider theme={theme}>
                    <Grid container columns={{ xs: 6, sm: 6, md: 12 }} style={{ color: "#636261" }}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Typography variant="h5" style={{ marginTop: 100 }}>
                                F A Q
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: 10 }}>
                                Please Let Me Know What Do You Want
                            </Typography>
                        </Grid>
                            {isClickedFaq ? (
                                <>
                                    <Grid item xs={6} style={{ marginTop: 60, textAlign: "center" }}>
                                        <Typography>제목 : {title}</Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{ marginTop: 60, textAlign: "center" } }>
                                        <Typography>작성자 : {writer}</Typography>
                                    </Grid>
                                    <Grid item xs={3} style={{ marginTop: 60, textAlign: "center" }}>
                                        <Typography>등록일 : {uploadDate}</Typography>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={12} style={{ marginTop: 60, marginLeft: "14%" }}>
                                        <Typography>{content}</Typography>
                                    </Grid>
                                    <Grid item xs={12} style={{ marginTop: 50, textAlign: "center" }}>
                                        <Button 
                                            variant="outlined"
                                            onClick={onClickBack}
                                            style={{ color: "black", borderColor: "#a8a9a8" }}
                                        >
                                            돌아가기
                                        </Button>
                                    </Grid>
                                    
                                </>
                            ) : (
                                <>
                                    <div style={{ height: 430, width: '80%', margin: "auto", marginTop: 50 }}>
                                        <DataGrid
                                            rows={faqs}
                                            columns={columns}
                                            pageSize={6}
                                            rowsPerPageOptions={[6]}
                                            onCellClick={(params) => {
                                                setIsClickedFaq(true);
                                                setTitle(params.row.title);
                                                setWriter(params.row.name);
                                                setContent(params.row.content);
                                                setUploadDate(params.row.created_at);
                                                console.log(params);
                                            }}
                                        />
                                    </div>
                                </>
                            )}   
                    </Grid>
                </ThemeProvider>
            </Box>
        </>
    )
}

export default Service_center;