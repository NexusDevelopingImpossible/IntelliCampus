const ResultAnalysis = require("../models/result_analysis");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const XLSX = require("xlsx");
const { start } = require("repl");

module.exports.uploadfile = function (req, res) {
  try {
    let path = ResultAnalysis.uploadfileexcel(req, res, function (error) {
    //   console.log(Excel.uploadpath);
      console.log(req.file);
      if (error) {
        console.log("** Multer error:", error);
      }
    //   ResultAnalysis.create({
    //     title: req.body.title,
    //     excelfile: Excel.uploadpath + "\\" + req.file.filename,
    //   });
    });
    return res.redirect("/teacher/cal-result-analytics");
  } catch (error) {
    console.log(error);
  }
};
function getUniqueValues(array) {
  const uniqueSet = new Set(array);
  const uniqueArray = Array.from(uniqueSet);
  return uniqueArray;
}
module.exports.ra_calculate = function (req, res) {
  try {
    const workbook = XLSX.readFile(
      "data/template_result_analysis.xlsx"
    );
    let sheetsQuiz = ["Quiz 1", "Quiz 2"];
    let sheetsSess = ["Sess 1", "Sess 2"];
    const internalworksheet = workbook.Sheets["Internal"];
    for (let y = 0; y < sheetsQuiz.length; y++) {
      const worksheet = workbook.Sheets[sheetsQuiz[y]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      // console.log(worksheet["A5"]);
      let i = 1;
      let emptyValue;
      let arrCO = [];
      for (let key in data[3]) {
        if (data[3][key] == "Q" + i) {
          emptyValue = data[3][key];
          arrCO.push(data[5][key]);
          data[4][key] = 1;
          i++;
        }
      }
      let questioncount = i - 1;
      const CO_coverved = getUniqueValues(arrCO);
      console.log("Question count: ", questioncount);
      console.log("CO covered: ", CO_coverved);
      let s = 9;
      for (; s < 100; s++) {
        try {
          let cellToUpdate = String("A" + s);
          let z = worksheet[cellToUpdate].v;
        } catch (error) {
          break;
        }
      }
      const totalstudents = s - 10;
      console.log("total Students: ", totalstudents);

      //Max marks of CO;
      let maxCOarr = [];
      let totalmarks = [];
      for (let i = 0; i < CO_coverved.length; i++) {
        let max = 0;
        let start = 69;
        let t = 0;
        for (let j = 5; j < 5 + questioncount; j++) {
          const cellToUpdate = String(String.fromCharCode(start) + 7);
          const cellcheck = String.fromCharCode(start) + 6;
          if (worksheet[cellToUpdate].v == CO_coverved[i]) {
            max = Math.max(max, worksheet[cellcheck].v);
            t = t + worksheet[cellcheck].v;
          }
          start++;
        }
        maxCOarr.push(max);
        totalmarks.push(t);
        max = 0;
      }
      console.log("Max marks per CO: ", maxCOarr);
      console.log("Total marks per CO: ", totalmarks);
      let studenttotal = [];
      const studentdata = String(String.fromCharCode(start) + 7);
      for (let z = 0; z < totalstudents + 1; z++) {
        let studentCOtotal = [];
        for (let i = 0; i < CO_coverved.length; i++) {
          let max = 0;
          let start = 69;
          let t = 0;
          for (let j = 5; j < 5 + questioncount; j++) {
            const cellToUpdate = String(String.fromCharCode(start) + 7);
            const cellcheck = String.fromCharCode(start) + 7;
            let p = String(String.fromCharCode(start) + (9 + z));
            if (
              worksheet[cellcheck].v == CO_coverved[i] &&
              worksheet[p].v != "NA" &&
              worksheet[p].v != "AB"
            ) {
              t = t + worksheet[p].v;
            }
            start++;
          }
          // console.log("Max push", i, max);
          maxCOarr.push(max);
          studentCOtotal.push(t);
          max = 0;
        }
        studenttotal.push(studentCOtotal);
      }
      // console.log("Total marks: ", studenttotal);
      let g = 66;
      for (let o = 0; o < CO_coverved.length; o++) {
        let h = 68 + questioncount + 3;
        for (let k = 0; k < 5; k++) {
          let updatecell = String(String.fromCharCode(h) + 6);
          let updatecell1 = String(String.fromCharCode(h) + 8);
          let checkcell = String(String.fromCharCode(h) + 7);
          // console.log("Bitch",checkcell);
          if (worksheet[checkcell].v == CO_coverved[o]) {
            worksheet[updatecell].v = maxCOarr[o];
            worksheet[updatecell1].v = totalmarks[o];
            if (y == 0) {
              let updatecellinternal = String(
                String.fromCharCode(g + CO_coverved[o] - 1) +
                  (8 + studenttotal.length)
              );
              let updatecellinternal1 = String(
                String.fromCharCode(g + CO_coverved[o] - 1) +
                  (9 + studenttotal.length)
              );
              // console.log(Number(maxCOarr[o]) * 0.6, typeof maxCOarr);
              internalworksheet[updatecellinternal].v = maxCOarr[o];
              internalworksheet[updatecellinternal1].v = (
                Number(maxCOarr[o]) * 0.6
              ).toFixed(1);
            }
            if (y == 1) {
              let updatecellinternal = String(
                String.fromCharCode(g + CO_coverved[o] - 1 + 12) +
                  (8 + studenttotal.length)
              );
              let updatecellinternal1 = String(
                String.fromCharCode(g + CO_coverved[o] - 1 + 12) +
                  (9 + studenttotal.length)
              );
              // console.log(updatecellinternal);
              internalworksheet[updatecellinternal].v = maxCOarr[o];
              internalworksheet[updatecellinternal1].v = (
                Number(maxCOarr[o]) * 0.6
              ).toFixed(1);
            }
          }
          h++;
        }
      }
      let abovepass = [];
      for (let o = 0; o < CO_coverved.length; o++) {
        let totalpass = 0;
        for (let z = 0; z < totalstudents + 1; z++) {
          let h = 68 + questioncount + 3;
          for (let k = 0; k < 5; k++) {
            let updatecell = String(String.fromCharCode(h) + (9 + z));
            let checkcell = String(String.fromCharCode(h) + 7);
            if (worksheet[checkcell].v == CO_coverved[o]) {
              worksheet[updatecell].v = studenttotal[z][o];
              if (y == 0) {
                let updatecellinternal = String(
                  String.fromCharCode(g + CO_coverved[o] - 1) + (8 + z)
                );
                internalworksheet[updatecellinternal].v = studenttotal[z][o];
                if (
                  studenttotal[z][o] >= (Number(maxCOarr[o]) * 0.6).toFixed(1)
                ) {
                  totalpass++;
                }
              }
              if (y == 1) {
                let updatecellinternal = String(
                  String.fromCharCode(g + CO_coverved[o] - 1 + 12) + (8 + z)
                );
                internalworksheet[updatecellinternal].v = studenttotal[z][o];
                if (
                  studenttotal[z][o] >= (Number(maxCOarr[o]) * 0.6).toFixed(1)
                ) {
                  totalpass++;
                }
              }
            }
            h++;
          }
        }
        abovepass.push(totalpass);
      }
      console.log(abovepass);
      if (y == 0) {
        for (let k = 0; k < CO_coverved.length; k++) {
          let passupdate1 =
            String.fromCharCode(66 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 3);
          console.log(internalworksheet[passupdate1]);
          internalworksheet[passupdate1].v = abovepass[k];
          let passupdate2 =
            String.fromCharCode(66 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 4);
          let per = Number((abovepass[k] * 100) / studenttotal.length).toFixed(
            1
          );
          internalworksheet[passupdate2].v = per;
          let passupdate3 =
            String.fromCharCode(66 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 5);
          let COscore;
          if (per < 38) {
            COscore = 0;
          }
          if (per < 51) {
            COscore = 1;
          }
          if (per < 72) {
            COscore = 2;
          }
          if (per < 100) {
            COscore = 3;
          }
          internalworksheet[passupdate3].v = COscore;
        }
      }
      if (y == 1) {
        for (let k = 0; k < CO_coverved.length; k++) {
          let passupdate1 =
            String.fromCharCode(78 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 3);
          // console.log(passupdate1);
          internalworksheet[passupdate1].v = abovepass[k];
          let passupdate2 =
            String.fromCharCode(78 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 4);
          let per = Number((abovepass[k] * 100) / studenttotal.length).toFixed(
            1
          );
          internalworksheet[passupdate2].v = per;
          let passupdate3 =
            String.fromCharCode(78 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 5);
          let COscore;
          if (per < 38) {
            COscore = 0;
          }
          if (per < 51) {
            COscore = 1;
          }
          if (per < 72) {
            COscore = 2;
          }
          if (per < 100) {
            COscore = 3;
          }
          internalworksheet[passupdate3].v = COscore;
        }
      }
      console.log("Updated");
    }
    let st;
    for (let y = 0; y < sheetsSess.length; y++) {
      const worksheet = workbook.Sheets[sheetsSess[y]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      let i = 1;
      let emptyValue;
      let arrCO = [];
      for (let key in data[3]) {
        if (data[3][key] == "Q" + i) {
          emptyValue = data[3][key];
          arrCO.push(data[5][key]);
          data[4][key] = 1;
          i++;
        }
      }
      let questioncount = i - 1;
      const CO_coverved = getUniqueValues(arrCO);
      console.log("Question count: ", questioncount);
      console.log("CO covered: ", CO_coverved);
      let s = 9;
      for (; s < 100; s++) {
        try {
          let cellToUpdate = String("A" + s);
          let z = worksheet[cellToUpdate].v;
        } catch (error) {
          break;
        }
      }
      const totalstudents = s - 10;
      console.log("total Students: ", totalstudents);

      //Max marks of CO;
      let maxCOarr = [];
      let totalmarks = [];
      for (let i = 0; i < CO_coverved.length; i++) {
        let max = 0;
        let start = 69;
        let t = 0;
        for (let j = 5; j < 5 + questioncount; j++) {
          const cellToUpdate = String(String.fromCharCode(start) + 7);
          const cellcheck = String.fromCharCode(start) + 6;
          if (worksheet[cellToUpdate].v == CO_coverved[i]) {
            max = Math.max(max, worksheet[cellcheck].v);
            t = t + worksheet[cellcheck].v;
          }
          start++;
        }
        maxCOarr.push(max);
        totalmarks.push(t);
        max = 0;
      }
      console.log("Max marks per CO: ", maxCOarr);
      console.log("Total marks per CO: ", totalmarks);
      let studenttotal = [];
      const studentdata = String(String.fromCharCode(start) + 7);
      for (let z = 0; z < totalstudents + 1; z++) {
        let studentCOtotal = [];
        for (let i = 0; i < CO_coverved.length; i++) {
          let max = 0;
          let start = 69;
          let t = 0;
          for (let j = 5; j < 5 + questioncount; j++) {
            const cellToUpdate = String(String.fromCharCode(start) + 7);
            const cellcheck = String.fromCharCode(start) + 7;
            let p = String(String.fromCharCode(start) + (9 + z));
            if (
              worksheet[cellcheck].v == CO_coverved[i] &&
              worksheet[p].v != "NA" &&
              worksheet[p].v != "AB"
            ) {
              t = t + worksheet[p].v;
            }
            start++;
          }
          // console.log("Max push", i, max);
          maxCOarr.push(max);
          studentCOtotal.push(t);
          max = 0;
        }
        studenttotal.push(studentCOtotal);
      }
      // console.log("Total marks: ", studenttotal);
      let g = 66;
      for (let o = 0; o < CO_coverved.length; o++) {
        let h = 68 + questioncount + 2;
        for (let k = 0; k < 5; k++) {
          let updatecell = String(String.fromCharCode(h) + 6);
          let updatecell1 = String(String.fromCharCode(h) + 8);
          let checkcell = String(String.fromCharCode(h) + 7);
          if (worksheet[checkcell].v == CO_coverved[o]) {
            worksheet[updatecell].v = maxCOarr[o];
            worksheet[updatecell1].v = totalmarks[o];
            if (y == 0) {
              let updatecellinternal = String(
                String.fromCharCode(g + CO_coverved[o] - 1 + 6) +
                  (8 + studenttotal.length)
              );
              let updatecellinternal1 = String(
                String.fromCharCode(g + CO_coverved[o] - 1 + 6) +
                  (9 + studenttotal.length)
              );

              internalworksheet[updatecellinternal].v = maxCOarr[o];
              internalworksheet[updatecellinternal1].v = (
                Number(maxCOarr[o]) * 0.6
              ).toFixed(1);
            }
            if (y == 1) {
              let updatecellinternal = String(
                String.fromCharCode(g + CO_coverved[o] - 1 + 12 + 6) +
                  (8 + studenttotal.length)
              );
              let updatecellinternal1 = String(
                String.fromCharCode(g + CO_coverved[o] - 1 + 12 + 6) +
                  (9 + studenttotal.length)
              );
              // console.log(updatecellinternal);
              internalworksheet[updatecellinternal].v = maxCOarr[o];
              internalworksheet[updatecellinternal1].v = (
                Number(maxCOarr[o]) * 0.6
              ).toFixed(1);
            }
          }
          h++;
        }
      }
      let abovepass = [];
      for (let o = 0; o < CO_coverved.length; o++) {
        let totalpass = 0;
        for (let z = 0; z < totalstudents + 1; z++) {
          let h = 68 + questioncount + 2;
          for (let k = 0; k < 5; k++) {
            let updatecell = String(String.fromCharCode(h) + (9 + z));
            let checkcell = String(String.fromCharCode(h) + 7);
            if (worksheet[checkcell].v == CO_coverved[o]) {
              worksheet[updatecell].v = studenttotal[z][o];
              if (worksheet[checkcell].v == CO_coverved[o]) {
                worksheet[updatecell].v = studenttotal[z][o];
                if (y == 0) {
                  let updatecellinternal = String(
                    String.fromCharCode(g + CO_coverved[o] - 1 + 6) + (8 + z)
                  );
                  internalworksheet[updatecellinternal].v = studenttotal[z][o];
                  if (
                    studenttotal[z][o] >= (Number(maxCOarr[o]) * 0.6).toFixed(1)
                  ) {
                    totalpass++;
                  }
                }
                if (y == 1) {
                  let updatecellinternal = String(
                    String.fromCharCode(g + CO_coverved[o] - 1 + 12 + 6) +
                      (8 + z)
                  );
                  internalworksheet[updatecellinternal].v = studenttotal[z][o];
                  if (
                    studenttotal[z][o] >= (Number(maxCOarr[o]) * 0.6).toFixed(1)
                  ) {
                    totalpass++;
                  }
                }
              }
            }
            h++;
          }
        }
        abovepass.push(totalpass);
      }
      console.log(abovepass);
      if (y == 0) {
        for (let k = 0; k < CO_coverved.length; k++) {
          let passupdate1 =
            String.fromCharCode(72 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 3);
          // console.log(passupdate1);
          internalworksheet[passupdate1].v = abovepass[k];
          let passupdate2 =
            String.fromCharCode(72 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 4);
          let per = Number((abovepass[k] * 100) / studenttotal.length).toFixed(
            1
          );
          console.log("PErcentage", per);
          internalworksheet[passupdate2].v = per;
          let passupdate3 =
            String.fromCharCode(72 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 5);
          let COscore;
          if (per < 38) {
            COscore = 0;
          }
          if (per < 51) {
            COscore = 1;
          }
          if (per < 72) {
            COscore = 2;
          }
          if (per < 100) {
            COscore = 3;
          }
          internalworksheet[passupdate3].v = COscore;
        }
      }
      if (y == 1) {
        for (let k = 0; k < CO_coverved.length; k++) {
          let passupdate1 =
            String.fromCharCode(84 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 3);
          // console.log(passupdate1);
          internalworksheet[passupdate1].v = abovepass[k];
          let passupdate2 =
            String.fromCharCode(84 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 4);
          let per = Number((abovepass[k] * 100) / studenttotal.length).toFixed(
            1
          );
          // console.log("PErcentage", per);
          internalworksheet[passupdate2].v = per;
          let passupdate3 =
            String.fromCharCode(84 + CO_coverved[k] - 1) +
            (7 + studenttotal.length + 5);
          let COscore;
          if (per < 38) {
            COscore = 0;
          }
          if (per < 51) {
            COscore = 1;
          }
          if (per < 72) {
            COscore = 2;
          }
          if (per < 100) {
            COscore = 3;
          }
          internalworksheet[passupdate3].v = COscore;
        }
      }
      st = studenttotal.length;
      console.log("Updated");
    }
    const finalworksheet = workbook.Sheets["Final_CO_Attainment"];
    let d = 0;
    for (let u = 0; u < 4; u++) {
      for (let x = 0; x < 5; x++) {
        let passupdate2 = String.fromCharCode(66 + u) + (8 + x);
        let passupdate3 = String.fromCharCode(66 + d) + (7 + st + 5);
        finalworksheet[passupdate2] = internalworksheet[passupdate3];
        d++;
      }
    }
    // for (let u = 0; u < 5; u++) {
    //   let avg = 0;
    //   for (let x = 0; x < 4; x++) {
    //     let passupdate2 = String.fromCharCode(66 + x) + (8 + u);
    //     console.log("ada",passupdate2);
    //     avg = avg + finalworksheet[passupdate2].v;
    //   }
    //   let passupdate3 = String.fromCharCode(71) + (8 + u);
    //   finalworksheet[passupdate3].v = Number(avg/5)
    // }
    XLSX.writeFile(
      workbook,
      "upload\\data\\Result Analysis CS1502 _2022-update.xlsx"
    );

    // return res.redirect("back");
    return res.render("teacher/view-result-analysis", {
      title: "gsgsxgdxgs"
    });

  } catch (error) {
    console.log(error);
  }
};
