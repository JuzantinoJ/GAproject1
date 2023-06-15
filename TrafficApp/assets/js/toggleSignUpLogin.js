const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");

// Password to show when eye-icon is clicked on.
pwShowHide.forEach((eyeIcon) => {
  eyeIcon.addEventListener("click", () => {
    let pwFields =
      eyeIcon.parentElement.parentElement.querySelectorAll(".password");

    pwFields.forEach((password) => {
      if (password.type === "password") {
        password.type = "text";
        eyeIcon.classList.replace("bx-hide", "bx-show"); // font changes from hide to show
        return;
      }
      password.type = "password";
      eyeIcon.classList.replace("bx-show", "bx-hide");
    });
  });
});

links.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault(); // prevent form submit
    forms.classList.toggle("show-signup");
  });
});
