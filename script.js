let students = JSON.parse(localStorage.getItem("students")) || [];

window.onload = displayStudents;

function saveData(){
    localStorage.setItem("students", JSON.stringify(students));
}

function addStudent(){

let name = document.getElementById("name").value;
let roll = document.getElementById("roll").value;

if(name=="" || roll==""){
    alert("Enter all details");
    return;
}

let student = {
    name: name,
    roll: roll
};

students.push(student);

saveData();
displayStudents();

document.getElementById("name").value="";
document.getElementById("roll").value="";
}

function displayStudents(){

let table = document.getElementById("tableBody");
table.innerHTML = "";

students.forEach((s, index) => {

table.innerHTML += `
<tr>
    <td>${s.name}</td>
    <td>${s.roll}</td>
    <td>
        <button onclick="deleteRow(${index})">Delete</button>
    </td>
</tr>
`;

});
}

function deleteRow(index){
students.splice(index,1);
saveData();
displayStudents();
}

function searchStudent(){

let value = document.getElementById("search").value.toLowerCase();

let filtered = students.filter(s =>
    s.name.toLowerCase().includes(value) ||
    s.roll.toLowerCase().includes(value)
);

let table = document.getElementById("tableBody");
table.innerHTML = "";

filtered.forEach((s, index) => {

table.innerHTML += `
<tr>
    <td>${s.name}</td>
    <td>${s.roll}</td>
    <td>
        <button onclick="deleteRow(${index})">Delete</button>
    </td>
</tr>
`;

});

}