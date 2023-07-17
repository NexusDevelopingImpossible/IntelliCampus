const createSem = document.getElementById("create-sem");
const semSection = document.querySelector(".sem-section");
const copiedSemSection = document.getElementById("copied-sem-section");

let i = 2;

createSem.addEventListener("click", function () {
  let semSectionDOM =
    `
<div class="sem-block flex">
  <div class="sem-no flex">Semester : <input class="no-box" type="text" name="semester" value="` +
    i +
    `"></div>
  <div class="sem-cord">
    <label for="">Semester Coordinator :</label>
    <input
      type="text"
      name="semco"
      id=""
      placeholder="Select semester coordinator"
    />
  </div>
</div>
<div class="sec-block flex">
  <div class="sec-block-in">
  <div class="sec-sub-block flex">
      <div class="sec-no">Section : <input class="no-box" type="text" name="section" value="A"></div>
      <div class="sem-cord">
          <label for="">Semester Coordinator :</label>
          <input type="text" name="secco" id="" placeholder="Select semester coordinator"
          />
        </div>
        <div class="del-btn"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>
  </div>
  <div id="copied-sec-section"></div>
</div>
  <div id="create-section" class="add-section-btn flex"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960" ><path d="M450-450H230q-12.75 0-21.375-8.675-8.625-8.676-8.625-21.5 0-12.825 8.625-21.325T230-510h220v-220q0-12.75 8.675-21.375 8.676-8.625 21.5-8.625 12.825 0 21.325 8.625T510-730v220h220q12.75 0 21.375 8.675 8.625 8.676 8.625 21.5 0 12.825-8.625 21.325T730-450H510v220q0 12.75-8.675 21.375-8.676 8.625-21.5 8.625-12.825 0-21.325-8.625T450-230v-220Z"/></svg></div>
</div>
`;
  let clonedSemRaw = semSectionDOM;
  console.log(i);
  i++;
  let clonedSem = document.createElement("section");
  clonedSem.classList.add("sem-section");
  clonedSem.innerHTML = clonedSemRaw;
  copiedSemSection.appendChild(clonedSem);

  const createSec = document.querySelectorAll(".add-section-btn");
  let secBlock;
  let Al = 66;
  createSec.forEach((sec, index) => {
    sec.addEventListener("click", function () {
      if (index === createSec.length - 1) {
        let clonedSec = document.createElement("div");
        clonedSec.classList.add("sec-sub-block");
        clonedSec.classList.add("flex");
        let secSectionDOM =
      `<div class="sec-no">Section : <input class="no-box" type="text" name="section" value="` +
      String.fromCharCode(Al) +
      `"></div>
      <div class="sem-cord">
      <label for="">Semester Coordinator :</label>
      <input type="text" name="secco" id="" placeholder="Select semester coordinator"/>
      </div>
      <div class="del-btn"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>
    `;
        clonedSec.innerHTML = secSectionDOM;
        Al++;
        secBlock = sec.previousElementSibling;
        secBlock.appendChild(clonedSec);
      }
    });
  });
});

const createSec = document.querySelectorAll(".add-section-btn");
const secSection = document.querySelector(".sec-sub-block");
const copiedSecSection = document.getElementById("copied-sec-section");
let Alpha = 66;

createSec.forEach((sec) => {
  sec.addEventListener("click", function () {
    let clonedSec = document.createElement("div");
    clonedSec.classList.add("sec-sub-block");
    clonedSec.classList.add("flex");
    let secSectionDOM =
      `<div class="sec-no">Section : <input class="no-box" type="text" name="section" value="` +
      String.fromCharCode(Alpha) +
      `"></div>
      <div class="sem-cord">
      <label for="">Semester Coordinator :</label>
      <input type="text" name="" id="" value="Select semester coordinator"/>
      </div>
      <div class="del-btn"><svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 -960 960 960"><path d="M261-120q-24.75 0-42.375-17.625T201-180v-570h-41v-60h188v-30h264v30h188v60h-41v570q0 24-18 42t-42 18H261Zm438-630H261v570h438v-570ZM367-266h60v-399h-60v399Zm166 0h60v-399h-60v399ZM261-750v570-570Z"/></svg></div>
    `;
    clonedSec.innerHTML = secSectionDOM;
    Alpha++;
    copiedSecSection.appendChild(clonedSec);
  });
});

///
splitSelect = {
  selects: [],
  current: null,
  firstName: "primary",
  secondName: "secondary",
  init: function () {
    var s = document.getElementById(splitSelect.firstName);
    var c = document.createElement("select");
    c.onchange = function () {
      splitSelect.choose(this.selectedIndex);
    };
    s.parentNode.insertBefore(c, s);
    var g = s.getElementsByTagName("optgroup");
    for (var i = 0, j = g.length; i < j; i++) {
      var o = g[i].getElementsByTagName("option");
      var news = document.createElement("select");
      s.parentNode.insertBefore(news, s);
      news.style.display = "none";
      splitSelect.selects.push(news);
      var k = 0;
      c.appendChild(o[0]);
      while (o[k]) {
        if (o[k].getAttribute("selected") === "selected") {
          splitSelect.current = i;
          news.style.display = "inline";
        }
        news.appendChild(o[k]);
      }
    }
    c.selectedIndex = splitSelect.current;
    s.parentNode.removeChild(s);
    c.id = splitSelect.firstName;
    c.name = splitSelect.firstName;
    if (splitSelect.current === null) {
      splitSelect.selects[0].style.display = "inline";
      splitSelect.selects[0].selectedIndex = 0;
      c.selectedIndex = 0;
      splitSelect.current = 0;
    }
  },
  choose: function (o) {
    if (splitSelect.current !== null) {
      splitSelect.selects[splitSelect.current].style.display = "none";
      splitSelect.selects[splitSelect.current].name = "";
    }
    splitSelect.selects[o].style.display = "inline";
    splitSelect.selects[o].name = splitSelect.secondName;
    splitSelect.current = o;
  },
};
window.onload = splitSelect.init;
