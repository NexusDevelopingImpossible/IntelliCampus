const camProjection = document.getElementById("camp");
const q1 = document.getElementById("q1");
const s1 = document.getElementById("s1");
const q2 = document.getElementById("q2");
const s2 = document.getElementById("s2");
const int = document.getElementById("int");
const ext = document.getElementById("ext");
const fcoa = document.getElementById("fcoa");
const poa = document.getElementById("poa");
const rcoa = document.getElementById("rcoa");

const analysisTable = document.getElementsByClassName("analysis-table");
const table1 = document.getElementById("table1");
const table2 = document.getElementById("table2");
const table3 = document.getElementById("table3");
const table4 = document.getElementById("table4");
const table5 = document.getElementById("table5");
const table6 = document.getElementById("table6");
const table7 = document.getElementById("table7");
const table8 = document.getElementById("table8");
const table9 = document.getElementById("table9");
const table10 = document.getElementById("table10");

function fornun() {
    for(let i=0; i<analysisTable.length; i++){
        analysisTable[i].style.display = "none";
    }
}
camProjection.addEventListener("click", function(){
   fornun();
    table1.style.display = "block";
})
q1.addEventListener("click", function(){
    fornun();
    table2.style.display = "block";
})
s1.addEventListener("click", function(){
    fornun();
    table3.style.display = "block";
})
q2.addEventListener("click", function(){
    fornun();
    table4.style.display = "block";
})
s2.addEventListener("click", function(){
    fornun();
    table5.style.display = "block";
})
int.addEventListener("click", function(){
    fornun();
    table6.style.display = "block";
})
ext.addEventListener("click", function(){
    fornun();
    table7.style.display = "block";
})
fcoa.addEventListener("click", function(){
    fornun();
    table8.style.display = "block";
})
poa.addEventListener("click", function(){
    fornun();
    table9.style.display = "block";
})
rcoa.addEventListener("click", function(){
    fornun();
    table10.style.display = "block";
})