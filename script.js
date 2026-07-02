import { db } from "./firebase.js";

import {
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// =====================================
// Firebase Reference
// =====================================

const studentsRef = ref(db, "students");

let students = [];
let editId = null;

// =====================================
// Attendance Calculator
// =====================================

function calculateAttendance(conducted, attended) {

    conducted = Number(conducted) || 0;
    attended = Number(attended) || 0;

    if (conducted === 0) return "0%";

    return ((attended / conducted) * 100).toFixed(2) + "%";

}

// =====================================
// Dashboard Refresh
// =====================================

function refreshDashboard() {

    document.getElementById("totalCount").innerText =
        students.length;

    const branches = new Set();

    let attendanceTotal = 0;

    students.forEach(student => {

        if (student.department)
            branches.add(student.department);

        attendanceTotal += parseFloat(

            calculateAttendance(
                student.conducted,
                student.attended
            )

        );

    });

    document.getElementById("branchCount").innerText =
        branches.size;

    document.getElementById("avgAttendance").innerText =

        students.length === 0

            ? "0%"

            : (attendanceTotal / students.length).toFixed(1) + "%";

}

// =====================================
// Load Students
// =====================================

function loadStudents(searchText = "") {

    onValue(studentsRef, (snapshot) => {

        students = [];

        const table = document.getElementById("tableBody");

        table.innerHTML = "";

        snapshot.forEach((child) => {

            const student = child.val();

            student.id = child.key;

            students.push(student);

        });

        students.forEach((student) => {

            const keyword = searchText.toLowerCase();

            if (

                searchText === "" ||

                (student.name || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (student.roll || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (student.department || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (student.email || "")
                    .toLowerCase()
                    .includes(keyword) ||

                (student.phone || "")
                    .toLowerCase()
                    .includes(keyword)

            ) {

                const attendance =
                    calculateAttendance(

                        student.conducted,
                        student.attended

                    );

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

        refreshDashboard();

    });

}

// Load Students Automatically

loadStudents();
// =====================================
// Add Student
// =====================================

window.addStudent = function () {

    const student = {

        name: document.getElementById("name").value.trim(),

        roll: document.getElementById("roll").value.trim(),

        department: document.getElementById("department").value,

        year: document.getElementById("year").value,

        email: document.getElementById("email").value.trim(),

        phone: document.getElementById("phone").value.trim(),

        conducted: Number(document.getElementById("conducted").value) || 0,

        attended: Number(document.getElementById("attended").value) || 0

    };

    // ============================
    // Empty Field Validation
    // ============================

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

    // ============================
    // Name Validation
    // ============================

    if (!/^[A-Za-z ]+$/.test(student.name)) {

        alert("Name should contain only letters.");

        return;

    }

    // ============================
    // Email Validation
    // ============================

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(student.email)) {

        alert("Please enter a valid email address.");

        return;

    }

    // ============================
    // Phone Validation
    // ============================

    if (!/^[0-9]{10}$/.test(student.phone)) {

        alert("Phone number must contain exactly 10 digits.");

        return;

    }

    // ============================
    // Attendance Validation
    // ============================

    if (student.conducted < 0 || student.attended < 0) {

        alert("Attendance values cannot be negative.");

        return;

    }

    if (student.attended > student.conducted) {

        alert("Classes attended cannot exceed classes conducted.");

        return;

    }

    // ============================
    // Duplicate Roll Number
    // ============================

    const rollExists = students.some(

        s =>

            s.roll.toLowerCase() ===

            student.roll.toLowerCase()

    );

    if (rollExists) {

        alert("Roll Number already exists.");

        return;

    }

    // ============================
    // Duplicate Email
    // ============================

    const emailExists = students.some(

        s =>

            s.email.toLowerCase() ===

            student.email.toLowerCase()

    );

    if (emailExists) {

        alert("Email already exists.");

        return;

    }

    // ============================
    // Save Student
    // ============================

    push(studentsRef, student);

    // ============================
    // Clear Form
    // ============================

    document.getElementById("name").value = "";

    document.getElementById("roll").value = "";

    document.getElementById("department").value = "";

    document.getElementById("year").value = "";

    document.getElementById("email").value = "";

    document.getElementById("phone").value = "";

    document.getElementById("conducted").value = "";

    document.getElementById("attended").value = "";

    alert("Student Added Successfully.");

};

// =====================================
// Search Student
// =====================================

window.searchStudent = function () {

    const text =

        document.getElementById("search")

        .value

        .trim();

    loadStudents(text);

};

// =====================================
// Show All Students
// =====================================

window.showAll = function () {

    document.getElementById("search").value = "";

    loadStudents();

};
// =====================================
// View Student Profile
// =====================================

window.viewStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    document.getElementById("profilePanel").style.display = "block";

    document.getElementById("pName").innerText = student.name || "-";
    document.getElementById("pRoll").innerText = student.roll || "-";
    document.getElementById("pDepartment").innerText = student.department || "-";
    document.getElementById("pYear").innerText = student.year || "-";
    document.getElementById("pEmail").innerText = student.email || "-";
    document.getElementById("pPhone").innerText = student.phone || "-";

    document.getElementById("pConducted").innerText =
        student.conducted || 0;

    document.getElementById("pAttended").innerText =
        student.attended || 0;

    document.getElementById("pAttendance").innerText =
        calculateAttendance(student.conducted, student.attended);

};

// =====================================
// Close Profile
// =====================================

window.closeProfile = function () {

    document.getElementById("profilePanel").style.display = "none";

};

// =====================================
// Edit Student
// =====================================

window.editStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    editId = id;

    document.getElementById("editName").value = student.name || "";
    document.getElementById("editRoll").value = student.roll || "";
    document.getElementById("editDepartment").value = student.department || "";
    document.getElementById("editYear").value = student.year || "";
    document.getElementById("editEmail").value = student.email || "";
    document.getElementById("editPhone").value = student.phone || "";
    document.getElementById("editConducted").value = student.conducted || 0;
    document.getElementById("editAttended").value = student.attended || 0;

    document.getElementById("attendancePreview").innerText =
        "Attendance : " +
        calculateAttendance(student.conducted, student.attended);

    document.getElementById("editModal").style.display = "block";

};

// =====================================
// Live Attendance Preview
// =====================================

document.getElementById("editConducted").addEventListener("input", updatePreview);
document.getElementById("editAttended").addEventListener("input", updatePreview);

function updatePreview() {

    const conducted =
        Number(document.getElementById("editConducted").value) || 0;

    const attended =
        Number(document.getElementById("editAttended").value) || 0;

    document.getElementById("attendancePreview").innerText =
        "Attendance : " + calculateAttendance(conducted, attended);

}

// =====================================
// Save Student
// =====================================

document.getElementById("saveBtn").addEventListener("click", () => {

    if (!editId) return;

    const student = {

        name: document.getElementById("editName").value.trim(),
        roll: document.getElementById("editRoll").value.trim(),
        department: document.getElementById("editDepartment").value,
        year: document.getElementById("editYear").value,
        email: document.getElementById("editEmail").value.trim(),
        phone: document.getElementById("editPhone").value.trim(),
        conducted: Number(document.getElementById("editConducted").value) || 0,
        attended: Number(document.getElementById("editAttended").value) || 0

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

    if (!/^[A-Za-z ]+$/.test(student.name)) {

        alert("Name should contain only letters.");
        return;

    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)) {

        alert("Invalid email address.");
        return;

    }

    if (!/^[0-9]{10}$/.test(student.phone)) {

        alert("Phone number must contain exactly 10 digits.");
        return;

    }

    if (student.attended > student.conducted) {

        alert("Classes attended cannot exceed classes conducted.");
        return;

    }

    const duplicateRoll = students.some(s =>
        s.id !== editId &&
        s.roll.toLowerCase() === student.roll.toLowerCase()
    );

    if (duplicateRoll) {

        alert("Roll Number already exists.");
        return;

    }

    const duplicateEmail = students.some(s =>
        s.id !== editId &&
        s.email.toLowerCase() === student.email.toLowerCase()
    );

    if (duplicateEmail) {

        alert("Email already exists.");
        return;

    }

    update(ref(db, "students/" + editId), student);

    closeModal();

    alert("Student Updated Successfully.");

});

// =====================================
// Close Modal
// =====================================

window.closeModal = function () {

    document.getElementById("editModal").style.display = "none";

    editId = null;

};

// =====================================
// Delete Student
// =====================================

window.deleteStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    if (confirm(`Delete ${student.name}?`)) {

        remove(ref(db, "students/" + id));

        closeProfile();

    }

};

// =====================================
// Close Modal When Clicking Outside
// =====================================

window.onclick = function (event) {

    const modal = document.getElementById("editModal");

    if (event.target === modal) {

        closeModal();

    }

};