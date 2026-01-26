const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/connection");
const notesRouter = require("./routes/noteRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

app.use(express.json());

connectDB().then(() => startServer());

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", notesRouter);

const startServer = () => {
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
};
