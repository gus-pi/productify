import { requireAuth } from '@clerk/express';
import { Router } from 'express';
import { createComment, deleteComment } from '../controllers/commentController';

const router = Router();

// POST /api/comments/:productId - Add comment to product (protected)
router.post('/:productId', requireAuth(), createComment);

// DELETE /api/comments/:commentId - Delete comment (protected - owner only)
router.delete('/:commentId', requireAuth(), deleteComment);

export default router;
