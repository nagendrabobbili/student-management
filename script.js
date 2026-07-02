import { db } from "./firebase.js";

import {
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const studentsRef = ref(db, "students");

let students = [];
let editId = null;

// ==============================
// Attendance Calculator
// ==============================

function calculateAttendance(conducted, attended) {

    conducted = Number(conducted) || 0;
    attended = Number(attended) || 0;

    if (conducted === 0) return "0%";

    return ((attended / conducted) * 100).toFixed(2) + "%";

}

// ==============================
// Load Students
// ==============================

function loadStudents(searchText = "") {

    onValue(studentsRef, (snapshot) => {

        students = [];

        const table = document.getElementById("tableBody");

        table.innerHTML = "";

        let total = 0;

        let branches = new Set();

        let attendanceTotal = 0;

        snapshot.forEach((child) => {

            const student = child.val();

            student.id = child.key;

            students.push(student);

        });

        students.forEach((student) => {

            if (

                searchText === "" ||

                (student.name || "")
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||

                (student.roll || "")
                    .toLowerCase()
                    .includes(searchText.toLowerCase()) ||

                (student.department || "")
                    .toLowerCase()
                    .includes(searchText.toLowerCase())

            ) {

                total++;

                branches.add(student.department || "");

                const attendance = calculateAttendance(
                    student.conducted,
                    student.attended
                );

                attendanceTotal += parseFloat(attendance);

                const row = document.createElement("tr");

                row.innerHTML = `

                <td>${student.name}</td>

                <td>${student.roll}</td>

                <td>${student.department || "-"}</td>

                <td>${student.year || "-"}</td>

                <td>${attendance}</td>

                <td>

                    <button
                    class="view-btn"
                    onclick="viewStudent('${student.id}')">

                    View

                    </button>

                    <button
                    class="edit-btn"
                    onclick="editStudent('${student.id}')">

                    Edit

                    </button>

                    <button
                    class="delete-btn"
                    onclick="deleteStudent('${student.id}')">

                    Delete

                    </button>

                </td>

                `;

                table.appendChild(row);

            }

        });

        document.getElementById("totalCount").innerText = total;

        if (document.getElementById("branchCount"))
            document.getElementById("branchCount").innerText =
                branches.size;

        if (document.getElementById("avgAttendance")) {

            document.getElementById("avgAttendance").innerText =
                total === 0
                    ? "0%"
                    : (attendanceTotal / total).toFixed(1) + "%";

        }

    });

}

loadStudents();

// ==============================
// Add Student
// ==============================

window.addStudent = function () {

    const student = {

        name: document.getElementById("name").value.trim(),

        roll: document.getElementById("roll").value.trim(),

        department: document.getElementById("department").value,

        year: document.getElementById("year").value,

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        conducted: Number(
            document.getElementById("conducted").value
        ) || 0,

        attended: Number(
            document.getElementById("attended").value
        ) || 0

    };

    if (

        student.name === "" ||

        student.roll === "" ||

        student.department === "" ||

        student.year === "" ||

        student.email === "" ||

        student.phone === ""

    ) {

        alert("Please fill all fields.");

        return;

    }

    push(studentsRef, student);

    [
        "name",
        "roll",
        "department",
        "year",
        "email",
        "phone",
        "conducted",
        "attended"

    ].forEach(id => {

        document.getElementById(id).value = "";

    });

};
// ==============================
// View Student Profile
// ==============================

window.viewStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    document.getElementById("profilePanel").style.display = "block";

    document.getElementById("pName").innerText =
        student.name || "-";

    document.getElementById("pRoll").innerText =
        student.roll || "-";

    document.getElementById("pDepartment").innerText =
        student.department || "Not Added";

    document.getElementById("pYear").innerText =
        student.year || "Not Added";

    document.getElementById("pEmail").innerText =
        student.email || "Not Added";

    document.getElementById("pPhone").innerText =
        student.phone || "Not Added";

    document.getElementById("pConducted").innerText =
        student.conducted || 0;

    document.getElementById("pAttended").innerText =
        student.attended || 0;

    document.getElementById("pAttendance").innerText =
        calculateAttendance(
            student.conducted,
            student.attended
        );

};

