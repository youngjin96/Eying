import { useState } from 'react';

import { Button, Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import { useNavigate } from 'react-router-dom';

const IsUploading = () => {
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
                    {"업로드 중"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        현재 업로드 중입니다. 컴퓨터 환경에 따라 소요 시간이 길어질 수 있습니다.
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </Box>
    )
}

export default IsUploading;