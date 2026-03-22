const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  date: { type: Date, default: Date.now },
  priority: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  isCompleted: { type: Boolean, required: true, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User",},
});

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
