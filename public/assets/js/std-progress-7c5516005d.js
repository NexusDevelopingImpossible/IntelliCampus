"use strict";function start(){document.querySelectorAll(".circle-progress").forEach((e=>{const t=e.querySelector(".progress-val"),r=3.6*parseInt(t.textContent);e.style.background=`conic-gradient(from 0deg, #ffbd01 0deg ${r}deg, #00000068 ${r}deg 360deg)`}))}start();