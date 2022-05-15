// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCmHkLf65oUr8GSfVMSy84oJgrGY62mr-c",
    authDomain: "capstone-test2.firebaseapp.com",
    projectId: "capstone-test2",
    storageBucket: "capstone-test2.appspot.com",
    messagingSenderId: "121305375535",
    appId: "1:121305375535:web:39195cc69c608e384db7da",
    measurementId: "G-MF99J30PM8"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const auth = getAuth();




