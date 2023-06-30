class createStudentNoti {
  constructor(notiElement) {
    this.notiElement = notiElement;
    console.log("Running for " + this.notiElement);
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
          $(`.content`).prepend(newPinNoti);
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
      <a href="${file}" target="_blank">
        <ion-icon class="download-outline" name="download-outline"></ion-icon>
      </a><a href="/student/unpinnoti/${link}">
        <ion-icon class="pin-outline" name="navigate-circle"></ion-icon>
      </a>
    </div>
  </div>
        `);
  }
}
