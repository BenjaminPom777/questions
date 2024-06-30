import { mysqlTable, int, varchar, datetime, mysqlEnum, unique, boolean } from 'drizzle-orm/mysql-core';


export const questionnaires = mysqlTable('questionnaires', {
    id: int('id').primaryKey().autoincrement(),
    questionnaireName : varchar('questionnaire_name', { length: 255 }),
});

export const questionnairesQuestions = mysqlTable('questionnaires_questions', {
    questionsId: int('questions_id').references(() => questions.id),
    questionnairesId: int('questionnaires_id').references(() => questionnaires.id),
},
    (t) => ({
        unq: unique().on(t.questionsId, t.questionnairesId),
    })
);

export const questions = mysqlTable('questions', {
    id: int('id').primaryKey().autoincrement(),
    questionText: varchar('question_text', { length: 255 }),
    isRequired: boolean('is_required').notNull(),
    type: mysqlEnum('type', ['radio', 'free_text']).notNull()
});

export const radioAnswersQuestions = mysqlTable('radio_answers_questions', {
    answerId: int('answer_id').references(() => radioAnswers.id),
    questionId: int('question_id').references(() => questions.id)
},
    (t) => ({
        unq: unique().on(t.answerId, t.questionId),
    })
);

export const radioAnswers = mysqlTable('radio_answers', {
    id: int('id').primaryKey().autoincrement(),
    text: varchar('text', { length: 255 }),
    hasAdditionalQuestionId: int('has_additional_question_id').references(() => questions.id),
    hasFreeText: boolean('has_free_text').notNull()
});


export const users = mysqlTable('users', {
    id: int('id').primaryKey().autoincrement(),
    name: varchar('name', { length: 255 }),
});

export const usersQuestionsAnswers = mysqlTable('users_questions_answers', {
    userId: int('user_id').references(() => users.id),
    questionId: int('question_id').references(() => questions.id),
    answerId: int('answer_id').references(() => radioAnswers.id), // Optional reference
    questionnairesId: int('questionnaires_id').references(() => questionnaires.id), // Optional reference
    answerText: varchar('answer_text', { length: 255 }), // Optional text
},
    (t) => ({
        unq: unique('dog_dog').on(t.userId, t.questionId, t.answerId, t.questionnairesId),
    })
);
