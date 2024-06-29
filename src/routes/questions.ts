import express from 'express';
import { Request, Response } from 'express-serve-static-core';


const router = express.Router();


router.get('/', (req: Request, res: Response) => {
    console.log('qustions')
    res.send('ok')    
});






export default router;