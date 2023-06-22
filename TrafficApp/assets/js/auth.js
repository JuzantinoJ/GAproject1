import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

const userSignup = async (
  signUserName,
  signUserEmail,
  signUserPassword,
  signUserPasswordCheck
) => {
  const signUpName = signUserName.value;
  const signUpEmail = signUserEmail.value;
  const signUpPassword = signUserPassword.value;
  const signUpPasswordCheck = signUserPasswordCheck.value;

  if (signUpPassword === signUpPasswordCheck) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        signUpEmail,
        signUpPassword
      );
      const user = userCredential.user;

      // Set the user's display name
      await updateProfile(user, { displayName: signUpName });

      console.log(user);
      console.log(user.displayName);
      alert("Your account has been created!");

      // Redirect the user to the dashboard or another page
      window.location.href = "dashboard.html";
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  } else {
    // Display error message or indication that passwords do not match
    const passwordError = document.querySelector("#passwordError");
    passwordError.textContent = "Passwords do not match";
    passwordError.style.color = "red";
  }
};

const userSignIn = async (logUserEmail, logUserPassword) => {
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
    }
  });
};
// Export the necessary functions, objects, or variables
export { userSignup, userSignIn, checkAuthState };
