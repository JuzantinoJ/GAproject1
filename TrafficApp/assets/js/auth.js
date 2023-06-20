import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

const logUserEmail = document.querySelector("#logUserEmail");
const logUserPassword = document.querySelector("#logUserPassword");
const signUserName = document.querySelector("#signUserName");
const signUserEmail = document.querySelector("#signUserEmail");
const signUserPassword = document.querySelector("#signUserPassword");
const signUserPasswordCheck = document.querySelector("#signUserPasswordCheck");

const userSignup = async () => {
  const signUpName = signUserName.value;
  const signUpEmail = signUserEmail.value;
  const signUpPassword = signUserPassword.value;
  const signUpPasswordCheck = signUserPasswordCheck.value;

  if (signUpPassword === signUpPasswordCheck) {
    createUserWithEmailAndPassword(auth, signUpEmail, signUpPassword)
      .then((userCredential) => {
        const user = userCredential.user;

        // Set the user's display name
        updateProfile(user, { displayName: signUpName })
          .then(() => {
            console.log(user);
            console.log(user.displayName);
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
  } else {
    // Display error message or indication that passwords do not match
    const passwordError = document.querySelector("#passwordError");
    passwordError.textContent = "Passwords do not match";
    passwordError.style.color = "red";
  }
};

const userSignIn = async () => {
  const signInEmail = logUserEmail.value;
  const signInPassword = logUserPassword.value;
  signInWithEmailAndPassword(auth, signInEmail, signInPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      alert("Welcome Back!!");
    })
    .catch((error) => {
      console.log(error.code, error.message);
      alert("User Not Found");
    });
};

const checkAuthState = async () => {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = "dashboard.html";
    } else {
      // User is not authenticated
      // alert("Please log in to access the dashboard.");
    }
  });
};
// Export the necessary functions, objects, or variables
export { userSignup, userSignIn, checkAuthState };
