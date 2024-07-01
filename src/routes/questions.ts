import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { getQuestionsController } from '../controllers/questions'

console.log('asd')

const router = express.Router();


router.get('/', getQuestionsController);

router.post('/', (req: Request, res: Response) => {
    console.log('qustions')
    res.send('ok')
});






export default router;