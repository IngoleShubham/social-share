import express from 'express';
import { addComment, getComments } from '../controllers/commentController.js';

const router = express.Router();

router.get('/getAllComments/:postId', getComments);
router.post('/addComment', addComment);


export default router;