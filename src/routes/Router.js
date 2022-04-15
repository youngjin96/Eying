import { Routes, Route } from 'react-router-dom'
import Home from "../components/Home"
import Login from "../components/Login"
import Contact from "../components/Contact"
import AboutUs from "../components/AboutUs"
import FAQ from "../components/FAQ"
import Upload from "../components/Upload"
import Enroll from "../components/Enroll"
import WebGazer from '../components/WebGazer'
import Track from '../components/Track'
import Mypage from '../components/Mypage'

const Router = () => {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="home" element={<Home />} />
            <Route path="upload" element={<Upload />} />
            <Route path="contact" element={<Contact />} />
            <Route path="about_us" element={<AboutUs />} />
            <Route path="FAQ" element={<FAQ />} />
            <Route path="login" element={<Login />} />
            <Route path="login/enroll" element={<Enroll />} />
            <Route path="/webgazer" element={<WebGazer />} />
            <Route path="/track" element={<Track />} />
            <Route path="/mypage" element={<Mypage />} />
        </Routes>
    );
};

export default Router