import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

const firebaseConfig = {
  // Your Firebase configuration
  apiKey: "AIzaSyBn42E3OAg5Yx5s5vUefh-EKNt8PswEkpg",
  authDomain: "authtest-a5a51.firebaseapp.com",
  projectId: "authtest-a5a51",
  storageBucket: "authtest-a5a51.appspot.com",
  messagingSenderId: "595401720478",
  appId: "1:595401720478:web:c01961d8516151707e718f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
