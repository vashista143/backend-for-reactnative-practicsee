const express = require("express");
const {
  createNote,
  getAllNotes,
  deleteNote,
  editNote,
  signin,
  signup,
} = require("../controllers/noteController");

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/notes", createNote);
router.get("/notes", getAllNotes);
router.delete("/notes/:id", deleteNote);
router.put("/notes/:id", editNote);

module.exports = router;
