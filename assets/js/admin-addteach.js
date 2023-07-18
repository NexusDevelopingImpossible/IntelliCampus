
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
function create_input_student() {
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
    let st = '';
    for(let i = 0; i<locals[0].length; i++){
      st = st + `<option value="`+locals[0][i]+`">`+locals[0][i]+`</option>`
    }
    div.innerHTML = `<div class="form-row">
        <div>
        <input type="checkbox" checked></div>
        <div class="form-set">
          <div class="form-text">Registration No.</div>
          <input type="text" class="input-name std-input" value=`+ eval(counter) + ` name="registration` + i + `">
        </div>
        <div class="form-set">
          <div class="form-text">Name</div>
          <input type="text" class="input-name std-input" name="name`+ i + `">
        </div>
        <div class="form-set">
        <div class="form-text">Department</div>
        <select id="departments`+i+`" class="departments input-name" name="department`+i+`">
        <option value="">Select a department</option>
        </select>
        </div>
        <div class="form-set">
        <div class="form-text">Course</div>
        <select id="courses`+i+`" class="courses input-name" name="courses`+i+`">
        <option value="">Select a course</option>
        </select>
        </div>
        <div class="form-set">
          <div class="form-text">Password</div>
          <input type="password" class="input-name std-input" value=`+ genPassword() + ` name="password` + i + `">
        </div>
      </div>`;
    document.getElementById('form-list').appendChild(div);
  }
  data();
}
function create_input_teacher() {
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
    let st = '';
    for(let i = 0; i<locals[0].length; i++){
      st = st + `<option value="`+locals[0][i]+`">`+locals[0][i]+`</option>`
    }
    div.innerHTML = `<div class="form-row">
      <div>
      <input type="checkbox" checked></div>
      <div class="form-set">
        <div class="form-text">Registration No.</div>
        <input type="text" class="input-name" value=`+ eval(counter) + ` name="registration` + i + `">
      </div>
      <div class="form-set">
        <div class="form-text">Name</div>
        <input type="text" class="input-name" name="name`+ i + `">
      </div>
      <div class="form-set">
      <div class="form-text">Department</div>
      <select name="department `+ i +`"class="input-name" >`+st+`</select>
      </div>
      <div class="form-set">
      <div class="form-text">Position</div>
      <input type="text" class="input-name" name="position`+i+`">
      </div>
      <div class="form-set">
        <div class="form-text">Password</div>
        <input type="password" class="input-name" value=`+ genPassword() + ` name="password` + i + `">
      </div>
    </div>`;
    document.getElementById('form-list').appendChild(div);
  }
}
function data(){
  const results = locals[0];
  
    // Assume 'results' contains the data fetched from the database as shown in the previous examples.

// Get references to the select elements
// Assume 'results' contains the data fetched from the database as shown in the previous examples.

// Function to populate the departments select
function populateDepartments(departmentsSelect) {
  console.log(departmentSelects);
  departmentsSelect.innerHTML = '<option value="">Select a department</option>';
  results.forEach((result) => {
    const option = document.createElement('option');
    option.value = result.department;
    option.textContent = result.department;
    departmentsSelect.appendChild(option);
  });
}

// Function to populate the courses select based on the selected department
function updateCourses(departmentsSelect, coursesSelect) {
  const selectedDepartment = departmentsSelect.value;
  coursesSelect.innerHTML = '<option value="">Select a course</option>';
  if (selectedDepartment) {
    const departmentData = results.find((result) => result.department === selectedDepartment);
    if (departmentData) {
      departmentData.course.forEach((course) => {
        const option = document.createElement('option');
        option.value = course;
        option.textContent = course;
        coursesSelect.appendChild(option);
      });
    }
  }
}

// Get all the department and course select elements
const departmentSelects = document.querySelectorAll('.departments');
const courseSelects = document.querySelectorAll('.courses');
console.log(departmentSelects);
// Populate all the department selects
departmentSelects.forEach((departmentsSelect) => populateDepartments(departmentsSelect));

// Add event listener to each department select to update the corresponding courses select
departmentSelects.forEach((departmentsSelect, index) => {
  departmentsSelect.addEventListener('change', () => {
    updateCourses(departmentsSelect, courseSelects[index]);
  });
});
}
