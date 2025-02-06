const forms = document.querySelector(".forms"),
  pwShowHide = document.querySelectorAll(".eye-icon"),
  links = document.querySelectorAll(".link");
// Add click event listener to each eye icon for toggling password visibility
pwShowHide.forEach(eyeIcon => {
  eyeIcon.addEventListener("click", () => {
    let pwFields = eyeIcon.parentElement.parentElement.querySelectorAll(".password");
    pwFields.forEach(password => {
      if (password.type === "password") { // If password is hidden
        password.type = "text"; // Show password
        eyeIcon.classList.replace("bx-hide", "bx-show"); // Change icon to show state
        return;
      }
      password.type = "password"; // Hide password
      eyeIcon.classList.replace("bx-show", "bx-hide"); // Change icon to hide state
    });
  });
});
// Add click event listener to each link to toggle between forms
links.forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault(); // Prevent default link behavior
    forms.classList.toggle("show-signup");
  });
});

document.addEventListener("DOMContentLoaded", function() {
  const roleSelect = document.getElementById("role");
  const talabaFields = document.getElementById("talaba-fields");
  const oqituvchiFields = document.getElementById("oqituvchi-fields");

  function toggleFields() {
    if (roleSelect.value === "talaba") {
      talabaFields.style.display = "block";
      oqituvchiFields.style.display = "none";
    } else {
      talabaFields.style.display = "none";
      oqituvchiFields.style.display = "block";
    }
  }

  roleSelect.addEventListener("change", toggleFields);
  toggleFields(); // Boshlang‘ich holatni to‘g‘rilash
});

  