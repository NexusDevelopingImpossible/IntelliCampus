// // Get all the elements with class "progress-val"
// const circularProgress = document.querySelectorAll(".circle-progress");

// // Loop through each element and update the conic gradient degree
// circularProgress.forEach((circle) => {
//   const progressVals = circle.querySelectorAll(".progress-val");
//   const percent = parseInt(progressVals.textContent); // Get the percent value

//   // Calculate the degree based on the percent value
//   const degree = percent * 3.6; // 360 degrees divided by 100

//   // Update the conic gradient style
//   circle.style.background = `conic-gradient(#ffbd01 ${degree}deg, #00000068 0deg)`;
// });


// Get all the elements with class "circle-progress"
const circleProgress = document.querySelectorAll(".circle-progress");

// Loop through each element and update the conic gradient degree
circleProgress.forEach((circle) => {
  const progressVal = circle.querySelector(".progress-val");
  const percent = parseInt(progressVal.textContent); // Get the percent value

  // Calculate the degree based on the percent value
  const degree = percent * 3.6; // 360 degrees divided by 100

  // Update the conic gradient style
  circle.style.background = `conic-gradient(from 0deg, #ffbd01 0deg ${degree}deg, #00000068 ${degree}deg 360deg)`;
});
