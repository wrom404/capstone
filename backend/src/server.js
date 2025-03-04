import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

app.listen(PORT, () => {
  console.log("Server is running at port", PORT);
});
