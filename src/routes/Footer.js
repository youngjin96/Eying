import { Typography } from "@mui/material";
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';

const Footer = () => {
    const font = "'Roboto', sans-serif";
    const theme = createTheme({
        typography: {
          fontFamily: font,
          button: {
            textTransform: "none"
          }
        }
    });
    return (
        <footer style={{ backgroundColor: "#3e3e3e" }}>
            <ThemeProvider theme={theme}>
                <Typography variant="h5" sx={{ color: "white" }} gutterBottom>
                    Group 44
                    </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Something here to give the footer a purpose!
                    </Typography>
                <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
                    Something here to give the footer a purpose!
                    </Typography>
            </ThemeProvider>
        </footer>
    )
}

export default Footer;