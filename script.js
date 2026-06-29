import { db } from "./firebase.js";

import {
  ref,
  push,
  onValue,
  remove
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

const studentsRef = ref(db, "students");

// ----------------------------
// Load Students (Real-Time)
// ----------------------------

function loadStudents(searchText = "") {

    const table = document.getElementById("tableBody");

    onValue(studentsRef, (snapshot) => {

        table.innerHTML = "";

        let count = 0;

        snapshot.forEach((child) => {

            const student = child.val();
            const key = child.key;

            if (
                searchText === "" ||
                student.name.toLowerCase().includes(searchText.toLowerCase()) ||
                student.roll.toLowerCase().includes(searchText.toLowerCase())
            ) {

                count++;

                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.roll}</td>
                    <td>
                        <button class="delete-btn" data-id="${key}">
                            Delete
                        </button>
                    </td>
                `;

                table.appendChild(row);

            }

        });

        document.getElementById("totalCount").innerText = count;

        document.querySelectorAll(".delete-btn").forEach(button => {

            button.addEventListener("click", () => {

                const id = button.dataset.id;

                remove(ref(db, "students/" + id));

            });

        });

    });

}

loadStudents();


// ----------------------------
// Add Student
// ----------------------------

window.addStudent = function () {

    const name = document.getElementById("name").value.trim();
    const roll = document.getElementById("roll").value.trim();

    if (name === "" || roll === "") {

        alert("Enter all details");

        return;

    }

    push(studentsRef, {

        name,
        roll

    });

    document.getElementById("name").value = "";
    document.getElementById("roll").value = "";

};


// ----------------------------
// Search Student
// ----------------------------

window.searchStudent = function () {

    const value = document.getElementById("search").value;

    loadStudents(value);

};


// ----------------------------
// Show All
// ----------------------------

window.showAll = function () {

    document.getElementById("search").value = "";

    loadStudents();

};