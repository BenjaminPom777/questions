import db from './pool';
import { questions, radioAnswers, radioAnswersQuestions } from './schema'

(async () => {
   await db.insert(questions).values([
        { id: 1, questionText: 'Show me what you got', isRequired: true, type: 'free_text' },
        { id: 2, questionText: 'What language is your favorite', isRequired: false, type: 'radio' },
        { id: 3, questionText: 'What do you like about programming', isRequired: true, type: 'free_text' },
        { id: 4, questionText: 'How was the assigment', isRequired: true, type: 'radio' },
        { id: 5, questionText: 'This is conditional question ', isRequired: true, type: 'radio' },
    ])

    await db.insert(radioAnswers).values([
        {id:1 , hasFreeText: false, hasAdditionalQuestionId: null, text: 'Javascript'},
        {id:2 , hasFreeText: false, hasAdditionalQuestionId: null, text: 'Typescript'},
        {id:3 , hasFreeText: false, hasAdditionalQuestionId: null, text: 'CoffeeScript'},
        {id:4 , hasFreeText: false, hasAdditionalQuestionId: null, text: 'Easy'},
        {id:5 , hasFreeText: false, hasAdditionalQuestionId: null, text: 'Normal'},
        {id:6 , hasFreeText: false, hasAdditionalQuestionId: null, text: 'Hard'},
        {id:7 , hasFreeText: true, hasAdditionalQuestionId: null, text:  'Other'},
    ])

    await db.insert(radioAnswersQuestions).values([
        { answerId: 1, questionId: 2 }, // Javascript for "What language is your favorite"
        { answerId: 2, questionId: 2 }, // Typescript for "What language is your favorite"
        { answerId: 3, questionId: 2 }, // CoffeeScript for "What language is your favorite"
        { answerId: 4, questionId: 4 }, // Easy for "How was the assignment"
        { answerId: 5, questionId: 4 }, // Normal for "How was the assignment"
        { answerId: 6, questionId: 4 }, // Hard for "How was the assignment"
        { answerId: 7, questionId: 5 }, // Other for "This is a conditional question"
    ]);

    console.log('Mock Data inserted')
})()

