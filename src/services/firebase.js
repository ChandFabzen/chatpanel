
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    // apiKey: "AIzaSyAy4jOBMJnj3WZzLz7_rybpAZuwodkxYBo",
    // authDomain: "realtimechat-5c3ea.firebaseapp.com",
    // databaseURL: "https://realtimechat-5c3ea-default-rtdb.firebaseio.com",
    // projectId: "realtimechat-5c3ea",
    // storageBucket: "realtimechat-5c3ea.appspot.com",
    // messagingSenderId: "206530283633",
    // appId: "1:206530283633:web:41b8c1b40276b4572ff3d0",
    // measurementId: "G-GMZ4H7R7EL"
    apiKey: "AIzaSyAAMl96xIgNBFSzGnsV9m6ZW1oatLxt-eY",
    authDomain: "fir-realtimemessaging-17af2.firebaseapp.com",
    databaseURL: "https://fir-realtimemessaging-17af2-default-rtdb.firebaseio.com",
    projectId: "fir-realtimemessaging-17af2",
    storageBucket: "fir-realtimemessaging-17af2.appspot.com",
    messagingSenderId: "170560053402",
    appId: "1:170560053402:web:d737905d20639b7d207f23",
    measurementId: "G-JMSZJDG8PC"
  };
  
  // Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth() 
export const db = getDatabase(app);



