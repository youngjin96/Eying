import { Box, Grid, Typography } from "@mui/material";

const Mypage = () => {
    
    return(
        <>
            <Box
                sx={{
                    marginTop: 4,
                    width: '100%',
                    height: '100%',
                    display: 'column',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Grid container columns={{ xs: 3, sm: 6, md: 12 }}>
                    <Grid item xs={3} style={{ textAlign: "center", alignItems: "center" }}>
                        <Typography>
                            hi
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}

export default Mypage;