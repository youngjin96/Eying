import { Button, Grid, TextField, Typography, InputLabel, FormControl, OutlinedInput, FormHelperText } from "@mui/material"
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useState, useEffect } from "react";
import { updateEmail, onAuthStateChanged, sendPasswordResetEmail, signOut } from "firebase/auth";
import { auth } from "../Fbase";
import axios from 'axios';
import { useNavigate } from "react-router-dom"

const jobs = ["중학생", "고등학생", "대학생", "직장인"];
const middleHighStudent = ["1학년", "2학년", "3학년"];
const collegeStudent = ["1학년", "2학년", "3학년", "4학년", "졸업예정자", "취준생"];
// 계급 종류
const salary = [
    "인턴",
    "사원",
    "주임",
    "대리",
    "과장",
    "차장",
    "부장",
    "이사",
    "상무",
    "전무",
    "부사장",
    "사장",
    "부회장",
    "회장"
];
// 업계 종류
const jobFields = [
    "Art",
    "Education",
    "Fashion",
    "Food",
    "Insurance",
    "IT",
    "Law",
    "Marketing",
    "Medical",
    "Sports",
    "Student",
    "Other"
];

const ITEM_HEIGHT = 48;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + 8,
            width: 250,
        },
    },
};

var type = null;
var options = null;

