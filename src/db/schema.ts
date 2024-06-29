import { mysqlTable, int, varchar, datetime, mysqlEnum, unique } from 'drizzle-orm/mysql-core';


export const questionnaires = mysqlTable('questionnaires', {
    id: int('id').primaryKey().autoincrement()
});

export const questions = mysqlTable('questions', {
    id: int('id').primaryKey().autoincrement(),
    questionText: varchar('question_text', { length: 255 }),
    test: varchar('test_test', { length: 255 }),
    type: mysqlEnum('type', ['radio', 'free_text']),
    createdAt: datetime('created_at')
});

export const answers = mysqlTable('answers', {
    id: int('id').primaryKey().autoincrement(),

    createdAt: datetime('created_at'),
    hasAdditionalQuestionId: int('has_additional_question_id').references(() => questions.id)
});

export const answersQuestions = mysqlTable('answers_questions', {
    answerId: int('answer_id').references(() => answers.id),
    questionId: int('question_id').references(() => questions.id),
    createdAt: datetime('created_at'),
},
    (t) => ({
        unq: unique().on(t.answerId, t.questionId),
    })
);

export const questionnairesQuestions = mysqlTable('questionnaires_questions', {
    questionsId: int('questions_id').references(() => questions.id),
    questionnairesId: int('questionnaires_id').references(() => questionnaires.id),
    createdAt: datetime('created_at'),
},
    (t) => ({
        unq: unique().on(t.questionsId, t.questionnairesId),
    })

);

export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }),
    createdAt: datetime('created_at')
});

export const usersQuestionsAnswers = mysqlTable('users_questions_answers', {
    userId: int('user_id').references(() => users.id),
    questionId: int('question_id').references(() => questions.id),
    answerId: int('answer_id').references(() => answers.id), // Optional reference
    questionnairesId: int('questionnaires_id').references(() => questionnaires.id), // Optional reference
    answerText: varchar('answer_text', { length: 255 }), // Optional text
},
    (t) => ({
        unq: unique().on(t.userId, t.questionId, t.answerId),
    })
);
