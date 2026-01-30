import api from './axios';
import type { Product, User } from './types';

//USERS API
export const syncUser = async (userData: User) => {
    const { data } = await api.post('/users/sync', userData);
    return data;
};

//PRODUCTS API
export const getAllProducts = async () => {
    const { data } = await api.get('/products');
    return data;
};

export const getProductById = async (id: string) => {
    const { data } = await api.get(`/products/${id}`);
    return data;
};

export const getMyProducts = async () => {
    const { data } = await api.get('/products/my');
    return data;
};

export const createProduct = async (productData: Product) => {
    const { data } = await api.post('/products', productData);
    return data;
};

export const updateProduct = async ({ id, ...productData }: { id: string } & Partial<Product>) => {
    const { data } = await api.put(`/products/${id}`, productData);
    return data;
};

export const deleteProduct = async (id: string) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
};

//COMMENTS API
export const createComment = async ({
    productId,
    content,
}: {
    productId: string;
    content: string;
}) => {
    const { data } = await api.post(`/products/${productId}`, { content });
    return data;
};

export const deleteComment = async (id: string) => {
    const { data } = await api.delete(`/comments/${id}`);
    return data;
};
