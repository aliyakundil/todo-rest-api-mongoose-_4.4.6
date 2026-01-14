import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { connectToDb, getDb } from './config/database';

const app = express();
const PORT = process.env.PORT || 3000;

let db: unknown;

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", routes);

app.get("/", (_req, res) => {
  res.json({
    name: "Todo REST API",
    version: "1.0.0",
    links: {
      api: "/api",
      health: "/api/health",
      todos: "/api/todos",
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Обработка неизвестных маршрутов
app.use(notFoundHandler);

// Глобальный обработчик ошибок
app.use(errorHandler);

connectToDb((err?: Error) => {
  if(!err) {
    app.listen(PORT, () => {
      console.log("Server started on port 3000");
    });
    db = getDb();
  }
})
