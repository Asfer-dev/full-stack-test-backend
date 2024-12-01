// server.js

// Required modules
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const WebSocket = require("ws");

// Create an Express app
const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Set up WebSocket server
const wss = new WebSocket.Server({ server });

// Broadcast function: sends messages to all connected clients
function broadcastMessage(message) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// When a client connects to WebSocket
wss.on("connection", (ws) => {
  console.log("A new WebSocket connection has been made");

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log("Received message:", message);
    // Broadcast the received message to all clients
    broadcastMessage(message);
  });

  // Send a welcome message when a client connects
  ws.send("Connected to WebSocket server");
});

// Middleware
app.use(cors());
app.use(express.json()); // To parse incoming JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Define the User schema and model
const submissionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  department: { type: String, required: true },
  comments: { type: String, optional: true },
});

const Submission = mongoose.model("User", submissionSchema);

// Routes

// Create a new submission
app.post("/api/submission/add", async (req, res) => {
  try {
    const { name, email, dob, department, comments } = req.body;
    const newSubmission = new Submission({
      name,
      email,
      dob,
      department,
      comments,
    });

    await newSubmission.save();
    broadcastMessage(JSON.stringify(newSubmission));
    res.status(201).json(newSubmission);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

// Get all Submissions
app.get("/api/submission", async (req, res) => {
  try {
    const submissions = await Submission.find();

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
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
