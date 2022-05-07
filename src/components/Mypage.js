import { useEffect, useState } from "react";

import { Box, Grid, Typography, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import axios from 'axios';

import { onAuthStateChanged, deleteUser } from "firebase/auth";

import Loading from "./Loading";
import IsLoggedIn from "./IsLoggedIn";
import { auth } from './Fbase'

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'right', headerAlign: "center" },
    { field: 'user_name', headerName: '작성자', width: 150, align: 'right', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', width: 90, align: 'right', headerAlign: "center" },
];

const Mypage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [step, setStep] = useState(1);

    const user = auth.currentUser;
    const [value, setValue] = useState(0);
    const [userEmail, setUserEmail] = useState("");
    const [trackedEmail, setTrackedEmail] = useState("");
    const [visualType, setVisualType] = useState("");
    const [firstPdfs, setFirstPdfs] = useState([]); // 첫 번째 pdfs
    const [secondPdfs, setSecondPdfs] = useState([]); // 두 번째 pdfs
    const [showedPdfs, setShowedPdfs] = useState([]); // 테이블에 보여줄 pdfs
    const [pdfId, setPdfId] = useState(0); // pdf 고유 아이디 값
    const [selectionModel, setSelectionModel] = useState();

    useEffect(() => {
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setUserEmail(user.email);
                    setIsLoggedIn(true);
                    setIsLoading(false);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    // 사이드 바에서 유저가 선택한 탭 처리 함수
    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (newValue === 1) {
            setIsLoading(true);
            axios.get('http://3.36.117.66:8000/eyetracking/pdf/', {
                params: {
                    user_email: userEmail
                }
            }).then(res => {
                if (res.status === 200) {
                    console.log(res.status);
                    setFirstPdfs(res.data);
                    setShowedPdfs(res.data);
                    setIsLoading(false);
                }
            })
        } else if (newValue === 2) {

        }
    };

    function TabPanel(props) {
        const { children, value, index, ...other } = props;

        return (
            <div
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
                {...other}
            >
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    const onClickContinue = () => {
        if (selectionModel === undefined) {
            return alert("PDF를 선택해주세요");
        } else if (selectionModel.length === 0) {
            return alert("PDF를 선택해주세요");
        } else {
            if (step === 1) {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('http://3.36.117.66:8000/eyetracking/user/', {
                    params: {
                        pdf_id: pdfId,
                        page_number: 1
                    }
                }).then(res => {
                    if (res.status === 200) {
                        console.log(res.status);
                        console.log(res.data.user_email);
                        setSecondPdfs(res.data);
                        setShowedPdfs(res.data);
                        setIsLoading(false);
                    }
                })
            } else {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('http://3.36.117.66:8000/eyetracking/visualization/', {
                    params: {
                        user_email: trackedEmail,
                        owner_email: userEmail,
                        pdf_id: pdfId,
                        visual_type: visualType
                    }
                }).then(res => {
                    if (res.status === 200) {
                        console.log(res.status);
                        setSecondPdfs(res.data);
                        setShowedPdfs(res.data);
                        setIsLoading(false);
                    }
                })
            }
        }
    }

    const onClickDeleteUser = () => {
        deleteUser(user).then(() => {
            // User deleted.
        }).catch((error) => {
            // An error ocurred
            // ...
        });
    }
    const onClickBack = () => {
        if (step === 1) {
            setStep(1);
        } else if (step === 2) {
            setStep(step - 1);
            setShowedPdfs(firstPdfs);
        } else {
            setStep(step - 1);
            setShowedPdfs(secondPdfs);
        }
    }
    // 로딩 중일 때 보여줄 화면
    if (isLoading) return (
        <Loading />
    )

    // 로그인 안 됐을 때 보여줄 화면
    else if (!isLoggedIn) return (
        <IsLoggedIn />
    )

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100vh',
                    display: 'flex',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Grid container columns={{ xs: 3, sm: 6, md: 12 }} style={{ marginTop: 50 }}>
                    <Tabs
                        orientation="vertical"
                        variant="scrollable"
                        value={value}
                        onChange={handleChange}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <Tab label="회원정보 변경" {...a11yProps(0)} />
                        <Tab label="내 PDF" {...a11yProps(1)} />
                        <Tab label="회원 탈퇴" {...a11yProps(2)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {userEmail}
                    </TabPanel>
                    <TabPanel value={value} index={1} style={{ textAlign: "center", width: "90%" }}>
                        {step < 3 ? (
                            <>
                                <div style={{ height: 400, width: '80%', margin: "auto" }}>
                                    <DataGrid
                                        rows={showedPdfs}
                                        columns={columns}
                                        pageSize={5}
                                        rowsPerPageOptions={[5]}
                                        onSelectionModelChange={(newSelectionModel) => {
                                            setSelectionModel(newSelectionModel);
                                        }}
                                        onCellClick={(params) => {
                                            console.log(params);
                                            setPdfId(params.row.id);
                                        }}
                                        selectionModel={selectionModel}
                                        style={{ align: "center" }}
                                    />
                                </div>
                                <Button onClick={onClickContinue} style={{ color: "black" }}>
                                    CONTINUE
                                </Button>
                                {step === 1 ? (
                                    <>
                                    </>
                                ) : (
                                    <Button onClick={onClickBack} style={{ color: "black" }}>
                                        BACK
                                    </Button>
                                )}
                            </>
                        ) : (
                            <>
                            </>
                        )}
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Button onClick={onClickDeleteUser}>
                            회원 탈퇴
                        </Button>
                    </TabPanel>
                </Grid>
            </Box>
        </>
    )
}

export default Mypage;