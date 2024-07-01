import { Request, Response } from 'express-serve-static-core';
import { questions, questionnairesQuestions, questionnaires, radioAnswers, radioAnswersQuestions } from '../db/schema';
import db from './../db/pool';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';

export const getQuestionsController = async (req: Request, res: Response) => {
    const questionnaireId = 1; // Assuming this is provided from backoffice
    try {
        // const questionsData: QueryResult[] = await db

        // SELECT * 
        // FROM
        // questionnaires join questionnaires_questions
        // on questionnaires_questions.questionnaires_id = questionnaires.id
        // join questions 
        // on questions.id = questionnaires_questions.questions_id
        // left join radio_answers_questions 
        // on questions.id = radio_answers_questions.question_id
        // left join radio_answers
        // on radio_answers.id = radio_answers_questions.answer_id
        // left join questions as additional_question
        // on radio_answers.has_additional_question_id = additional_question.id

        
        const additional_question = alias(questions, 'additional_question');

        const data = await db
            .select()
            .from(questionnaires)
            .leftJoin(questionnairesQuestions, eq(questionnaires.id, questionnairesQuestions.questionnairesId))
            .leftJoin(questions, eq(questions.id, questionnairesQuestions.questionsId))
            .leftJoin(radioAnswersQuestions, eq(questions.id, radioAnswersQuestions.questionId))
            .leftJoin(radioAnswers, eq(radioAnswers.id, radioAnswersQuestions.answerId))
            .leftJoin(additional_question, eq(radioAnswers.hasAdditionalQuestionId, additional_question.id))

        console.log(data)


        res.json(data);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};
