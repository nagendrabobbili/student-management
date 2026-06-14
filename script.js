let students = JSON.parse(localStorage.getItem("students")) || [];

window.onload = () => {
displayStudents();
updateCount();
};

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

students.push({ name, roll });

saveData();
displayStudents();
updateCount();

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
<button class="delete" onclick="deleteStudent(${index})">Delete</button>
</td>
</tr>
`;

});
}

function deleteStudent(index){
students.splice(index,1);
saveData();
displayStudents();
updateCount();
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
<button class="delete" onclick="deleteStudent(${index})">Delete</button>
</td>
</tr>
`;

});
}

function updateCount(){
document.getElementById("totalCount").innerText = students.length;
}

function showAll(){
displayStudents();
}