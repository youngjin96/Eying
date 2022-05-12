import { useState } from "react";

import axios from 'axios';

import { useNavigate } from "react-router-dom"

import { Box, Button, Container, Grid, TextField } from "@mui/material"
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';

import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "./Fbase";

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
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const Enroll = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState("");
    const [userJob, setUserJob] = useState([]);
    const [confirmpassword, setConfirmPassword] = useState("");
    const [position, setPosition] = useState([]);
    const [image, setImage] = useState("");
    const [username, setUsername] = useState("");
    const [fields, setFields] = useState([]);
    const navigate = useNavigate();

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        } else if (name === "age") {
            setAge(value)
        } else if (name === "sex") {
            setSex(event.target.value)
        } else if (name === "confirmpassword") {
            setConfirmPassword(value)
        } else if (name === "username") {
            setUsername(value)
        }
    }

    const onClickEnroll = async () => {
        var enfrm = new FormData();
        enfrm.append("username", username);
        enfrm.append("job_field", fields)
        enfrm.append("email", email);
        enfrm.append("password", password);
        enfrm.append("age", age);
        enfrm.append("gender", sex);
        enfrm.append("job", userJob);
        enfrm.append("position", position);
        enfrm.append('card', image);

        await axios.post('http://3.39.228.6:8000/user/', enfrm).then(() => {
            createUserWithEmailAndPassword(auth, email, password).then(() => {
                alert("정상적으로 회원가입이 완료되었습니다.");
                navigate("/home");
            }).catch(error => {
                alert(error);
            });
        }).catch(error => {
            alert(error.response.data.error_message);
        });
    }

    var type = null;
    var options = null;

    if (userJob === "중학생" || userJob === "고등학생") {
        type = middleHighStudent;
    } else if (userJob === "직장인") {
        type = salary;
    } else if (userJob === "대학생") {
        type = collegeStudent;
    }

    const handleChange = (event) => {
        setUserJob(event.target.value)
    };

    const handleChange2 = (event) => {
        setPosition(event.target.value)
    };

    const handleChange3 = (event) => {
        setFields(event.target.value)
    };

    const onLoadFile = (event) => {
        setImage(event.target.files[0]);
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

    function componentDidMount() {
        // custom rule will have name 'isPasswordMatch'
        ValidatorForm.addValidationRule('isPasswordMatch', (value) => {
            if (value !== password) {
                return false;
            }
            return true;
        });
    }

    const onKeyUp = (event) => {
        if (event.keycode === '9') {
            componentDidMount();
        }
    }

    const onClickBack = () => {
        navigate("/login")
    }

    const handleSubmit = () => {

    }

    const handleSexChange = (event) => {
        setSex(event.target.value);
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{ marginTop: 5, display: 'flex', height: '90vh' }} >
                <ValidatorForm noValidate onSubmit={handleSubmit} component="form" sx={{ mt: 3 }} >
                    <Grid container columns={{ xs: 12, sm: 12, md: 12 }} spacing={2} direction="row" justifyContent="space-between">
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email Address"
                                onChange={onChange}
                                style={{ width: "100%" }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                fullWidth
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                onChange={onChange}
                                validators={['required']}
                                errorMessages={['this field is required']}
                                value={password}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextValidator
                                fullWidth
                                name="confirmpassword"
                                label="Repeat Password"
                                type="password"
                                autoComplete="repeat-password"
                                onChange={onChange}
                                validators={['isPasswordMatch', 'required']}
                                errorMessages={['비밀번호가 일치하지 않습니다.', 'this field is required']}
                                onClick={componentDidMount}
                                onKeyUp={onKeyUp}
                                value={confirmpassword}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="username"
                                label="User Name"
                                autoComplete="usernmae"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="age"
                                label="Age"
                                onChange={onChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="sex-label">Sex</InputLabel>
                                <Select
                                    labelId="sex-label"
                                    id="sex"
                                    value={sex}
                                    label="Sex"
                                    onChange={handleSexChange}
                                >
                                    <MenuItem value={10}>Male</MenuItem>
                                    <MenuItem value={20}>Female</MenuItem>
                                    <MenuItem value={30}>Other</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="job-field-label">Job Field</InputLabel>
                                <Select
                                    labelId="job-field-label"
                                    id="job-field"
                                    value={fields}
                                    onChange={handleChange3}
                                    input={<OutlinedInput label="Job_Field" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
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
                        <Grid item xs={12}>
                            <FormControl style={{ width: "50%" }}>
                                <InputLabel id="demo-multiple-job-label">Job</InputLabel>
                                <Select
                                    labelId="demo-multiple-job-label"
                                    id="demo-multiple-job"
                                    value={userJob}
                                    onChange={handleChange}
                                    input={<OutlinedInput label="Job" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
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
                            <FormControl sx={{ width: "50%" }}>
                                <InputLabel id="demo-multiple-sub-label">Grade</InputLabel>
                                <Select
                                    labelId="demo-multiple-sub-label"
                                    id="demo-multiple-sub"
                                    value={position}
                                    onChange={handleChange2}
                                    input={<OutlinedInput label="Sub" />}
                                    MenuProps={MenuProps}
                                    defaultValue={""}
                                >
                                    {options}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            {image ? (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    disabled
                                >
                                    업로드 완료
                                </Button>
                            ) : (
                                    <>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            style={{ display: 'none' }}
                                            id="upload-button-file"
                                            multiple
                                            onChange={onLoadFile}
                                        />
                                        <label htmlFor="upload-button-file">
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                component="span"
                                                style={{ marginTop: 5, color: "black", borderColor: "#a8a9a8" }}
                                            >
                                                명함 업로드
                                            </Button>
                                        </label>
                                    </>
                                )
                            }
                        </Grid>
                        <Grid item xs={6}>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={onClickBack}
                                style={{ color: "black", borderColor: "#a8a9a8", width: 100 }}
                            >
                                돌아가기
                                </Button>
                        </Grid>
                        <Grid item xs={6} style={{ textAlign: "end" }}>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                onClick={onClickEnroll}
                                style={{ color: "black", borderColor: "#a8a9a8", width: 100 }}
                            >
                                회원가입
                                </Button>
                        </Grid>
                    </Grid>
                </ValidatorForm>
            </Box>
        </Container >
    )
}

export default Enroll;