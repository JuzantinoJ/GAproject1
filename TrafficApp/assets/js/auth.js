// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "",
  authDomain: "authtest-a5a51.firebaseapp.com",
  projectId: "authtest-a5a51",
  storageBucket: "authtest-a5a51.appspot.com",
  messagingSenderId: "595401720478",
  appId: "1:595401720478:web:c01961d8516151707e718f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const userName = document.querySelector("#userName");
const userEmail = document.querySelector("#userEmail");
const userPassword = document.querySelector("#userPassword");
const authForm = document.querySelector("#authForm");
const userNameDisplay = document.querySelector("#userNameDisplay");
const image = document.querySelector("#image");
const map = document.querySelector("#map");
const signUpButton = document.querySelector("#signUpButton");
const signInButton = document.querySelector("#signInButton");
const signOutButton = document.querySelector("#signOutButton");
const container = document.querySelector(".container");

container.style.display = "none";

const userSignup = async () => {
  const signUpName = userName.value;
  const signUpEmail = userEmail.value;
  const signUpPassword = userPassword.value;

  createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
    .then((userCredential) => {
      const user = userCredential.user;

      // Set the user's display name
      updateProfile(user, { displayName: signUpName })
        .then(() => {
          console.log(user);
          alert("Your account has been created!");
        })
        .catch((error) => {
          console.log("Failed to set display name:", error);
        });
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};

const userSignIn = async () => {
  const signInEmail = userEmail.value;
  const signInPassword = userPassword.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Welcome Back!!");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + errorMessage);
      alert("User Not Found");
    });
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authForm.style.display = "none";
      container.style.display = "block";
      // Display the user's name in the HTML
      userNameDisplay.textContent =
        "Hi, " + user.displayName.toUpperCase() + "!";
      console.log(user.displayName);
    } else {
      authForm.style.display = "block";
      container.style.display = "none";
      // Reset the user's name in the HTML
      userNameDisplay.textContent = "";
    }
  });
};

const userSignOut = async () => {
  await signOut(auth);
};

checkAuthState();
signUpButton.addEventListener("click", userSignup);
signInButton.addEventListener("click", userSignIn);
signOutButton.addEventListener("click", userSignOut);
