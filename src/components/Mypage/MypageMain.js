import { Box, Grid, Typography } from "@mui/material";

const MypageMain = () => {
    return (
        <Box
            sx={{
                width: '100%',
                height: '100vh',
                display: 'flex',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <Grid container columns={{ xs: 6, sm: 12, md: 12 }}>
                <Grid item xs={12}>
                    <Typography style={{marginTop: 50}}>
                        마이페이지에 오신것을 환영합니다. <br />
                        이곳에서 정보를 변경할 수 있습니다.
                    </Typography>
                </Grid>
            </Grid>
        </Box>
    )
}

export default MypageMain;