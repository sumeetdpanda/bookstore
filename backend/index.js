import express from "express";
import dotenv from "dotenv";
import { PORT } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/bookRoutes.js";
import cors from "cors";

const app = express();
dotenv.config({ path: "./.env" });

// Middleware for parsing request body
app.use(express.json());

// Middleware for using CORS POLICY
app.use(cors());

app.get("/", (req, res) => {
  console.log(req);
  return res.status(204).send("Welcome to MERN Stack Tutorial");
});

app.use("/books", booksRoute);

mongoose
  .connect(process.env.MONGO_DB_URL)
  .then(() => {
    console.log("App connected to DB");

    app.listen(PORT, () => {
      console.log(`App is listening on port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
