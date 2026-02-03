import { useAuth } from '@clerk/clerk-react';
import { Link, useNavigate, useParams } from 'react-router';
import { useProduct, useUpdateProduct } from '../hooks/useProducts';
import LoadingSpinner from '../components/LoadingSpinner';
import EditProductForm from '../components/EditProductForm';
import { useState } from 'react';
import type { NewProduct } from '../lib/types';

const EditProductPage = () => {
    const { id } = useParams();
    const { userId } = useAuth();
    const navigate = useNavigate();

    const { data: product, isLoading, error } = useProduct(id ?? '');

    if (!id) return <div>No valid id</div>;

    const updateProduct = useUpdateProduct();

    if (isLoading) return <LoadingSpinner />;

    if (error || !product || product.userId !== userId) {
        return (
            <div className="card bg-base-300 max-w-md mx-auto">
                <div className="card-body items-center text-center">
                    <h2 className="card-title text-error">
                        {!product ? 'Product not found' : 'Access denied'}
                    </h2>
                    <Link to="/" className="btn btn-primary btn-sm">
                        Go Home
                    </Link>
                </div>
            </div>
        );
    }

    const handleSubmit = (formData: NewProduct) => {
        updateProduct.mutate(
            { id, ...formData },
            {
                onSuccess: () => navigate(`/product/${id}`),
            },
        );
    };

    return (
        <EditProductForm
            product={product}
            isPending={updateProduct.isPending}
            isError={updateProduct.isError}
            onSubmit={handleSubmit}
        />
    );
};
export default EditProductPage;
