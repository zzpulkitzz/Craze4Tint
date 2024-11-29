import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyD3AWLH7wYyVy7USofDvCLmiE3_u0q4RPo",
    authDomain: "craze4tint-d7bed.firebaseapp.com",
    projectId: "craze4tint-d7bed",
    storageBucket: "craze4tint-d7bed.appspot.com",
    messagingSenderId: "786218460338",
    appId: "1:786218460338:web:02df030c31eb0f5863d5ab",
    measurementId: "G-X1J18V9CZW"
  };

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;