import { db } from "./firebase.js";

import {
    ref,
    push,
    onValue,
    remove,
    update
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase Reference

const studentsRef = ref(db, "students");

// Global Variables

let students = [];
let editId = null;

// ===============================
// Load Students (Real-Time)
// ===============================

function loadStudents(searchText = "") {

    onValue(studentsRef, (snapshot) => {

        students = [];

        const table = document.getElementById("tableBody");

        table.innerHTML = "";

        let total = 0;

        snapshot.forEach((child) => {

            const student = child.val();

            student.id = child.key;

            students.push(student);

        });

        students.forEach((student) => {

            if (

                searchText === "" ||

                student.name.toLowerCase().includes(searchText.toLowerCase()) ||

                student.roll.toLowerCase().includes(searchText.toLowerCase())

            ) {

                total++;

                const row = document.createElement("tr");

                row.innerHTML = `

                <td>${student.name}</td>

                <td>${student.roll}</td>

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

    });

}

// Load Automatically

loadStudents();
// ===============================
// Add Student
// ===============================

window.addStudent = function () {

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();
    const department = document.getElementById("department").value.trim();
    const year = document.getElementById("year").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();

    if (
        name === "" ||
        roll === "" ||
        department === "" ||
        year === "" ||
        email === "" ||
        phone === ""
    ) {

        alert("Please fill all fields.");
        return;

    }

    push(studentsRef, {

        name,
        roll,
        department,
        year,
        email,
        phone,
        attendance: "94%"

    });

    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";
    document.getElementById("department").value = "";
    document.getElementById("year").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";

};


// ===============================
// View Student Profile
// ===============================

window.viewStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    document.getElementById("pName").innerText =
        student.name;

    document.getElementById("pRoll").innerText =
        student.roll;

    document.getElementById("pDepartment").innerText =
        student.department;

    document.getElementById("pYear").innerText =
        student.year;

    document.getElementById("pEmail").innerText =
        student.email;

    document.getElementById("pPhone").innerText =
        student.phone;

    document.getElementById("pAttendance").innerText =
        student.attendance || "94%";

};


// ===============================
// Search Student
// ===============================

window.searchStudent = function () {

    const text = document
        .getElementById("search")
        .value
        .trim();

    loadStudents(text);

};


// ===============================
// Show All Students
// ===============================

window.showAll = function () {

    document.getElementById("search").value = "";

    loadStudents();

};
// ===============================
// Edit Student
// ===============================

window.editStudent = function (id) {

    const student = students.find(s => s.id === id);

    if (!student) return;

    editId = id;

    document.getElementById("editName").value = student.name;
    document.getElementById("editRoll").value = student.roll;
    document.getElementById("editDepartment").value = student.department;
    document.getElementById("editYear").value = student.year;
    document.getElementById("editEmail").value = student.email;
    document.getElementById("editPhone").value = student.phone;

    document.getElementById("editModal").style.display = "block";

};


// ===============================
// Save Edited Student
// ===============================

document.getElementById("saveBtn").addEventListener("click", () => {

    if (!editId) return;

    update(ref(db, "students/" + editId), {

        name: document.getElementById("editName").value.trim(),

        roll: document.getElementById("editRoll").value.trim(),

        department: document.getElementById("editDepartment").value.trim(),

        year: document.getElementById("editYear").value.trim(),

        email: document.getElementById("editEmail").value.trim(),

        phone: document.getElementById("editPhone").value.trim()

    });

    closeModal();

});


// ===============================
// Close Modal
// ===============================

window.closeModal = function () {

    document.getElementById("editModal").style.display = "none";

    editId = null;

};


// ===============================
// Delete Student
// ===============================

window.deleteStudent = function (id) {

    const ok = confirm("Delete this student?");

    if (!ok) return;

    remove(ref(db, "students/" + id));

};


// ===============================
// Close Modal When Clicking Outside
// ===============================

window.onclick = function (event) {

    const modal = document.getElementById("editModal");

    if (event.target === modal) {

        closeModal();

    }

};