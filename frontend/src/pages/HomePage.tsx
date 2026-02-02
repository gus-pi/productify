import { Canvas } from '@react-three/fiber';
import Experience from '../components/3D/Experience';

const HomePage = () => {
    return (
        <div className="relative">
            {/* 3D Background Layer */}
            {/* z-0 puts it behind main (z-10) and Navbar (z-50) */}
            <div className="fixed inset-0 z-0">
                <Canvas camera={{ position: [0, 0, 5], fov: 35, near: 0.1, far: 50 }}>
                    <Experience />
                </Canvas>
            </div>

            {/* Home content (still under App's z-10 shell, but this is fine) */}
            <div className="relative">HomePage</div>
        </div>
    );
};

export default HomePage;
