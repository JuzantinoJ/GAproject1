import { userSignup, userSignIn, checkAuthState } from "./auth.js";

// Event listeners
document.getElementById("signUpButton").addEventListener("click", async (e) => {
  e.preventDefault();

  const signUserName = document.querySelector("#signUserName");
  const signUserEmail = document.querySelector("#signUserEmail");
  const signUserPassword = document.querySelector("#signUserPassword");
  const signUserPasswordCheck = document.querySelector(
    "#signUserPasswordCheck"
  );
  await userSignup(
    signUserName,
    signUserEmail,
    signUserPassword,
    signUserPasswordCheck
  );
});

document.getElementById("signInButton").addEventListener("click", async (e) => {
  e.preventDefault();

  const logUserEmail = document.querySelector("#logUserEmail");
  const logUserPassword = document.querySelector("#logUserPassword");
  await userSignIn(logUserEmail, logUserPassword);
});

// Check if user is already authenticated
checkAuthState();
