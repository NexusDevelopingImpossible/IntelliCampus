const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const UPLOAD_Path = path.join("/upload/studentsProfile/documents");

const studentsProfileSchema = new mongoose.Schema(
  {
    regnNo: {
      type: String,
      required: true,
      unique: true,
    },
    DOB: {
      type: String,
    },
    gender: {
      type: String,
    },
    phoneNo: {
      type: String,
    },
    phoneNoWhatsapp: {
      type: String,
    },
    officialEmail: {
      type: String,
    },
    bloodGroup: {
      type: String,
    },
    aadharNo: {
      type: String,
    },
    category: {
      type: String,
    },

    motherTongue: {
      type: String,
    },

    fatherName: {
      type: String,
    },

    fatherOccupation: {
      type: String,
    },

    motherName: {
      type: String,
    },

    motherOccupation: {
      type: String,
    },

    parentPAN: {
      type: String,
    },

    parentAadhar: {
      type: String,
    },

    parentPhoneNo: {
      type: String,
    },

    parentWhatsappNo: {
      type: String,
    },

    parentEmailId: {
      type: String,
    },

    parentAnnualIncome: {
      type: String,
    },

    permanentAddress: {
      type: String,
    },

    correspondentAddress: {
      type: String,
    },

    PINCode: {
      type: String,
    },

    state: {
      type: String,
    },

    district: {
      type: String,
    },

    city: {
      type: String,
    },

    LGpresent: {
      type: String,
    },

    LGname: {
      type: String,
    },

    LGcontactNo: {
      type: String,
    },

    LGaddress: {
      type: String,
    },

    TGname: {
      type: String,
    },

    TGphone: {
      type: String,
    },

    TGwhatsapp: {
      type: String,
    },

    TGemail: {
      type: String,
    },

    latestQualification: {
      type: String,
    },

    specializationCourse: {
      type: String,
    },

    board: {
      type: String,
    },

    instituteName: {
      type: String,
    },

    yearOfPassing: {
      type: String,
    },

    physicsMarks: {
      type: String,
    },

    chemistryMarks: {
      type: String,
    },

    mathematicsMarks: {
      type: String,
    },

    biologyMarks: {
      type: String,
    },

    englishMarks: {
      type: String,
    },

    computerMarks: {
      type: String,
    },

    optionalMarks1: {
      type: String,
    },

    optionalMarks2: {
      type: String,
    },

    optionalMarks3: {
      type: String,
    },

    optionalMarks4: {
      type: String,
    },

    totalMarks: {
      type: String,
    },

    totalMarksObtained: {
      type: String,
    },

    totalPercentageObtained: {
      type: String,
    },
    fileexcel: {
      type: Array,
    },

    //   testFile2: {
    //         type:String,
    //     },
  },
  {
    timestamps: true,
  }
);

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", UPLOAD_Path));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});

studentsProfileSchema.statics.uploadedFiles = multer({
  storage: storage,
}).array("fileexcel", 5);
studentsProfileSchema.statics.filePath = UPLOAD_Path;

const studentsProfile = mongoose.model(
  "studentsProfile",
  studentsProfileSchema
);
module.exports = studentsProfile;
