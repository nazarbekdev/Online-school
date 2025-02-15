document.addEventListener("DOMContentLoaded", function () {
    const profilePic = document.getElementById("profile-pic");
    const uploadInput = document.getElementById("upload-photo");

    uploadInput.addEventListener("change", function (event) {
        const file = event.target.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePic.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    const saveBtn = document.querySelector(".save-btn");
    const resetBtn = document.querySelector(".reset-btn");

    saveBtn.addEventListener("click", function () {
        alert("Profile saved successfully!");
    });

    resetBtn.addEventListener("click", function () {
        document.getElementById("profile-form").reset();
    });
});
