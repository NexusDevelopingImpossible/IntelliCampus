class createStudentNoti {
  constructor(notiElement) {
    this.notiElement = notiElement;
    // console.log("Running for " + this.notiElement);
    this.createNoti();
  }

  createNoti() {
    let pself=this;
    $(this.notiElement).click(function (e) {
      e.preventDefault();
      let self = this;
      $.ajax({
        type: "GET",
        url: $(self).attr("href"),
        success: function (data) {
          console.log("Pinned Successfully");
          let title=document.getElementById($(self).attr("href")+"-title").value;
          let file=document.getElementById($(self).attr("href")+"-file").value;
          let link = data.newNotiId;
          let newPinNoti=pself.newNotiDom(link,title,file);
          $(`.save-cont`).prepend(newPinNoti);
          new Noty({
            theme: "relax",
            text: "Noti Pinned!",
            type: "success",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
        error: function (error) {
          console.log(error.responseText);
          new Noty({
            theme: "relax",
            text: "Error in pinning Noti!",
            type: "error",
            layout: "topRight",
            timeout: 1500,
          }).show();
        },
      });
    });
  }

  newNotiDom(link,title,file) {
    return $(`
    <div class="notification">
    <div class="text">
      <p class="old">${title}</p>
    </div>
    <div class="pdf">
    <a href="<%=notidata[i].notiflie%>" target="_blank">
      <svg xmlns="http://www.w3.org/2000/svg" enable-background="new 0 0 24 24"  viewBox="0 0 24 24" ><g><rect/></g><g><path d="M5,20h14v-2H5V20z M19,9h-4V3H9v6H5l7,7L19,9z"/></g></svg>
    </a><a class="createStudentNotiBtn" href="/student/unpinnoti/<%=notidata[i]._id%>">
    <svg xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 24 24"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>
    </a>
  </div>
  </div>
        `);
  }
}


// <!--  - - - - - - - - -- - - - - - --  -->
// <!-- annoucements card's saved section -->
// <!--  - - - - - - - - -- - - - - - --  -->
// document.addEventListener("DOMContentLoaded", function() {

function notificationSaved(){
const savedBtn = document.querySelector(".saved");
const notedBtn = document.querySelector(".noted");
const notyCard = document.querySelector(".noty1");
const savedCard = document.querySelector(".noty2");



  savedBtn.addEventListener("click", function() {
    notyCard.style.display = "none";
    savedCard.style.display = "block";
  });

  notedBtn.addEventListener("click", function() {
    notyCard.style.display = "block";
    savedCard.style.display = "none";
  });

 
}
notificationSaved();