// Import
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import morgan from "morgan";
import colors from "colors";
import path from 'path';
import connectDb from "./config/dbConfig.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoute from "./routes/authRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import productRoute from "./routes/productRoute.js";

// Setting
const app = express();
const publicRoot = './client/build';
dotenv.config();
const PORT = process.env.PORT || 8080;
connectDb();
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Trabajo Final - Horus Santeria",
      version: "1.0.0",
      description: "Comisión 43385 - Documentar API - Trabajo Final 2023",
      contact: {
        name: "Ariel",
      },
      servers: ["http://localhost:8080"],
    },
  },
  apis: ["./docs/**/*.yaml"],
};
const specs = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(errorHandler);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.static(publicRoot));

// Routes
app.use("/auth", authRoute);
app.use("/category", categoryRoute);
app.use("/products", productRoute);
app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));
app.get('*', function(req, res) {
  res.sendFile(path.join(publicRoot, './client/build/index.html'));
});

// Server
const httpServer = app.listen(PORT, async () => {
  console.log(
    `Server corriendo en ${process.env.DEV_MODE.blue} mode on port ${PORT}`
      .bgMagenta.white
  );
});
httpServer.on("error", (error) => console.log(`Error: ${error}`.bgRed.white));
