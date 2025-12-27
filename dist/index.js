import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes/index';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';
const app = express();
const PORT = 3000;
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', routes);
app.get('/', (_req, res) => {
    res.json({
        name: 'Todo REST API',
        version: '1.0.0',
        links: {
            api: '/api',
            health: '/api/health',
            todos: '/api/todos'
        }
    });
});
// Обработка неизвестных маршрутов
app.use(notFoundHandler);
// Глобальный обработчик ошибок
app.use(errorHandler);
app.listen(PORT, () => {
    console.log('Server started on port 3000');
});
/*
Не забудь установить зависимости
npm install cors helmet morgan


(и типы, если нужно)

npm install -D @types/cors @types/morga
*/ 