// ==============================
// Close Profile
// ==============================

window.closeProfile = function () {

    document.getElementById("profilePanel").style.display = "none";

};

// ==============================
// Search Student
// ==============================

window.searchStudent = function () {

    const text =
        document.getElementById("search").value.trim();

    loadStudents(text);

};

// ==============================
// Show All Students
// ==============================

window.showAll = function () {

    document.getElementById("search").value = "";

    loadStudents();

};

// ==============================
// Edit Student
// ==============================

window.editStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    editId = id;

    document.getElementById("editName").value =
        student.name || "";

    document.getElementById("editRoll").value =
        student.roll || "";

    document.getElementById("editDepartment").value =
        student.department || "";

    document.getElementById("editYear").value =
        student.year || "";

    document.getElementById("editEmail").value =
        student.email || "";

    document.getElementById("editPhone").value =
        student.phone || "";

    document.getElementById("editConducted").value =
        student.conducted || 0;

    document.getElementById("editAttended").value =
        student.attended || 0;

    updateAttendancePreview();

    document.getElementById("editModal").style.display =
        "block";

};
// ==============================
// Save Edited Student
// ==============================

document.getElementById("saveBtn").addEventListener("click", () => {

    if (!editId) return;

    update(ref(db, "students/" + editId), {

        name: document.getElementById("editName").value.trim(),

        roll: document.getElementById("editRoll").value.trim(),

        department: document.getElementById("editDepartment").value,

        year: document.getElementById("editYear").value,

        email: document.getElementById("editEmail").value.trim(),

        phone: document.getElementById("editPhone").value.trim(),

        conducted: Number(
            document.getElementById("editConducted").value
        ) || 0,

        attended: Number(
            document.getElementById("editAttended").value
        ) || 0

    });

    closeModal();

});

// ==============================
// Close Modal
// ==============================

window.closeModal = function () {

    document.getElementById("editModal").style.display = "none";

    editId = null;

};

// ==============================
// Delete Student
// ==============================

window.deleteStudent = function (id) {

    if (!confirm("Delete this student?"))
        return;

    remove(ref(db, "students/" + id));

};

// ==============================
// Attendance Preview
// ==============================

function updateAttendancePreview() {

    const conducted = Number(
        document.getElementById("editConducted").value
    ) || 0;

    const attended = Number(
        document.getElementById("editAttended").value
    ) || 0;

    document.getElementById("attendancePreview").innerText =
        "Attendance : " +
        calculateAttendance(conducted, attended);

}

document
.getElementById("editConducted")
.addEventListener("input", updateAttendancePreview);

document
.getElementById("editAttended")
.addEventListener("input", updateAttendancePreview);

// ==============================
// Close Modal When Clicking Outside
// ==============================

window.onclick = function (event) {

    const modal =
        document.getElementById("editModal");

    if (event.target === modal) {

        closeModal();

    }

};

// ==============================
// Dashboard Refresh
// ==============================

function refreshDashboard() {

    document.getElementById("totalCount").innerText =
        students.length;

    if (document.getElementById("branchCount")) {

        const branches = new Set();

        students.forEach(student => {

            if (student.department)
                branches.add(student.department);

        });

        document.getElementById("branchCount").innerText =
            branches.size;

    }

    if (document.getElementById("avgAttendance")) {

        let total = 0;

        students.forEach(student => {

            total += parseFloat(
                calculateAttendance(
                    student.conducted,
                    student.attended
                )
            );

        });

        document.getElementById("avgAttendance").innerText =

            students.length === 0

                ? "0%"

                : (total / students.length).toFixed(1) + "%";

    }

}

setInterval(refreshDashboard, 1000);