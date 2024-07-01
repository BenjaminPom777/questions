import { Request, Response } from 'express-serve-static-core';
import { questions, questionnairesQuestions, questionnaires, radioAnswers, radioAnswersQuestions, usersQuestionsAnswers } from '../db/schema';
import db from './../db/pool';
import { eq } from 'drizzle-orm';
import { alias } from 'drizzle-orm/mysql-core';
import { v4 as uuidv4 } from 'uuid';

interface RadioAnswer {
    id: number;
    text: string | null;
    hasAdditionalQuestionId: number | null;
    hasFreeText: boolean;
    additionalQuestion?: {
        id: number | null;
        questionText: string | null;
    } | null;
}

interface Question {
    id: number;
    text: string | null;
    isRequired: boolean;
    type: 'radio' | 'free_text';
    radioAnswers: RadioAnswer[];
}

interface QuestionMap {
    [key: number]: Question;
}

interface QueryResult {
    questionnaires: {
        id: number;
        questionnaireName: string | null;
    };
    questionnairesQuestions: {
        questionsId: number | null;
        questionnairesId: number | null;
    } | null;
    questions: {
        id: number;
        questionText: string | null;
        isRequired: boolean;
        type: 'radio' | 'free_text';
    } | null;
    radioAnswersQuestions: {
        answerId: number | null;
        questionId: number | null;
    } | null;
    radioAnswers: {
        id: number;
        text: string | null;
        hasAdditionalQuestionId: number | null;
        hasFreeText: boolean;
    } | null;
    additional_question: {
        id: number | null;
        questionText: string | null;
    } | null;
}

export const getQuestionsController = async (req: Request, res: Response) => {
    const questionnaireId = 1; // Assuming this is provided from backoffice
    try {
        const additional_question = alias(questions, 'additional_question');

        const questionsData: QueryResult[] = await db
            .select({
                questionnaires: {
                    id: questionnaires.id,
                    questionnaireName: questionnaires.questionnaireName
                },
                questionnairesQuestions: {
                    questionsId: questionnairesQuestions.questionsId,
                    questionnairesId: questionnairesQuestions.questionnairesId
                },
                questions: {
                    id: questions.id,
                    questionText: questions.questionText,
                    isRequired: questions.isRequired,
                    type: questions.type
                },
                radioAnswersQuestions: {
                    answerId: radioAnswersQuestions.answerId,
                    questionId: radioAnswersQuestions.questionId
                },
                radioAnswers: {
                    id: radioAnswers.id,
                    text: radioAnswers.text,
                    hasAdditionalQuestionId: radioAnswers.hasAdditionalQuestionId,
                    hasFreeText: radioAnswers.hasFreeText
                },
                additional_question: {
                    id: additional_question.id,
                    questionText: additional_question.questionText
                }
            })
            .from(questionnaires)
            .leftJoin(questionnairesQuestions, eq(questionnaires.id, questionnairesQuestions.questionnairesId))
            .leftJoin(questions, eq(questions.id, questionnairesQuestions.questionsId))
            .leftJoin(radioAnswersQuestions, eq(questions.id, radioAnswersQuestions.questionId))
            .leftJoin(radioAnswers, eq(radioAnswers.id, radioAnswersQuestions.answerId))
            .leftJoin(additional_question, eq(radioAnswers.hasAdditionalQuestionId, additional_question.id))
            .where(eq(questionnaires.id, questionnaireId));

        // Restructure the data
        const questionnaire = {
            questionnaireId: questionsData[0].questionnaires.id,
            questionnaireName: questionsData[0].questionnaires.questionnaireName,
            questions: [] as Question[]
        };

        const questionsMap: QuestionMap = {};

        questionsData.forEach((item) => {
            if (item.questions) {
                const questionId = item.questions.id;
                if (!questionsMap[questionId]) {
                    questionsMap[questionId] = {
                        id: questionId,
                        text: item.questions.questionText,
                        isRequired: item.questions.isRequired,
                        type: item.questions.type,
                        radioAnswers: []
                    };
                    questionnaire.questions.push(questionsMap[questionId]);
                }
                if (item.radioAnswers && item.radioAnswers.id) {
                    const radioAnswer: RadioAnswer = {
                        id: item.radioAnswers.id,
                        text: item.radioAnswers.text,
                        hasAdditionalQuestionId: item.radioAnswers.hasAdditionalQuestionId,
                        hasFreeText: item.radioAnswers.hasFreeText
                    };
                    if (item.additional_question) {
                        radioAnswer.additionalQuestion = {
                            id: item.additional_question.id,
                            questionText: item.additional_question.questionText
                        };
                    }
                    questionsMap[questionId].radioAnswers.push(radioAnswer);
                }
            }
        });

        res.json(questionnaire);
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};

interface Answer {
    questionId: number;
    answerId?: number; // Optional, for radio answers
    answerText?: string; // Optional, for free text answers
}

interface SubmitAnswersRequest {
    userId: number;
    questionnaireId: number;
    answers: Answer[];
}


export const submitAnswersController = async (req: Request, res: Response) => {
    const { userId, questionnaireId, answers }: SubmitAnswersRequest = req.body;
    const submissionId = uuidv4(); // Generate a random UUID for the submission

    try {
        // Validate the request body
        if (!userId || !questionnaireId || !answers || !Array.isArray(answers)) {
            return res.status(400).json({ message: 'Invalid request body' });
        }

        // Insert each answer into the database
        for (const answer of answers) {
            if (!answer.questionId) {
                return res.status(400).json({ message: 'Invalid answer data' });
            }

            await db.insert(usersQuestionsAnswers).values({
                userId,
                questionnairesId: questionnaireId,
                questionId: answer.questionId,
                answerId: answer.answerId || null,
                answerText: answer.answerText || null,
                submissionId,
                createdAt: new Date()
            });
        }

        res.status(201).json({ message: 'Answers submitted successfully' });
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        } else {
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
};
