
  function onclicked(id) {
    "use strict";
    check(id);
  }
  function check(stringid) {
    "use strict";
    let id = parseInt(stringid);
    if (0 < id && id < 6) {
      let selected = document.getElementById(id);
      let section = document.getElementsByClassName('row1');
      let data = document.getElementById('row1');
      for (let i = 0; i < 5; i++) {
        section[i].style.background = "rgba(255, 255, 255, .15)";
      }
      selected.style.background = "#FD6D08";
      id = id % 5;
      data.value = id;
    }
    if (5 < id && id < 11) {
      let selected = document.getElementById(id);
      let section = document.getElementsByClassName('row2');
      let data = document.getElementById('row2');
      for (let i = 0; i < 5; i++) {
        section[i].style.background = "rgba(255, 255, 255, .15)";
      }
      selected.style.background = "#FD6D08";
      id = id % 5;
      data.value = id;
    }
    if (10 < id && id < 16) {
      let selected = document.getElementById(id);
      let section = document.getElementsByClassName('row3');
      let data = document.getElementById('row3');
      for (let i = 0; i < 5; i++) {
        section[i].style.background = "rgba(255, 255, 255, .15)";
      }
      selected.style.background = "#FD6D08";
      id = id % 5;
      data.value = id;
    }
    if (15 < id && id < 21) {
      let selected = document.getElementById(id);
      let section = document.getElementsByClassName('row4');
      let data = document.getElementById('row4');
      for (let i = 0; i < 5; i++) {
        section[i].style.background = "rgba(255, 255, 255, .15)";
      }
      selected.style.background = "#FD6D08";
      id = id % 5;
      data.value = id;
    }
    if (20 < id && id < 26) {
      let selected = document.getElementById(id);
      let section = document.getElementsByClassName('row5');
      let data = document.getElementById('row5');
      for (let i = 0; i < 5; i++) {
        section[i].style.background = "rgba(255, 255, 255, .15)";
      }
      selected.style.background = "#FD6D08";
      id = id % 5;
      data.value = id;
    }
    if (25 < id && id < 31) {
      let selected = document.getElementById(id);
      let section = document.getElementsByClassName('row6');
      let data = document.getElementById('row6');
      for (let i = 0; i < 5; i++) {
        section[i].style.background = "rgba(255, 255, 255, .15)";
      }
      selected.style.background = "#FD6D08";
      id = id % 5;
      data.value = id;
    }
  }