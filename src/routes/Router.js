import { Routes, Route } from 'react-router-dom'
import Home from "../components/Home"
import Login from "../components/Login"
import Contact from "../components/Contact"
import AboutUs from "../components/AboutUs"
import Service_center from "../components/Service_center"
import Upload from "../components/Upload"
import Enroll from "../components/Enroll"
import WebGazer from '../components/WebGazer'

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about_us" element={<AboutUs />} />
            <Route path="service_center" element={<Service_center />} />
            <Route path="login" element={<Login />} />
            <Route path="login/enroll" element={<Enroll />} />
            <Route path="/webgazer" element={<WebGazer />} />
        </Routes>
    );
};

export default Router