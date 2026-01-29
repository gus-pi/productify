import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getAllProducts,
    getMyProducts,
    getProductById,
    updateProduct,
} from '../controllers/productController';
import { requireAuth } from '@clerk/express';

const router = Router();

// Get /api/products => Get all products (PUBLIC)
router.get('/', getAllProducts);

// GET /api/products/my - Get current user's products (protected)
router.get('/my', requireAuth(), getMyProducts);

// GET /api/products/:id - Get single product by ID (public)
router.get('/:id', getProductById);

// POST /api/products - Create new product (protected)
router.post('/', requireAuth(), createProduct);

// PUT /api/products/:id - Update product (protected - owner only)
router.put('/:id', requireAuth(), updateProduct);

// DELETE /api/products/:id - Delete product (protected - owner only)
router.delete('/:id', requireAuth(), deleteProduct);

export default router;
