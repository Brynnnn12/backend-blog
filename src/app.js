/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const routes = require("./routes/index");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

/**
 * * Middleware
 */
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/**
 * * Routes
 */
app.use("/api/v1", routes);

/**
 * * * Error handling middleware
 */

/**
 * *Port
 * Ambil PORT dari env
 */
const PORT = process.env.PORT || 3000; // fallback ke 3000 kalau PORT di env kosong

/**
 * * Listen
 */
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
