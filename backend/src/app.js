const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const errorHandler = require("./middleware/error.middleware");
const authRoutes = require("./routes/auth.routes");
const applicationRoutes = require("./routes/application.routes");
const documentRoutes = require("./routes/document.routes");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(generalLimiter);


app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Provisional Certificate API is running",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use(errorHandler);



module.exports = app;