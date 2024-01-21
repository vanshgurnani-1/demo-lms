import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";


 const firebaseConfig = {
  apiKey: "AIzaSyAcs2xOvrcS7O59CuTvf4VrpMVlv20z13M",
  authDomain: "library-management-syste-67773.firebaseapp.com",
  projectId: "library-management-syste-67773",
  storageBucket: "library-management-syste-67773.appspot.com",
  messagingSenderId: "243605710087",
  appId: "1:243605710087:web:4a5c0470a860d2ab2ad1a2",
  measurementId: "G-2HMK0M1NYV",

  // apiKey: "AIzaSyBnqir9I3IQZw4ivVByAlvSvo5F66p5UKs",
  // authDomain: "lmss-fa0e4.firebaseapp.com",
  // projectId: "lmss-fa0e4",
  // storageBucket: "lmss-fa0e4.appspot.com",
  // messagingSenderId: "478696076505",
  // appId: "1:478696076505:web:6e87047379c770071b3ac8",
  // measurementId: "G-8187J0K9FG",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

