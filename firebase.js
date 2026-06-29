// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDaN1RNJHZExf_lVUSE3a1qk0MsQQDdmus",
  authDomain: "student-management-4c498.firebaseapp.com",
  databaseURL: "https://student-management-4c498-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "student-management-4c498",
  storageBucket: "student-management-4c498.firebasestorage.app",
  messagingSenderId: "250541681812",
  appId: "1:250541681812:web:2407bd9bd5218e61801881",
  measurementId: "G-LKYVB2Q7D3"
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);

export { db };