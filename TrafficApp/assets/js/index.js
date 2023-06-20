import { userSignup, userSignIn, checkAuthState } from "./auth.js";

// Event listeners
document.getElementById("signInButton").addEventListener("click", userSignIn);
document.getElementById("signUpButton").addEventListener("click", userSignup);

// Check if user is already authenticated
checkAuthState();
