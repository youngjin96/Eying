import { useState } from "react";

import axios from 'axios';

import { useNavigate } from "react-router-dom"

import { Box, Button, Grid, TextField } from "@mui/material"
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

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

// Select style
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 48 * 4.5 + 8,
            width: 250,
        },
    },
};

const Enroll = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [username, setUsername] = useState("");
    const [age, setAge] = useState(0);
    const [sex, setSex] = useState("");
    const [fields, setFields] = useState("");
    const [userJob, setUserJob] = useState("");
    const [position, setPosition] = useState("");
    const [image, setImage] = useState(""); // 명함 이미지
    const navigate = useNavigate();

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value)
        } else if (name === "password") {
            setPassword(value)
        } else if (name === "repeatPassword") {
            setRepeatPassword(value)
        } else if (name === "username") {
            setUsername(value)
        } else if (name === "age") {
            setAge(value)
        } else if (name === "sex") {
            setSex(value)
        } else if (name === "jobField") {
            setFields(value)
        } else if (name === "job") {
            setUserJob(value)
        } else if (name === "position") {
            setPosition(value)
        }
    }

    // 회원가입 버튼 눌렀을 때 함수
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

        await axios.post('http://13.124.148.91:8000/user/', enfrm).then(() => {
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

    const onLoadFile = (event) => {
        setImage(event.target.files[0]);
    }

    const onClickBack = () => {
        navigate("/login")
    }

    return (
        <Box
            sx={{ marginTop: 5, display: 'flex', height: '90vh' }}
        >
            <Grid
                container
                columns={{ xs: 12, sm: 12, md: 12 }}
                spacing={2}
                direction="row"
                justifyContent="space-between"
                style={{ textAlign: "center" }}
            >
                <Grid item xs={12}>
                    <TextField
                        name="email"
                        label="Email-Address"
                        onChange={onChange}
                        style={{ width: "40%" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="password"
                        label="Password"
                        type="password"
                        onChange={onChange}
                        value={password}
                        style={{ width: "40%" }}
                    />
                </Grid>
                <Grid item xs={12} >
                    {password === repeatPassword ? (
                        <TextField
                            name="repeatPassword"
                            label="Repeat Password"
                            type="password"
                            onChange={onChange}
                            style={{ width: "40%" }}
                        />
                    ) : (
                        repeatPassword === "" ? (
                            <TextField
                                name="repeatPassword"
                                label="Repeat Password"
                                type="password"
                                onChange={onChange}
                                style={{ width: "40%" }}
                            />
                        ) : (
                            <TextField
                                error
                                name="repeatPassword"
                                label="Repeat Password"
                                type="password"
                                helperText="비밀번호가 일치하지 않습니다."
                                onChange={onChange}
                                style={{ width: "40%" }}
                            />
                            )
                        )
                    }
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="username"
                        label="User Name"
                        autoComplete="usernmae"
                        onChange={onChange}
                        style={{ width: "40%" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        name="age"
                        label="Age"
                        onChange={onChange}
                        style={{ width: "40%" }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <FormControl style={{ width: "40%" }}>
                        <InputLabel id="sex-label">Sex</InputLabel>
                        <Select
                            labelId="sex-label"
                            name="sex"
                            id="sex"
                            value={sex}
                            label="Sex"
                            onChange={onChange}
                        >
                            <MenuItem value={"Male"}>Male</MenuItem>
                            <MenuItem value={"Female"}>Female</MenuItem>
                            <MenuItem value={"Other"}>Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl style={{ width: "40%" }}>
                        <InputLabel id="job-field-label">Job Field</InputLabel>
                        <Select
                            labelId="job-field-label"
                            id="job-field"
                            name="jobField"
                            value={fields}
                            onChange={onChange}
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
                    <FormControl style={{ width: "20%" }}>
                        <InputLabel id="job-label">Job</InputLabel>
                        <Select
                            labelId="job-label"
                            id="job"
                            name="job"
                            value={userJob}
                            onChange={onChange}
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
                    <FormControl sx={{ width: "20%" }}>
                        <InputLabel id="demo-multiple-sub-label">Position</InputLabel>
                        <Select
                            labelId="demo-multiple-sub-label"
                            id="demo-multiple-sub"
                            name="position"
                            value={position}
                            onChange={onChange}
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
                            variant="outlined"
                            disabled
                            style={{ width: "40%" }}
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
                                        variant="outlined"
                                        component="span"
                                        style={{ marginTop: 5, color: "black", borderColor: "#a8a9a8", width: "40%" }}
                                    >
                                        명함 업로드
                                            </Button>
                                </label>
                            </>
                        )
                    }
                </Grid>
                <Grid item xs={6} style={{ textAlign: "end" }}>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={onClickBack}
                        style={{ color: "black", borderColor: "#a8a9a8", width: "15%" }}
                    >
                        돌아가기
                                </Button>
                </Grid>
                <Grid item xs={6} style={{ textAlign: "start" }}>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        onClick={onClickEnroll}
                        style={{ color: "black", borderColor: "#a8a9a8", width: "15%" }}
                    >
                        회원가입
                                </Button>
                </Grid>
            </Grid>
        </Box>
    )
}

export default Enroll;