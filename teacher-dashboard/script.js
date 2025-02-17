// Sinf qo'shish
function openClassModal() {
    document.getElementById("classModal").style.display = "flex";
}

function closeClassModal() {
    document.getElementById("classModal").style.display = "none";
}

function addSelectedClass() {
    let select = document.getElementById("classSelectModal");
    let className = select.value;
    
    if (className) {
        let classList = document.getElementById("class-list");
        let li = document.createElement("li");
        li.textContent = className;
        classList.appendChild(li);
        closeClassModal();
    } else {
        alert("Iltimos, sinfni tanlang!");
    }
}

document.addEventListener("DOMContentLoaded", function () {
    let classSelect = document.getElementById("classSelectModal");
    
    classSelect.addEventListener("change", function () {
        console.log("Tanlangan sinf:", this.value);
    });
});

document.querySelectorAll('.class-item').forEach(item => {
    item.addEventListener('click', () => {
        const className = item.dataset.class;
        window.location.href = `class.html?class=${className}`;
    });
});

// Material yuklash
function toggleMaterialForm() {
    document.getElementById("material-form").classList.toggle("hidden");
}

function toggleTestForm() {
    document.getElementById("test-form").classList.toggle("hidden");
}

function uploadMaterial() {
    let classSelectValue = document.getElementById("classSelect").value;
    let topic = document.getElementById("topicInput").value.trim();
    let lectureFile = document.getElementById("lectureFile").files[0];
    let presentationFile = document.getElementById("presentationFile").files[0];
    let testFile = document.getElementById("testFile").files[0];
    let videoLink = document.getElementById("videoLink").value.trim();

    if (!classSelectValue || !topic || !lectureFile, !testFile) {
        alert("Iltimos, barcha kerakli maydonlarni to‘ldiring!");
        return;
    }

    let materialList = document.getElementById("material-list");
    let li = document.createElement("li");

    let content = `<strong>${classSelectValue} - ${topic}</strong>: ${lectureFile.name}`;
    if (presentationFile) content += ` | ${presentationFile.name}`;
    if (testFile) content += ` | ${testFile.name}`;
    if (videoLink) content += ` | <a href="${videoLink}" target="_blank">Video</a>`;

    li.innerHTML = content;
    materialList.appendChild(li);

    alert("Material yuklandi!");

    // Formani tozalash
    document.getElementById("classSelect").value = "";
    document.getElementById("topicInput").value = "";
    document.getElementById("lectureFile").value = "";
    document.getElementById("presentationFile").value = "";
    document.getElementById("videoLink").value = "";

    document.getElementById("material-form").classList.add("hidden");
}
// Test yuklash
function uploadTest() {
    let classSelect = document.getElementById("testClassSelect").value;
    let quarterSelect = document.getElementById("quarterSelect").value;
    let testFile = document.getElementById("testFile").files[0];

    if (!classSelect || !quarterSelect || !testFile) {
        alert("Iltimos, barcha maydonlarni to‘ldiring!");
        return;
    }

    let materialList = document.getElementById("material-list");
    let li = document.createElement("li");

    li.innerHTML = `<strong>${classSelect} - ${quarterSelect} Test</strong>: ${testFile.name}`;
    materialList.appendChild(li);

    alert("Test yuklandi!");

    // Formani tozalash
    document.getElementById("testClassSelect").value = "";
    document.getElementById("quarterSelect").value = "";
    document.getElementById("testFile").value = "";

    document.getElementById("test-form").classList.add("hidden");
}