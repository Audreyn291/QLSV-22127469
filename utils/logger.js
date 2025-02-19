import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn hiện tại
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình Winston logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(__dirname, "../logs/app.log"),
      maxsize: 5 * 1024 * 1024, // 5MB
      maxFiles: 5, 
      tailable: true
    })
  ]
});

export default logger;