import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import routes from "./routes/index";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { connectToDb, getDb } from './config/database';
import { getDbStatus } from './config/database';

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
      health: "/health",
      todos: "/api/todos",
    },
  });
});

app.get('/health', async (req, res) => {
  try {
    const db = getDb();

    await db.command({ ping: 1})

    res.json({
    ...getDbStatus(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
  } catch (err) {
    res.status(503).json({
      ...getDbStatus(),
      db: "disconnected",
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    })
  }
});

async function startServer() {
  try {
    await connectToDb();

    app.listen(PORT, () => {
      console.log("Server started on port 3000");
    });

  } catch(err) {
    console.log("Failed to start server: ", err)
    process.exit(1);
  }
}

startServer();

// Обработка неизвестных маршрутов
app.use(notFoundHandler);

// Глобальный обработчик ошибок
app.use(errorHandler);