import { Canvas } from '@react-three/fiber';
import Experience from '../components/3D/Experience';
import { useProducts } from '../hooks/useProducts';
import LoadingSpinner from '../components/LoadingSpinner';
import { SignInButton, useAuth } from '@clerk/clerk-react';
import { PackageIcon, SparklesIcon } from 'lucide-react';
import { Suspense } from 'react';
import { Preload } from '@react-three/drei';
import { Link } from 'react-router';
import type { Product } from '../lib/types';
import ProductCard from '../components/ProductCard';

const HomePage = () => {
    const { data: products, isLoading, error } = useProducts();
    const { isSignedIn } = useAuth();

    if (isLoading) return <LoadingSpinner />;

    if (error) {
        return (
            <div role="alert" className="alert alert-error">
                Something went wrong. Please refresh the page.
            </div>
        );
    }

    return (
        <div className="space-y-16">
            {/* 3D Background Layer */}
            {/* z-0 puts it behind main (z-10) and Navbar (z-50) */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 35, near: 0.1, far: 50 }}>
                    <Suspense fallback={null}>
                        <Experience />
                        <Preload all />
                    </Suspense>
                </Canvas>
            </div>

            {/* Home content (still under App's z-10 shell, but this is fine) */}
            <div className="relative">
                {/* HERO */}
                <div className="hero backdrop-blur-sm bg-base-300/40 rounded-box overflow-hidden">
                    <div className="hero-content flex-col lg:flex-row-reverse gap-10 py-10">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full scale-110" />
                            <img
                                src="/coffee-bag.png"
                                alt="Creator"
                                className="relative h-64 lg:h-72 rounded-2xl shadow-2xl"
                            />
                        </div>
                        <div className="text-center lg:text-left">
                            <h1 className="text-4xl lg:text-5xl font-bold leading-tight">
                                Show off your <span className="text-primary">coffee</span>
                            </h1>
                            <p className="py-4 text-base-content/60">
                                Upload, discover, and connect with coffee roaster and distributors.
                            </p>
                            {isSignedIn ? (
                                <Link to="/create" className="btn btn-primary btn-sm mt-2">
                                    Create Listing
                                </Link>
                            ) : (
                                <SignInButton mode="modal">
                                    <button className="btn btn-primary">
                                        <SparklesIcon className="size-4" />
                                        Start Selling
                                    </button>
                                </SignInButton>
                            )}
                        </div>
                    </div>
                </div>
                {/* PRODUCTS */}
                <div className="text-xl font-bold flex items-center gap-2 mb-4">
                    <h2>All Listings</h2>
                </div>
                {products.length === 0 ? (
                    <div className="card bg-base-300/50">
                        <div className="card-body items-center text-center py-16">
                            <PackageIcon className="size-16 text-base-content/20" />
                            <h3 className="card-title text-base-content/50">No listings yet</h3>
                            <p className="text-base-content/40 text-sm">
                                Be the first to share something!
                            </p>
                            <Link to="/create" className="btn btn-primary btn-sm mt-2">
                                Create Listing
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HomePage;
