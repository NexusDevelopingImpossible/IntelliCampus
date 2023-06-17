const MarksScheme = require("../models/marksScheme");

module.exports.setMaxMarks = async (req, res) => {
  try {
    let { maxMarks, examType, timeTableCode } = req.body;
    timeTableCode = timeTableCode.replace(/\s/g, "");

    if (!maxMarks || !examType || !timeTableCode) {
      console.log("Error in updating marks");
    }

    const existingMarks = await MarksScheme.findOne({
      timeTableId: timeTableCode,
    });

    if (existingMarks) {
      const updatedMarks = await MarksScheme.findOneAndUpdate(
        {
          timeTableId: timeTableCode,
        },
        {
          $set: {
            [`examMaxMarks.${examType}`]: maxMarks,
          },
        },
        { new: true }
      );
      updatedMarks.save();
      return res.redirect("back");
    }

    const examMaxMarks = {
      [examType]: maxMarks,
    };

    const newMaxMarks = new MarksScheme({
      timeTableId: timeTableCode,
      examMaxMarks,
    });
    console.log("New marks: ", newMaxMarks);
    await newMaxMarks.save();
    return res.redirect("back");
  } catch (err) {
    console.log("Error: ", err);
  }
};
