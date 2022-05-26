import { Box } from "@mui/material";
import "./css-loader.css";

const IsLoading = () => {
    return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                display: 'column',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <div className="loader loader-default is-active"></div>
        </Box>
    )
}

export default IsLoading;