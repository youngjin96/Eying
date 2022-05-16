import { Button, Box, createTheme, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, ThemeProvider, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';

const Service_center = () => {
    const font = "'Roboto', sans-serif";
    const theme = createTheme({
        typography: {
            fontFamily: font,
            button: {
                textTransform: "none"
            },
        }
    });

    function createData(number, title, writer, time, view) {
        return { number, title, writer, time, view };
    }

    const rows = [
        createData(3, "I forgot my password", "Peter", "2022-04-03", 42),
        createData(2, "How can I use service", "Kevin", "2022-04-01", 69),
        createData(1, "Is it work with pptx type file", "Harry", "2022-03-23", 146),
    ];

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
                        <Grid item xs={12}>
                            <Typography variant="h5" style={{ textAlign: "center", marginTop: 100 }}>
                                F A Q
                            </Typography>
                            <Typography variant="body2" style={{ textAlign: "center", marginTop: 10 }}>
                                Please Let Me Know What Do You Want
                            </Typography>
                            <TableContainer
                                component={Paper}
                                sx={{
                                    width: "60%",
                                    margin: '30px auto',
                                    marginTop: 10,
                                    borderTop: '1px solid black'
                                }}
                            >
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width="5%" align="center">No</TableCell>
                                            <TableCell width="55%" align="center">제목</TableCell>
                                            <TableCell width="10%" align="center">작성자</TableCell>
                                            <TableCell width="20%" align="center">작성시간</TableCell>
                                            <TableCell width="10%" align="center">조회수</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {rows.map((row) => (
                                            <TableRow
                                                key={row.number}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                    align="center"
                                                >
                                                    {row.number}
                                                </TableCell>
                                                <TableCell align="left">{row.title}</TableCell>
                                                <TableCell align="center">{row.writer}</TableCell>
                                                <TableCell align="center">{row.time}</TableCell>
                                                <TableCell align="center">{row.view}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        <Grid container direction="row" columns={{ xs: 12, sm: 12, md: 12 }}>
                            <Grid item xs={8} style={{ textAlign:"center"}}>
                                <FormControl sx={{ m: 1, width: '40%' }} variant="standard">
                                    <InputLabel>Search</InputLabel>
                                    <Input
                                        id="standard-adornment-password"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
                                                    <SearchIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={4} >
                                <Button
                                    variant="contained" 
                                    style={{ backgroundColor: "#8b7758", marginTop: 20}}
                                >
                                        글쓰기
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </ThemeProvider>
            </Box>
        </>
    )
}

export default Service_center;