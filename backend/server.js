import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());


connectDB();


app.use("/api/auth", authRoutes);


app.get("/", (req, res) => {
  res.send("CourseHub Backend Running");
});


import courseRoutes from "./routes/courseRoutes.js";
app.use("/api/courses", courseRoutes);

import lectureRoutes from "./routes/lectureRoutes.js";

          
app.use("/api/lectures", lectureRoutes); 

import progressRoutes from "./routes/progressRoutes.js";
app.use("/api/progress", progressRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
