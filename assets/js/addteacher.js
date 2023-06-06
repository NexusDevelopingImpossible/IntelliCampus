
function genPassword() {
    var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    var passwordLength = 12;
    var password = "";
    for (var i = 0; i <= passwordLength; i++) {
        var randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
}
function create_input() {
    var start = document.getElementById('start').value;
    var end = document.getElementById('end').value;
    var div1 = document.getElementById('input-pageid');
    var div2 = document.getElementById('input-pageid2');
    var countid = document.getElementById('count');
    var c = eval(end - start);
    countid.innerHTML = eval(end - start);
    div1.style.display = "none";
    div2.style.display = "flex";
    // div2.style.visibility = "visible";
    var counter = start;

    for (var i = 0; i < c; i++) {
        counter = eval(parseInt(start) + parseInt(i));
        let div = document.createElement('div');
        div.classList.add('form-row');
        div.innerHTML = `<div class="form-row">
        <input type="checkbox" checked>
        <div class="form-set">
          <div class="form-text">Registration No.</div>
          <input type="text" class="input-name" value=`+ eval(counter) + ` name="registration`+i+`">
        </div>
        <div class="form-set">
          <div class="form-text">Name</div>
          <input type="text" class="input-name" name="name`+i+`">
        </div>
        <div class="form-set">
          <div class="form-text">Password</div>
          <input type="password" class="input-name" value=`+ genPassword()+` name="password`+i+`">
        </div>
      </div>`;
        document.getElementById('form-list').appendChild(div);
    }
}