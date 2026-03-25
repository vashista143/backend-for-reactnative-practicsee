const Note = require("../models/Note");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const getAllNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.userId }).select("-__v");

    res.status(200).json({ success: true, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const createNote = async (req, res) => {
  try {
    const noteData = {
      ...req.body,
      user: req.user.userId,
    };

    const result = await Note.create(noteData);

    res.status(201).json({
      message: "Note created successfully",
      note: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      user: req.user.userId,
    });

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.status(200).json({ message: "Note deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editNote = async (req, res) => {
  try {
    const noteId = req.params.id;

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        user: req.user.userId,
      },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      note: updatedNote,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const signup = async (req, res) => {
  console.log("signup hit")
  try {
    const { name, email, password } = req.body;
    console.log(req.body)
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

    const accessToken = jwt.sign(
      { userId: user._id },
      "access_secret",
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      "refresh_secret",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
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

const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(403).json({ error: "User not found" });
    }

    const newAccessToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: "15m" }
    );

    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: "Invalid refresh token" });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  editNote,
  deleteNote,
  signup,
  signin,
  refreshTokenController
};
