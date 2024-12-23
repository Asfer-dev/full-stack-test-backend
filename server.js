const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const Submission = require("./models/submission");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Routes

// Create a new submission
app.post("/api/submission/add", async (req, res) => {
  try {
    const { name, email, dob, department, comments } = req.body;

    if (!name || !email || !dob || !department) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    const newSubmission = new Submission({
      name,
      email,
      dob,
      department,
      comments,
    });

    await newSubmission.save();
    io.emit("new_submission", newSubmission);
    res.status(201).json(newSubmission);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all Submissions
app.get("/api/submission", async (req, res) => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });

    res.status(200).json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific Submission by ID
app.get("/api/submission/:id", async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);
    if (!submission) {
      return res.status(404).json({ message: "submission not found" });
    }
    res.status(200).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a submission
app.post("/api/submission/update", async (req, res) => {
  try {
    const { _id, name, email, dob, department, comments } = req.body;
    const submission = await Submission.findById(_id);

    if (!name || !email || !dob || !department) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    submission.name = name;
    submission.email = email;
    submission.dob = dob;
    submission.department = department;
    submission.comments = comments;

    await submission.save();
    res.status(200).json(submission);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Delete a submission
app.delete("/api/submission/:subid", async (req, res) => {
  try {
    const submission = await Submission.findByIdAndDelete(req.params.subid);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json("Submission deleted");
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Start the server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
