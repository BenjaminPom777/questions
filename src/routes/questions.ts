import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import { getQuestionsController, submitAnswersController } from '../controllers/questions'

console.log('asd')

const router = express.Router();


router.get('/', getQuestionsController);

router.post('/', submitAnswersController);






export default router;