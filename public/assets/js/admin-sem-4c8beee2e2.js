const createSem=document.getElementById("create-sem"),semSection=document.querySelector(".sem-section"),copiedSemSection=document.getElementById("copied-sem-section");let i=2;createSem.addEventListener("click",(function(){let e='\n<div class="sem-block flex">\n  <div class="sem-no flex">Semester : <input class="no-box" type="text" name="semester" value="'+i+'"></div>\n  <div class="sem-cord">\n    <label for="">Semester Coordinator :</label>\n    <input\n      type="text"\n      name="semco"\n      id=""\n      class="input-search"\n      placeholder="Select semester coordinator"\n    />\n  </div>\n</div>\n<div class="sec-block flex">\n  <div class="sec-block-in">\n  <div class="sec-sub-block flex">\n      <div class="sec-no">Section : <input class="no-box" type="text" name="section" value="A"></div>\n      <div class="sem-cord">\n          <label for="">Section Coordinator :</label>\n          <input type="text" class="input-search" name="secco" id="" placeholder="Select section coordinator"\n          />\n        </div>\n        <div class="del-btn"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>\n  </div>\n  <div id="copied-sec-section"></div>\n</div>\n  <div id="create-section" class="add-section-btn flex"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" ><path d="M450-450H230q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-510h220v-220q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T510-730v220h220q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-450H510v220q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625-12.825 0-21.325-8.625T450-230v-220Z"/></svg></div>\n</div>\n';console.log(i),i++;let t=document.createElement("section");t.classList.add("sem-section"),t.innerHTML=e,copiedSemSection.appendChild(t);const n=document.querySelectorAll(".add-section-btn");let c,s=66;n.forEach(((e,t)=>{e.addEventListener("click",(function(){if(t===n.length-1){let t=document.createElement("div");t.classList.add("sec-sub-block"),t.classList.add("flex");let n='<div class="sec-no">Section : <input class="no-box" type="text" name="section" value="'+String.fromCharCode(s)+'"></div>\n      <div class="sem-cord">\n      <label for="">Section Coordinator :</label>\n      <input type="text" name="semco" id="" class="input-search" placeholder="Select section coordinator"/>\n      </div>\n      <div class="del-btn"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>\n    ';t.innerHTML=n,s++,c=e.previousElementSibling,c.appendChild(t)}}))}))}));const createSec=document.querySelectorAll(".add-section-btn"),secSection=document.querySelector(".sec-sub-block"),copiedSecSection=document.getElementById("copied-sec-section");let Alpha=66;createSec.forEach((e=>{e.addEventListener("click",(function(){let e=document.createElement("div");e.classList.add("sec-sub-block"),e.classList.add("flex");let t='<div class="sec-no">Section : <input class="no-box" type="text" name="section" value="'+String.fromCharCode(Alpha)+'"></div>\n      <div class="sem-cord">\n      <label for="">Section Coordinator :</label>\n      <input type="text" name="semco" class="input-search" id="" placeholder="Select section coordinator"/>\n      </div>\n      <div class="del-btn"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>\n    ';e.innerHTML=t,Alpha++,copiedSecSection.appendChild(e)}))}));