const ChangeUserInformation = () => {
    const [userEmail, setUserEmail] = useState("");
    const [userUpdateEmail, setUserUpdateEmail] = useState("")

    const [userName, setUserName] = useState("");
    const [userUpdateName, setUserUpdateName] = useState("");

    const [userJobField, setUserJobField] = useState("");
    const [userUpdateJobField, setUserUpdateJobField] = useState("");

    const [userJob, setUserJob] = useState("");
    const [userUpdateJob, setUserUpdateJob] = useState("");
    
    const [userPosition, setUserPosition] = useState("");
    const [userUpdatePosition, setUserUpdatePosition] = useState("");

    const [userBusinessCard, setUserBusinessCard] = useState("");
    const [isUploadBusinessCard, setIsUploadBusinessCard] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserEmail(user.email);
                axios.get('https://eying.ga/user/search/', {
                    params: {
                        email: user.email
                    }
                }).then(res => {
                    setUserName(res.data[0].username);
                    setUserJobField(res.data[0].job_field);
                    setUserJob(res.data[0].job);
                    setUserPosition(res.data[0].position);
                    setUserBusinessCard(res.data[0].card);
                }).catch((error) => {
                    console.log(error);
                });
            }
        });
    }, []);

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "userUpdateEmail") {
            setUserUpdateEmail(value);
        } else if (name === "userUpdateName") {
            setUserUpdateName(value);
        } else if (name === "userUpdateJobField") {
            setUserUpdateJobField(value);
        } else if (name === "userUpdateJob") {
            setUserUpdateJob(value);
        } else if (name === "userUpdatePosition") {
            setUserUpdatePosition(value);
        }
    }

    const onClickChangeEmail = () => {
        const user = auth.currentUser;
        updateEmail(user, userUpdateEmail).then(() => {
            axios.put('https://eying.ga/user/', {
                email: userEmail,
                new_email: userUpdateEmail
            });
            alert("이메일이 수정되었습니다.");
            setUserEmail(userUpdateEmail);
        }).catch((error) => {
            alert("재로그인 후 시도해주세요.");
            signOut(auth).then(() => {
                navigate("/login")
            }).catch((error) => {
                alert(error.message);
            });
        })
    }

    const onClickChangePassword = () => {
        const user = auth.currentUser;
        if (user) {
            sendPasswordResetEmail(auth, user.email, { url: '/login' }).then(() => {
                alert('회원님의 이메일로 비밀번호 재설정 이메일을 보냈습니다. 비밀번호를 재설정후 다시 로그인해주세요.');
                signOut(auth).then(() => {
                    navigate("/login");
                });
            }).catch((error) => {
                alert(error);
            });
        }
    }

    const onClickChangeUsername = () => {
        axios.put('https://eying.ga/user/', {
            email: userEmail,
            username: userUpdateName 
        }).then(() => {
            alert("이름이 수정되었습니다.");
            setUserName(userUpdateName);
        }).catch(error => {
            console.log(error);
        });
    }

    const onClickChangeUserJobField = () => {
        axios.put('https://eying.ga/user/', {
            email: userEmail, 
            job_field: userUpdateJobField 
        }).then(() => {
            alert("분야가 수정되었습니다.");
            setUserJobField(userUpdateJobField);
        }).catch(error => {
            console.log(error);
        });
    }

    const onClickChangeUserJob = () => {
        axios.put('https://eying.ga/user/', {
            email: userEmail, 
            job: userUpdateJob,
            position: userUpdatePosition
        }).then(() => {
            alert("직업과 계급이 수정되었습니다.");
            setUserJob(userUpdateJob);
            setUserPosition(userUpdatePosition);
        }).catch(error => {
            console.log(error);
        });
    }

    if (userUpdateJob === "중학생" || userUpdateJob === "고등학생") {
        type = middleHighStudent;
    } else if (userUpdateJob === "직장인") {
        type = salary;
    } else if (userUpdateJob === "대학생") {
        type = collegeStudent;
    }

    if (type) {
        options = type.map((el) => (
            <MenuItem
            key={el}
            value={el}
            >
                {el}
            </MenuItem>
        ))
    }

    const onChangeUserBusinessCard = (event) => {
        var userUpdateBusinessCard = event.target.files[0];
        var frm = new FormData();
        frm.append("email", userEmail);
        frm.append("card", userUpdateBusinessCard);
        axios.put('https://eying.ga/user/', frm).then((res) => {
            setIsUploadBusinessCard(true);
            alert("명함이 수정되었습니다.");
        }).catch(error => {
            console.log(error);
        });
    }
    
    return (
        <Grid container columns={{ xs: 6, sm: 12, md: 12 }} rowSpacing={{ xs: 2, sm: 2, md: 2}}>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>이메일</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>{userEmail}</Typography>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    variant="standard"
                    helperText="변경할 이메일 주소를 입력해주세요"
                    name="userUpdateEmail"
                    label="Email"
                    value={userUpdateEmail}
                    onChange={onChange}
                />
            </Grid>
            <Grid item xs={3}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeEmail}
                    style={{ color: "black", borderColor: "#a8a9a8", marginTop: 20 }}
                >
                    변경하기
                </Button>
            </Grid>
            <hr style={{width: "100%", marginTop: 20}} />
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>이름</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>{userName}</Typography>
            </Grid>
            <Grid item xs={3}>
                <TextField
                    variant="standard"
                    name="userUpdateName"
                    label="Name"
                    value={userUpdateName}
                    helperText="변경할 이름을 입력해주세요"
                    onChange={onChange}
                />
            </Grid>
            <Grid item xs={3}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeUsername}
                    style={{ color: "black", borderColor: "#a8a9a8", marginTop : 20 }}
                >
                    변경하기
                </Button>
            </Grid>
            <hr style={{width: "100%", marginTop: 20}} />
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>분야</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>{userJobField}</Typography>
            </Grid>
            <Grid item xs={3}>
                <FormControl style={{ width: "90%" }}>
                    <InputLabel id="job-field-label">Job Field</InputLabel>
                    <Select
                        labelId="job-field-label"
                        id="job-field"
                        name="userUpdateJobField"
                        onChange={onChange}
                        input={<OutlinedInput label="Job_Field" />}
                        MenuProps={MenuProps}
                        defaultValue=""
                    >
                        {jobFields.map((field) => (
                            <MenuItem
                                key={field}
                                value={field}
                            >
                                {field}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeUserJobField}
                    style={{ color: "black", borderColor: "#a8a9a8", marginTop: 10 }}
                >
                    변경하기
                </Button>
            </Grid>
            <hr style={{width: "100%", marginTop: 20}} />
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>직업</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>{userJob}</Typography>
            </Grid>
            <Grid item xs={3}>
                <FormControl style={{ width: "90%" }}>
                    <InputLabel id="demo-multiple-job-label">Job</InputLabel>
                    <Select
                        labelId="demo-multiple-job-label"
                        id="demo-multiple-job"
                        name="userUpdateJob"
                        onChange={onChange}
                        input={<OutlinedInput label="Job" />}
                        MenuProps={MenuProps}
                        defaultValue=""
                    >
                        {jobs.map((job) => (
                            <MenuItem
                                key={job}
                                value={job}
                            >
                                {job}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
            <Grid item xs={3}></Grid>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>계급</Typography>
            </Grid>
            <Grid item xs={3}>
                <Typography style={{marginTop: 20}}>{userPosition}</Typography>
            </Grid>
            <Grid item xs={3}>
                <FormControl style={{ width: "90%" }}>
                    <InputLabel id="demo-multiple-sub-label">Position</InputLabel>
                    <Select
                        labelId="demo-multiple-sub-label"
                        id="demo-multiple-sub"
                        name="userUpdatePosition"
                        onChange={onChange}
                        input={<OutlinedInput label="Sub" />}
                        MenuProps={MenuProps}
                        defaultValue=""
                    >
                        {options}
                    </Select>
                    <FormHelperText>직업을 먼저 선택하세요</FormHelperText>
                </FormControl>
            </Grid>
            <Grid item xs={3}>
                <Button
                    variant="outlined"
                    onClick={onClickChangeUserJob}
                    style={{ color: "black", borderColor: "#a8a9a8", marginTop: 10 }}
                >
                    변경하기
                </Button>
            </Grid>
            <hr style={{width: "100%", marginTop: 20}} />
            {isUploadBusinessCard ? (
                <>
                    <Grid item xs={12}>
                        <Typography>내 정보에 들어가 바뀐 명함을 확인해주세요.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            disabled
                            variant="outlined"
                            component="span"
                            style={{ marginTop: 30}}
                        >
                            업로드 완료
                        </Button>
                    </Grid>
                </>
            ) : (
                <>
                    <Grid item xs={6}>
                        <img src={userBusinessCard} style={{ width: "90%", height: 300 }} />
                    </Grid>
                    <Grid item xs={6}>
                        <>
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="upload-button-file"
                                multiple
                                onChange={onChangeUserBusinessCard}
                            />
                            <label htmlFor="upload-button-file">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    style={{ color: "black", borderColor: "#a8a9a8", marginTop: 30}}
                                >
                                    새 명함 업로드
                                </Button>
                            </label>
                        </>
                    </Grid> 
                </>
            )}
            <hr style={{width: "100%", marginTop: 20}} />
            <Grid item xs={12}>
                <Button
                    variant="outlined"
                    onClick={onClickChangePassword}
                    style={{ color: "black", borderColor: "#a8a9a8" }}
                >
                    비밀번호 재설정
                </Button>
            </Grid>
        </Grid >
    )
}

export default ChangeUserInformation;