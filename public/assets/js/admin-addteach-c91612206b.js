function genPassword(){for(var e="0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ",t="",n=0;n<=12;n++){var s=Math.floor(72*Math.random());t+=e.substring(s,s+1)}return t}function create_input_student(){var start=document.getElementById("start").value,end=document.getElementById("end").value,div1=document.getElementById("input-pageid"),div2=document.getElementById("input-pageid2"),countid=document.getElementById("count"),c=eval(end-start);countid.innerHTML=eval(end-start),div1.style.display="none",div2.style.display="flex";for(var counter=start,i=0;i<c;i++){counter=eval(parseInt(start)+parseInt(i));let div=document.createElement("div");div.classList.add("form-row");let st="";for(let e=0;e<locals[0].length;e++)st=st+'<option value="'+locals[0][e]+'">'+locals[0][e]+"</option>";div.innerHTML='<div class="form-row">\n        <div>\n        <input type="checkbox" checked></div>\n        <div class="form-set">\n          <div class="form-text">Registration No.</div>\n          <input type="text" class="input-name std-input" value='+eval(counter)+' name="registration'+i+'">\n        </div>\n        <div class="form-set">\n          <div class="form-text">Name</div>\n          <input type="text" class="input-name std-input" name="name'+i+'">\n        </div>\n        <div class="form-set">\n        <div class="form-text">Department</div>\n        <select id="departments'+i+'" class="departments input-name" name="department'+i+'">\n        <option value="">Department</option>\n        </select>\n        </div>\n        <div class="form-set">\n        <div class="form-text">Course</div>\n        <select id="courses'+i+'" class="courses input-name" name="courses'+i+'">\n        <option value="">Course</option>\n        </select>\n        </div>\n        <div class="form-set">\n          <div class="form-text">Password</div>\n          <input type="password" class="input-name std-input" value='+genPassword()+' name="password'+i+'">\n        </div>\n      </div>',document.getElementById("form-list").appendChild(div)}data()}function create_input_teacher(){var start=document.getElementById("start").value,end=document.getElementById("end").value,div1=document.getElementById("input-pageid"),div2=document.getElementById("input-pageid2"),countid=document.getElementById("count"),c=eval(end-start);countid.innerHTML=eval(end-start),div1.style.display="none",div2.style.display="flex";for(var counter=start,i=0;i<c;i++){counter=eval(parseInt(start)+parseInt(i));let div=document.createElement("div");div.classList.add("form-row");let st="";for(let e=0;e<locals[0].length;e++)st=st+'<option value="'+locals[0][e]+'">'+locals[0][e]+"</option>";div.innerHTML='<div class="form-row">\n      <div>\n      <input type="checkbox" checked></div>\n      <div class="form-set">\n        <div class="form-text">Registration No.</div>\n        <input type="text" class="input-name" value='+eval(counter)+' name="registration'+i+'">\n      </div>\n      <div class="form-set">\n        <div class="form-text">Name</div>\n        <input type="text" class="input-name" name="name'+i+'">\n      </div>\n      <div class="form-set">\n      <div class="form-text">Department</div>\n      <select name="department '+i+'"class="input-name" >'+st+'</select>\n      </div>\n      <div class="form-set">\n      <div class="form-text">Position</div>\n      <input type="text" class="input-name" name="position'+i+'">\n      </div>\n      <div class="form-set">\n        <div class="form-text">Password</div>\n        <input type="password" class="input-name" value='+genPassword()+' name="password'+i+'">\n      </div>\n    </div>',document.getElementById("form-list").appendChild(div)}}function data(){const e=locals[0];const t=document.querySelectorAll(".departments"),n=document.querySelectorAll(".courses");console.log(t),t.forEach((n=>function(n){console.log(t),n.innerHTML='<option value="">Select a department</option>',e.forEach((e=>{const t=document.createElement("option");t.value=e.department,t.textContent=e.department,n.appendChild(t)}))}(n))),t.forEach(((t,s)=>{t.addEventListener("change",(()=>{!function(t,n){const s=t.value;if(n.innerHTML='<option value="">Select a course</option>',s){const t=e.find((e=>e.department===s));t&&t.course.forEach((e=>{const t=document.createElement("option");t.value=e,t.textContent=e,n.appendChild(t)}))}}(t,n[s])}))}))}