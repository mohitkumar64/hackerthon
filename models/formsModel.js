// models/UserSubmissions.js
const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  data: {
    type: Object,
    required: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

const userSubmissionsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    unique: true
  },
  submissions: {
    type: [submissionSchema], // array of submissions
    default: []
  }
});

module.exports = mongoose.model("UserSubmissions", userSubmissionsSchema);
