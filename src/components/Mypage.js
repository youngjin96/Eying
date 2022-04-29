import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from './Fbase'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';


const Mypage = () => {
    const [value, setValue] = useState(0);
    const [email, setEmail] = useState("");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // TODO email = user.email;
                setEmail(user.email);
            } else {
                window.location.replace("login");
                alert("You Need Login To Use This Service.");
            }
        })
        
    }, []);

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
                <Grid container columns={{ xs: 3, sm: 6, md: 12 }} style={{marginTop: 50}}>
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
                    </Tabs>
                    <TabPanel value={value} index={0}>
                        {email}
                    </TabPanel>
                    <TabPanel value={value} index={1} style={{textAlign: "center", width: "90%"}}>
                        <img src="/img/s.png" style={{ width: "60%", height: 500, minWidth: 500 }} />
                    </TabPanel>
                    <TabPanel value={value} index={2}>
                        Item Three
                        </TabPanel>
                    <TabPanel value={value} index={3}>
                        Item Four
                        </TabPanel>
                    <TabPanel value={value} index={4}>
                        Item Five
                        </TabPanel>
                    <TabPanel value={value} index={5}>
                        Item Six
                        </TabPanel>
                    <TabPanel value={value} index={6}>
                        Item Seven
                         </TabPanel>
                </Grid>
            </Box>
        </>
    )
}

export default Mypage;