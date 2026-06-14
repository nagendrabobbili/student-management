function addStudent(){

let name=document.getElementById("name").value;

let roll=document.getElementById("roll").value;

if(name=="" || roll==""){

alert("Enter all details");

return;

}

let table=document.getElementById("tableBody");

let row=table.insertRow();

let c1=row.insertCell(0);

let c2=row.insertCell(1);

let c3=row.insertCell(2);

c1.innerHTML=name;

c2.innerHTML=roll;

c3.innerHTML="<button onclick='deleteRow(this)'>Delete</button>";

document.getElementById("name").value="";

document.getElementById("roll").value="";

}

function deleteRow(btn){

btn.parentNode.parentNode.remove();

}