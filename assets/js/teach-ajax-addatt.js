let createform = function () {
    const newattform = $('#att-form');

    $(document).on('submit', '#att-form', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'post',
            url: '/teacher/addattendance',
            data: newattform.serialize(),
            success: function (data) {
                const nAtt = newattDom(data.data);
                new Noty({
                  theme: "relax",
                  text: "Attendance added",
                  type: "success",
                  layout: "topRight",
                 
                  timeout: 1500,
                }).show();
            },
            error: function (error) {
                console.log(error.responseText);
            }
        });
    });
};

let newattDom = function (data) {
    date.value = null;
    console.log(data);
    for (let i = 0; i < data.student.length; i++) {
        let l = "len" + i;
        document.getElementById("len" + i).innerHTML = data.student[i].present.length;
        document.getElementById("tp" + i).innerHTML = data.student[i].totalpresent;
        document.getElementById("per" + i).innerHTML = parseInt(((data.student[i].totalpresent) / (data.student[i].present.length)) * 100) + "%";
        document.getElementById("cb" + i).checked = true;
    }
    return
};

createform();
