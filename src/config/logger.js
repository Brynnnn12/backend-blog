/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const winston = require("winston");
const morgan = require("morgan");

// 1. Setup logs directory
const logsDir = path.join(__dirname, "logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// 2. Winston configuration
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    // Console transport with colorized output for development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, stack }) => {
          return `[${timestamp}] ${level}: ${stack || message}`;
        })
      ),
    }),
    // File transport for errors in production
    ...(process.env.NODE_ENV === "production"
      ? [
          new winston.transports.File({
            filename: path.join(logsDir, "error.log"),
            level: "error",
          }),
          new winston.transports.File({
            filename: path.join(logsDir, "combined.log"),
          }),
        ]
      : []),
  ],
});

// 3. Morgan configuration for HTTP logging
const morganMiddleware = morgan(
  process.env.NODE_ENV === "development" ? "dev" : "combined",
  {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
    skip: (req) => req.originalUrl === "/healthcheck",
  }
);

// Handle uncaught exceptions and rejections
process.on("unhandledRejection", (error) => {
  logger.error("Unhandled Rejection:", error);
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

module.exports = {
  logger,
  morganMiddleware,
};
