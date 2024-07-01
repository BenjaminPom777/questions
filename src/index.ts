import express from 'express';
import questionsRouter from './routes/questions';

const app = express();

app.use(express.json());

const PORT = 3000;

app.use('/api/questions', questionsRouter);



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});