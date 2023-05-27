let timeout;
let strongPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
let mediumPassword = /^(?=.*[a-zA-Z])(?=.*\d).{6,}/;
let password = document.getElementById('form-input-password');
console.log(password);

function StrengthChecker(PasswordParameter){

    if(strongPassword.test(PasswordParameter)) {
        password.style.borderColor = "green";

    } else if(mediumPassword.test(PasswordParameter)){
        password.style.borderColor = 'orange';

    }else if(PasswordParameter.length<1){
        password.style.borderColor = 'transparent';
    } 
    
    else{
        password.style.borderColor = 'red';

    }
}

password.addEventListener("input", () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => StrengthChecker(password.value), 500);
});