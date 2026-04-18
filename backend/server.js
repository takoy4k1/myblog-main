import "dotenv/config";
import exp from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";

import { userRoute } from "./APIs/UserApi.js";
import { authorRoute } from "./APIs/AuthorApi.js";
import { adminRoute } from "./APIs/AdminApi.js";
import { commonRouter } from "./APIs/CommonAPI.js";
const app = exp();

// middleware
app.use(cors({
  origin: [process.env.FRONTEND_URL, "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],  // Allow both ports
  credentials: true                 // FIX: required for cookies to be sent cross-origin
}));
app.use(exp.json());
app.use(cookieParser());

// routes
app.use("/user-api", userRoute);
app.use("/author-api", authorRoute);
app.use("/admin-api", adminRoute);
app.use("/common-api", commonRouter);

// database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connection success");

    const port = process.env.PORT || 10000;
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (err) {
    console.log("Err in DB connection", err);
  }
};

connectDB();

// invalid path middleware
app.use((req, res) => {
  res.status(404).json({
    message: `${req.url} is an invalid path`,
  });
});

// error handling middleware
app.use((err, req, res, next) => {

  console.log("Error name:", err.name);
  console.log("Error code:", err.code);
  console.log("Full error:", err);

  // mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation failed",
      error: err.message,
    });
  }

  // mongoose cast error
  if (err.name === "CastError") {
    return res.status(400).json({
      message: "Invalid ID format",
      error: err.message,
    });
  }

  // duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];

    return res.status(409).json({
      message: `${field} "${value}" already exists`,
    });
  }

  // default server error
  res.status(500).json({
    message: "Server side error",
  });

});