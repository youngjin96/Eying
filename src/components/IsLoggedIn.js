import { useState } from 'react';

import { Button, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate } from 'react-router-dom';

const IsLoggedIn = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true); // 로그인 안 했을 때 다이얼로그 여는 변수

    // 다이얼로그 안에 로그인 버튼 눌렀을 때 로그인 화면으로 이동
    const onClickLogin = () => {
        setOpen(false);
        navigate("/login");
    };

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
            <Dialog
                open={open}
                onClose={onClickLogin}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"로그인을 잊으셨나요?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        이 페이지는 로그인 후 이용이 가능합니다.
                        로그인 페이지로 가서 로그인해주시기 바랍니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClickLogin} autoFocus>
                        로그인
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default IsLoggedIn;