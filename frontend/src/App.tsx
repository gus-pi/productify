import { Route, Routes } from 'react-router';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import ProfilePage from './pages/ProfilePage';
import CreatePage from './pages/CreatePage';
import EditProductPage from './pages/EditProductPage';
import useAuthReq from './hooks/useAuthReq';
import useUserSync from './hooks/useUserSync';
import { Canvas } from '@react-three/fiber';
import Experience from './components/3D/Experience';

const App = () => {
    const { isClerkLoaded } = useAuthReq();
    useUserSync();
    if (!isClerkLoaded) return null;
    return (
        /* The global background color starts here */
        <div className="relative min-h-screen bg-base-100">
            {/* UI Layer */}
            {/* We remove the z-10 from this wrapper to avoid locking the children into one context */}
            <div className="relative pointer-events-none">
                {/* Explicitly set Navbar to be the highest layer */}
                <header className="relative z-50 pointer-events-auto">
                    <Navbar />
                </header>

                <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 pointer-events-auto">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/product/:id" element={<ProductPage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/create" element={<CreatePage />} />
                        <Route path="/edit/:id" element={<EditProductPage />} />
                    </Routes>
                </main>
            </div>
        </div>
    );
};
export default App;
