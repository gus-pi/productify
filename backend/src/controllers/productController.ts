import type { Request, Response } from 'express';
import * as queries from '../db/queries';
import { getAuth } from '@clerk/express';

export async function getAllProducts(req: Request, res: Response) {
    try {
        const products = await queries.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}

// Get single product by ID (public)
export async function getProductById(req: Request<{ id: string }>, res: Response) {
    try {
        const { id } = req.params;
        const product = await queries.getProductById(id);

        if (!product) return res.status(404).json({ error: 'Product not found' });

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}

// Get products by current user (PROTECTED)
export async function getMyProducts(req: Request, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const products = await queries.getProductsByUserId(userId);
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching user products:', error);
        res.status(500).json({ error: 'Failed to fetch user products' });
    }
}

//Create product (PROTECTED)
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { title, description, imageUrl } = req.body;

        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: 'Title, description, and imageUrl are required' });
        }

        const product = await queries.createProduct({
            title,
            description,
            imageUrl,
            userId,
        });

        res.status(201).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

//Update product (PROTECTED)
export const updateProduct = async (req: Request<{ id: string }>, res: Response) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.params;
        const { title, description, imageUrl } = req.body;

        if (!title || !description || !imageUrl) {
            return res.status(400).json({ error: 'Title, description, and imageUrl are required' });
        }

        //check if product exists and belongs to user
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: 'You can only update your own products' });
        }

        const product = await queries.updateProduct(id, {
            title,
            description,
            imageUrl,
        });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export async function deleteProduct(req: Request<{ id: string }>, res: Response) {
    try {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const { id } = req.params;

        //check if product exists and belongs to user
        const existingProduct = await queries.getProductById(id);
        if (!existingProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (existingProduct.userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own products' });
        }

        const product = await queries.deleteProduct(id);
        res.status(200).json(product);
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
}
