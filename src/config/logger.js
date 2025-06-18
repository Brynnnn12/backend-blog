/* eslint-disable no-undef */
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const winston = require("winston");
const { combine, timestamp, printf, colorize, align, errors } = winston.format;

// =============================================
// KONFIGURASI LOGGER
// =============================================

// 1. Konfigurasi Warna untuk Logging
const logColors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "cyan",
  verbose: "blue",
};

winston.addColors(logColors);

// 2. Buat folder logs jika belum ada
const ensureLogsDirectory = (logDir) => {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

const logsDir =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "logs")
    : path.join(__dirname, "logs");

ensureLogsDirectory(logsDir);

// 3. Format Logging yang Lebih Kaya
const advancedFormat = combine(
  errors({ stack: true }), // Menampilkan stack trace untuk error
  timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  colorize({ all: true }),
  align(),
  printf(({ timestamp, level, message, stack }) => {
    const logMessage = `[${timestamp}] ${level}: ${message}`;
    return stack ? `${logMessage}\n${stack}` : logMessage;
  })
);

// 4. Transport Configuration
const transports = {
  console: new winston.transports.Console({
    format: advancedFormat,
    level: process.env.LOG_LEVEL || "debug",
  }),
  errorFile: new winston.transports.File({
    filename: path.join(logsDir, "error.log"),
    level: "error",
    format: combine(
      timestamp(),
      printf(({ timestamp, level, message, stack }) => {
        return `[${timestamp}] ${level}: ${stack || message}`;
      })
    ),
    maxsize: 5242880, // 5MB
    maxFiles: 7, // Keep 7 days
  }),
  combinedFile: new winston.transports.File({
    filename: path.join(logsDir, "combined.log"),
    format: combine(
      timestamp(),
      printf(({ timestamp, level, message }) => {
        return `[${timestamp}] ${level}: ${message}`;
      })
    ),
    maxsize: 5242880,
    maxFiles: 7,
  }),
  exceptions: new winston.transports.File({
    filename: path.join(logsDir, "exceptions.log"),
    handleExceptions: true,
    maxsize: 5242880,
    maxFiles: 7,
  }),
  rejections: new winston.transports.File({
    filename: path.join(logsDir, "rejections.log"),
    handleRejections: true,
    maxsize: 5242880,
    maxFiles: 7,
  }),
};

// 5. Logger Configuration
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  transports: [
    transports.console,
    ...(process.env.NODE_ENV === "production"
      ? [transports.errorFile, transports.combinedFile]
      : []),
  ],
  exceptionHandlers: [transports.exceptions],
  rejectionHandlers: [transports.rejections],
  exitOnError: false, // Jangan exit pada handled exceptions
});

// =============================================
// KONFIGURASI MORGAN
// =============================================

// 1. Custom Morgan Tokens
morgan.token("id", (req) => req.id || "NO_REQUEST_ID");
morgan.token("body", (req) => JSON.stringify(req.body));

// 2. Morgan Middleware Configuration
const morganMiddleware = morgan(
  process.env.NODE_ENV === "development"
    ? ":method :url :status :response-time ms - :res[content-length]"
    : "[:date[iso]] :id :method :url :status :response-time ms :res[content-length] - :body",
  {
    stream: {
      write: (message) => {
        const status = message.split(" ")[2];

        if (status >= 400) {
          logger.error(`HTTP ${message.trim()}`);
        } else if (status >= 300) {
          logger.warn(`HTTP ${message.trim()}`);
        } else {
          logger.http(`HTTP ${message.trim()}`);
        }
      },
    },
    skip: (req) => req.originalUrl === "/healthcheck", // Skip healthcheck
  }
);

// =============================================
// UTILITAS TAMBAHAN
// =============================================

// Fungsi untuk log unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
});

// Fungsi untuk log uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error(`Uncaught Exception: ${error.message}`, error);
  process.exit(1);
});

// Export logger dan middleware
module.exports = {
  logger,
  morganMiddleware,
  // Export untuk testing
  _test: {
    logsDir,
    transports,
  },
};
