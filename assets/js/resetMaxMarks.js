class resetMaxMarks {
  constructor() {
    this.MarksInput = $(`#marks-input`);
    this.ExamType = $(`#examType-MaxMarks`);
    this.MaxMarksForm = $(`#MaxMarksForm`);

    let self = this;
    this.sendMaxMarks();
    console.log(this.MarksInput);
    console.log(this.ExamType);
  }

  sendMaxMarks() {
    this.MaxMarksForm.submit(function (e) {
      e.preventDefault();
      let self = this;

      if (
        $(`#examType-MaxMarks`).val() == "" ||
        $(`#marks-input`).val() == ""
      ) {
        new Noty({
          theme: "relax",
          text: "Max Marks or Exam Type Empty",
          type: "error",
          layout: "topRight",
          timeout: 1500,
        }).show();

        return false;
      } else {
        $.ajax({
          type: "post",
          url: "/timetable/setMaxMarks",
          data: $(self).serialize(),
          success: function () {
            
            let keyRaw=$(`#examType-MaxMarks`).val();
            let valueRaw=$(`#marks-input`).val();
            if(keyRaw=='quiz1'){
              setTempMarks(0,valueRaw);
            }
            else if(keyRaw=='quiz2'){
              setTempMarks(1,valueRaw);
            }
            else if(keyRaw=='sess1'){
              setTempMarks(2,valueRaw);
            }
            else if(keyRaw=='sess2'){
              setTempMarks(3,valueRaw);
            }

            new Noty({
              theme: "relax",
              text: "Marks Updated",
              type: "success",
              layout: "topRight",
              timeout: 1500,
            }).show();
          },
          error: function (error) {
            console.log(error.responseText);
            new Noty({
              theme: "relax",
              text: "Error in updating marks",
              type: "error",
              layout: "topRight",
              timeout: 1500,
            }).show();
          },
        });
      }
    });
  }
}
let marksSet=false;
let setMaxMarksHelper=(check,examType="",maxMarks=0)=>{
  marksSet=false;
  if(examType=="" || maxMarks==0){

  }
}
