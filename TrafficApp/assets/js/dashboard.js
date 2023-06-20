import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { auth } from "./firebase-config.js";

const userNameDisplay = document.querySelector("#userNameDisplay");
const signOutButton = document.querySelector("#signOutButton");

onAuthStateChanged(auth, (user) => {
  if (user) {
    // Delay updating the user's name by a short period to allow time for it to be retrieved
    setTimeout(() => {
      // Display the user's name in the HTML
      userNameDisplay.textContent =
        "Hi, " + user.displayName.toUpperCase() + "!";
    }, 500);
    console.log(user.displayName);
  } else {
    window.location.href = "index.html";
  }
});

async function signOut() {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error.code, error.message);
  }
}

signOutButton.addEventListener("click", signOut);
