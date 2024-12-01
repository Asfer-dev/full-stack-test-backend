const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  comments: { type: String, optional: true },
});

const Submission = mongoose.model("User", submissionSchema);
module.exports = Submission;
