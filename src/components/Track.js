import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './Fbase'
import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";
import { useNavigate } from "react-router-dom";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'right', headerAlign: "center" },
    { field: 'user_name', headerName: '작성자', width: 150, align: 'right', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', width: 90, align: 'right', headerAlign: "center" },
];

const Track = () => {
    const webgazer = window.webgazer; // webgazer instance
    const [open, setOpen] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [selectionModel, setSelectionModel] = useState();
    const [email, setEmail] = useState(""); // 유저 이메일
    const [pdfs, setPdfs] = useState(() => []); // 전체 pdf
    const [isTracking, setIsTracking] = useState(false);
    const [imgsUrl, setImgsUrl] = useState([]); // pdf image url 배열
    const [userId, setUserId] = useState(0); // 유저 고유 아이디 값
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    var pageNum = 0; // pdf 현재 페이지
    var dimensionArr = []; // webgazer x, y 좌표가 담길 배열
    const datas = []; // get 받아올 배열
    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchUser = () => {
            try {
                onAuthStateChanged(auth, (user) => {
                    if (user) {
                        setIsLoggedIn(true);
                        setEmail(user.email);
                    } else {
                        setIsLoggedIn(false);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        };

        const fetchData = async () => {
            try {
                const response = await axios.get('http://3.36.95.29:8000/pdf/').then(res => {
                    if (res.status === 200){
                        setPdfs(res.data);
                        setIsLoading(false);
                    } else {
                        setIsLoading(true);
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
        
        fetchUser();
        fetchData();
    }, []);

    const onClickTrack = async () => {
        setIsTracking(true);
        const response = await axios.get('http://3.36.95.29:8000/pdf/search', {
            params: {
                pdf_id : selectionModel[0]
            }
        });
        datas.push(response.data[0]);
        setImgsUrl(datas[0].imgs_url);
        setUserId(datas[0].user_id);
        setPdfId(datas[0].id);
    }

    const onClickLogin = () => {
        setOpen(false);
        navigate("/login");
    };

    const onClickStart = () => {
        webgazer.setGazeListener(function (data) {
            if (data == null) {
                return;
            }
            dimensionArr.push([Math.floor(data.x), Math.floor(data.y)]);
        }).begin();
    }

    // webgazer 종료 함수
    const onClickEnd = async () => {
        // 서버에 dataset 보내는 함수
        await axios.post("http://3.36.95.29:8000/eyetracking/", {
            'user_id': "kimc980106@naver.com",
            'owner_id': "kimc980106@naver.com",
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': pdfId,
            'coordinate': dimensionArr
        });
        dimensionArr = [];
        webgazer.end();
        webgazer.showPredictionPoints(false);
        window.location.reload();
        setIsTracking(false);
    }

    const onClickBack = () => {
        window.location.replace("upload");
    }

    // Before swipe slide, post data to server
    const onSlideChange = async () => {
        await axios.post("http://3.36.95.29:8000/eyetracking/", {
            'user_id': "kimc980106@naver.com",
            'owner_id': "kimc980106@naver.com",
            'rating_time': '00:00:00',
            'page_number': pageNum,
            'pdf_id': pdfId,
            'coordinate': dimensionArr,
        }).then();
        dimensionArr = [];
    }

    // After swipe silde, update pageNum
    const onSlideChanged = (e) => {
        pageNum = e.item;
    }
    
    if (!isLoggedIn) return (
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
                    {"Did You Logged In?"}
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

    if(isLoading) return (
        <Box
            sx={{
                width: '100vw',
                height: '100vh',
                background: '#ecebe9',
                flexGrow: 1,
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <CircularProgress size={300} style={{ marginTop: "15%" }} />
            </div>
        </Box>
    )

    if(isTracking) return (
        <>
            <Box
                sx={{
                    width: '100vw',
                    height: '100vh',
                    display: 'column',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Grid container columns={{ xs: 12, sm: 12, md: 12 }} style={{ textAlign: "center" }}>
                    <Grid item xs={12}>
                        <AliceCarousel
                            animationDuration={1}
                            keyboardNavigation={true}
                            onSlideChange={onSlideChange}
                            onSlideChanged={onSlideChanged}
                            disableButtonsControls={true}
                        >
                            {/* <img src="/img/s.png" style={{ width: "100%", height: 500 }}> 
                            </img>
                            <img src="/img/example2.png" style={{ width: "100%", height: 500 }}> 
                            </img> */}
                            {imgsUrl && imgsUrl.map((e, index) => (
                                <img key={index} src={e} style={{ width: "90%", height: "80vh" }} />

                            ))} 
                        </AliceCarousel>
                        <Button onClick={onClickStart}>
                            Start
                        </Button>
                        <Button onClick={onClickEnd}>
                            End
                        </Button>
                        <Button onClick={onClickBack}>
                            Back
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </>
    )

    else return (
        <>
            <Button style={{marginTop: 100, marginLeft: 100}} onClick={onClickTrack}>
                CONTINUE
            </Button>
            <div style={{ height: 400, width: '80%', margin: "auto" }}>
                <DataGrid
                    rows={pdfs}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                    onSelectionModelChange={(newSelectionModel) => {
                        setSelectionModel(newSelectionModel);
                        console.log(newSelectionModel)
                    }}
                    selectionModel={selectionModel}
                    style={{align: "center"}}
                />
            </div>
        </>
    )
}

export default Track;