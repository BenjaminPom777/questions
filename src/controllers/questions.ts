import { Request, Response } from 'express-serve-static-core';
import { questions, questionnairesQuestions, questionnaires, radioAnswers, radioAnswersQuestions } from '../db/schema'
import db from './../db/pool';
import { eq } from 'drizzle-orm';

export const getQuestionsController = async (req: Request, res: Response) => {
    // Assume we will pull it for questionnaire id 1 and it is decided somewhere from backoffice
    const questionnaireId = 1;
    try {
        console.log('test')
        // Fetch the questions for the given questionnaire
        const questionsData = await db.select({
            questionnaires,
            questionnairesQuestions,
            questions,
            radioAnswersQuestions,
            radioAnswers,
        }).from(questionnaires)
            .innerJoin(questionnairesQuestions, eq(questionnaires.id, questionnairesQuestions.questionnairesId))
            .innerJoin(questions, eq(questions.id, questionnairesQuestions.questionsId))
            .innerJoin(radioAnswersQuestions, eq(questions.id, radioAnswersQuestions.questionId))
            .innerJoin(radioAnswers, eq(radioAnswers.id, radioAnswersQuestions.answerId))
            .where(eq(questionnaires.id, questionnaireId))

            

        console.log(questionsData)
        res.json(questionsData)

    } catch (error) {
        if (error instanceof Error) {
            //in real life we would no send error to the client
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}