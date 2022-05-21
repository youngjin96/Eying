import { useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import { onAuthStateChanged } from "firebase/auth";

import IsLoggedIn from "../Environment/IsLoggedIn";
import ChangeUserInformation from "./ChangeUserInformation";
import UserInformation from "./UserInformation";
import MyPdf from "./MyPdf";
import DeleteUser from "./DeleteUser";
import MypageMain from "./MypageMain";
import { auth } from '../Fbase'

const Mypage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [value, setValue] = useState(0);

    useEffect(() => {
        try {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    setIsLoggedIn(true);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }, []);

    // 사이드 바에서 유저가 선택한 탭 처리 함수
    const handleChange = (event, newValue) => {
        setValue(newValue);
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

    

    // 로그인 안 됐을 때 보여줄 화면
    if (!isLoggedIn) return (
        <IsLoggedIn />
    )

    return (
        <>
            <Box
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    background: '#ecebe9',
                    flexGrow: 1,
                }}
            >
                <Tabs
                    orientation="vertical"
                    variant="scrollable"
                    value={value}
                    onChange={handleChange}
                    aria-label="Vertical tabs example"
                    sx={{ borderRight: 1, borderColor: 'divider' }}
                    style={{width: 100}}
                >
                    <Tab label="마이페이지" {...a11yProps(0)} />
                    <Tab label="내 정보" {...a11yProps(1)} />
                    <Tab label="내 정보 변경" {...a11yProps(2)} />
                    <Tab label="내 PDF" {...a11yProps(3)} />
                    <Tab label="회원 탈퇴" {...a11yProps(4)} />
                </Tabs>
                <TabPanel value={value} index={0} style={{ textAlign: "center", width: "90%" }}>
                    <MypageMain />
                </TabPanel>
                <TabPanel value={value} index={1} style={{ textAlign: "center", width: "90%" }}>
                    <UserInformation />
                </TabPanel>
                <TabPanel value={value} index={2} style={{ textAlign: "center", width: "90%" }}>
                    <ChangeUserInformation />
                </TabPanel>
                <TabPanel value={value} index={3} style={{ textAlign: "center", width: "90%" }}>
                    <MyPdf />
                </TabPanel>
                <TabPanel value={value} index={4}>
                    <DeleteUser />
                </TabPanel>
            </Box>
        </>
    )
}

export default Mypage;