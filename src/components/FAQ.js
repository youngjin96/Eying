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
    const [userEmail, setUserEmail] = useState("");
    const [isClickedFaq, setIsClickedFaq] = useState(false);
    const [faqs, setFaqs] = useState([]);

    useEffect(() => {
        axios.get('https://eying.ga/cs/search/', {
            params: {
                isFAQ : true
            }
        }).then(res => {
            console.log(res);
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
                    width: '100vw',
                    height: "100%",
                    flexGrow: 1,
                }}
            >
                <ThemeProvider theme={theme}>
                    <Grid container columns={{ xs: 12, sm: 12, md: 12 }} style={{ color: "#636261" }}>
                        <Grid item xs={12} style={{ textAlign: "center" }}>
                            <Typography variant="h5" style={{ marginTop: 100 }}>
                                F A Q
                            </Typography>
                            <Typography variant="body2" style={{ marginTop: 10 }}>
                                Please Let Me Know What Do You Want
                            </Typography>
                            {isClickedFaq ? (
                                <>
                                    <Button onClick={onClickBack}>
                                        돌아가기
                                    </Button>
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
                                                console.log(params);
                                            }}
                                        />
                                    </div>
                                </>
                            )}
                        </Grid>   
                    </Grid>
                </ThemeProvider>
            </Box>
        </>
    )
}

export default Service_center;