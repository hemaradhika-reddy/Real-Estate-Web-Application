// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAAC4UdPwIrPqKXOS-VLJkIAcQhcToQT6M",
  authDomain: "real-estate-e20d9.firebaseapp.com",
  projectId: "real-estate-e20d9",
  storageBucket:"real-estate-e20d9.firebasestorage.app",
  messagingSenderId: "16994263070",
  appId: "1:16994263070:web:4bf28b9f39c5ec0b6b8e0f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// export const db = getFirestore(app)
