import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyCHKfIW16tdVu7QGt8akyUt_XmPP02EL8Y",
    authDomain: "team-website-3ec0e.firebaseapp.com",
    projectId: "team-website-3ec0e",
    storageBucket: "team-website-3ec0e.appspot.com",
    messagingSenderId: "638346576800",
    appId: "1:638346576800:web:452ee79d320700ed1e5ac5",
    measurementId: "G-RQ0441JG2T",
    databaseURL: "https://team-website-3ec0e-default-rtdb.asia-southeast1.firebasedatabase.app/"
  };
  

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, app, database };
