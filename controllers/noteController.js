const Note = require("../models/Note");

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

module.exports = {
  createNote,
  getAllNotes,
  editNote,
  deleteNote,
};
