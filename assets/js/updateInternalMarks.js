class updateInternalMarks{
    constructor(){
        this.MarksForm = $(`#marks-all`);
        this.sendMarksData()
    }

    sendMarksData(){
        this.MarksForm.submit(function(e){
            e.preventDefault();
            let self=this

            $.ajax({
                type:'post',
                url:"/teacher/updateMarks",
                data: $(self).serialize(),
                success: function(){
                    console.log("Success");
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
            })
        })
    }
}