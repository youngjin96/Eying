import { useEffect, useState } from "react";

import { Box, Grid, Typography, Button } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import axios from 'axios';

import AliceCarousel from 'react-alice-carousel';
import "react-alice-carousel/lib/alice-carousel.css";

import { onAuthStateChanged, deleteUser } from "firebase/auth";

import Loading from "./Loading";
import IsLoggedIn from "./IsLoggedIn";
import { auth } from './Fbase'

const columns = [
    { field: 'pdf_name', headerName: '제목', flex: 1, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'right', headerAlign: "center" },
    { field: 'upload_at', headerName: '등록일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'deadline', headerName: '마감일', width: 160, align: 'right', headerAlign: "center" },
    { field: 'views', headerName: '조회수', width: 90, align: 'right', headerAlign: "center" },
]
    ;
const stepTwoColumns = [
    { field: 'user_name', headerName: '평가자', flex: 1, width: 150, align: 'center', headerAlign: "center" },
    { field: 'job_field', headerName: '업종', width: 150, align: 'center', headerAlign: "center" },
    { field: 'job', headerName: '직업', width: 150, align: 'center', headerAlign: "center" },
    { field: 'position', headerName: '계급', width: 150, align: 'center', headerAlign: "center" },
    { field: 'gender', headerName: '성별', width: 160, align: 'center', headerAlign: "center" },
    { field: 'create_date', headerName: '날짜', width: 160, align: 'center', headerAlign: "center" },
];

const Mypage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [step, setStep] = useState(1);

    const user = auth.currentUser;
    const [value, setValue] = useState(0);
    const [userEmail, setUserEmail] = useState("");
    const [visualType, setVisualType] = useState("distribution");
    const [firstPdfs, setFirstPdfs] = useState([]); // 첫 번째 pdfs
    const [secondPdfs, setSecondPdfs] = useState([]); // 두 번째 pdfs
    const [showedPdfs, setShowedPdfs] = useState([]); // 테이블에 보여줄 pdfs
    const [trackedImages, setTrackedImages] = useState("");
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
            setStep(1);
            axios.get('http://3.39.228.6:8000/pdf/search/', {
                params: {
                    email: userEmail,
                    view: true
                }
            }).then(res => {
                setFirstPdfs(res.data);
                setShowedPdfs(res.data);
                setIsLoading(false);
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
                        <Typography component={'div'}>{children}</Typography>
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
        // PDF를 선택하지 않고 continue 버튼 눌렀을 때
        if (selectionModel === undefined || selectionModel.length === 0) {
            return alert("PDF를 선택해주세요");
        }
        // PDF 선택 후 continue 버튼 눌렀을 때
        else {
            // 첫 번째 step에서 continue 눌렀을 때
            if (step === 1) {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('http://3.39.228.6:8000/eyetracking/user/', {
                    params: {
                        pdf_id: pdfId,
                        page_number: 1
                    }
                }).then(res => {
                    setSecondPdfs(res.data);
                    setShowedPdfs(res.data);
                    setIsLoading(false);
                })
            }
            // 두 번째 step에서 continue 눌렀을 때 
            else {
                setIsLoading(true);
                setStep(step + 1);
                axios.get('http://3.39.228.6:8000/eyetracking/visualization/', {
                    params: {
                        pdf_id: pdfId,
                        visual_type: visualType
                    }
                }).then(res => {
                    setTrackedImages(res.data.visual_img);
                    setIsLoading(false);
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

    const onClickMyPdf = () => {
        setStep(1);
        setShowedPdfs(firstPdfs);
    }

    const onClickVisualType = () => {
        setIsLoading(true);
        var type = "";
        if (visualType === "distribution") {
            setVisualType("flow");
            type = "flow";
        }
        else {
            setVisualType("distribution");
            type = "distribution";
        }
        axios.get('http://3.39.228.6:8000/eyetracking/visualization/', {
            params: {
                pdf_id: pdfId,
                visual_type: type
            }
        }).then(res => {
            setTrackedImages(res.data.visual_img);
            setIsLoading(false);
        })
    }


    // 로그인 안 됐을 때 보여줄 화면
    if (!isLoggedIn) return (
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
                        <Tab label="내 PDF" {...a11yProps(1)} onClick={onClickMyPdf} />
                        <Tab label="회원 탈퇴" {...a11yProps(2)} />
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {userEmail}
                    </TabPanel>
                    <TabPanel value={value} index={1} style={{ textAlign: "center", width: "90%" }}>
                        {isLoading ? (
                            <Loading />
                        ) : (
                                step === 1 ? (
                                    <>
                                        <div style={{ height: 630, width: '80%', margin: "auto" }}>
                                            <DataGrid
                                                rows={showedPdfs}
                                                columns={columns}
                                                pageSize={10}
                                                rowsPerPageOptions={[10]}
                                                selectionModel={selectionModel}
                                                onSelectionModelChange={(newSelectionModel) => {
                                                    setSelectionModel(newSelectionModel);
                                                }}
                                                onCellClick={(params, event) => {

                                                    console.log(event);
                                                    console.log(params);
                                                    setPdfId(params.row.id);
                                                }}
                                                style={{ align: "center" }}
                                            />
                                        </div>
                                        <Button size="large" onClick={onClickContinue} style={{ color: "black" }}>
                                            NEXT
                                        </Button>
                                    </>
                                ) : (
                                        step === 2 ? (
                                            <>
                                                <div style={{ height: 630, width: '80%', margin: "auto" }}>
                                                    <DataGrid
                                                        rows={showedPdfs}
                                                        columns={stepTwoColumns}
                                                        pageSize={10}
                                                        rowsPerPageOptions={[10]}
                                                        selectionModel={selectionModel}
                                                        onSelectionModelChange={(newSelectionModel) => {
                                                            setSelectionModel(newSelectionModel);
                                                        }}
                                                        onCellClick={(params) => {
                                                            console.log(params);
                                                            setPdfId(params.row.id);
                                                        }}
                                                        style={{ align: "center" }}
                                                    />
                                                </div>
                                                <Button size="large" onClick={onClickBack} style={{ color: "black" }}>
                                                    BACK
                                                </Button>
                                                <Button size="large" onClick={onClickContinue} style={{ color: "black" }}>
                                                    NEXT
                                                </Button>
                                            </>
                                        ) : (
                                                <>
                                                    <AliceCarousel
                                                        animationDuration={1}
                                                        keyboardNavigation={true}
                                                        disableButtonsControls={true}
                                                    >
                                                        {trackedImages && trackedImages.map((e, index) => (
                                                            <img
                                                                key={index}
                                                                src={e}
                                                                style={{ width: "80%", height: 500 }}
                                                            />
                                                        ))}
                                                    </AliceCarousel>
                                                    {visualType === "distribution" ? 
                                                        (
                                                            <Button 
                                                                variant="contained"
                                                                size="large"
                                                                onClick={onClickVisualType}
                                                            >
                                                                시선 흐름 보기
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="contained"
                                                                size="large"
                                                                onClick={onClickVisualType}
                                                            >
                                                                분포도 보기
                                                            </Button>
                                                            )
                                                    }
                                                    <Button
                                                        variant="contained"
                                                        size="large"
                                                        onClick={onClickBack}
                                                        style={{marginLeft: 20}}
                                                    >
                                                        BACK
                                                    </Button>
                                                </>
                                            )
                                    )
                            )
                        }
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        <Button onClick={onClickDeleteUser}>회원 탈퇴</Button>
                    </TabPanel>
                </Grid>
            </Box>
        </>
    )
}

export default Mypage;