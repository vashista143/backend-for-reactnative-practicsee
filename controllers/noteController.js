const Note = require("../models/Note");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllNotes = async (req, res) => {
  console.log("Fetching all notes");
  try {
    const notes = await Note.find().select("-__v");
    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error("Error creating note: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createNote = async (req, res) => {
  console.log(req.body);
  try {
    const noteData = req.body;
    const result = await Note.create(noteData);

    res
      .status(201)
      .json({ message: "Note created successfully", note: result });
  } catch (error) {
    console.error("Error creating note: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    if (!noteId) {
      return res.status(400).json({ error: "missing id" });
    }

    const deletedNote = await Note.findByIdAndDelete(noteId);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json({ message: "note deleted" });
  } catch (error) {
    console.error("Error creating note: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editNote = async (req, res) => {
  try {
    const noteId = req.params.id;
    if (!noteId) {
      return res.status(400).json({ error: "Missing note id" });
    }
    const updates = req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      noteId,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.status(200).json({
      success: true,
      note: updatedNote,
    });
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const signin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { userId: user._id },
      "your_jwt_secret", // move to .env in real apps
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  editNote,
  deleteNote,
  signup,
  signin
};
