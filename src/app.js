/* eslint-disable no-undef */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const { logger, morganMiddleware } = require("./config/logger");
const routes = require("./routes/index");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const setupSwagger = require("./config/swagger");

const app = express();

/**
 * Konfigurasi Aplikasi
 */
const PORT = process.env.PORT || 3000;
const FRONTEND_URL = process.env.CLIENT_URL || "http://localhost:5173";
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Middleware
 */
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
  })
);

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

/**
 * Setup Dokumentasi API
 */
setupSwagger(app);

/**
 * Routing
 */
app.use("/api/v1", routes);

/**
 * Error Handling
 */
app.use(notFound);
app.use(errorHandler);

/**
 * Inisialisasi Server
 */
app.listen(PORT, () => {
  logger.info(`🚀 Server berjalan dalam mode ${NODE_ENV} pada port ${PORT}`);
  logger.info(
    `📚 Dokumentasi API tersedia di http://localhost:${PORT}/api-docs`
  );

  // Hanya tampilkan di development
  if (NODE_ENV === "development") {
    logger.debug("🔧 Mode pengembangan aktif");
    logger.debug(`🌐 Frontend URL: ${FRONTEND_URL}`);
  }
});
