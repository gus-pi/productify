import { Environment } from '@react-three/drei';
import { Bean001, Instances } from './Bean1';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const BeanField = ({ count = 100 }) => {
    const beans = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: [
                (Math.random() - 0.5) * 15,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10 - 5,
            ] as [number, number, number],
            // Random initial orientation (tilt)
            rotation: [
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI,
            ] as [number, number, number],
            scale: 0.8 + Math.random() * 0.8,
            // Random spin speed (some spin faster, some slower, either direction)
            spinSpeed: Math.round((Math.random() * (0.5 - 0.1) + 0.1) * 10) / 10,
            delay: Math.random() * 0.1,
        }));
    }, [count]);

    return (
        <Instances>
            {beans.map((props, i) => (
                <Bean001 {...props} key={i} />
            ))}
        </Instances>
    );
};

const Experience = () => {
    const mainGroup = useRef<THREE.Group>(null!);

    useFrame((state) => {
        const { x, y } = state.pointer;
        mainGroup.current.rotation.y = THREE.MathUtils.lerp(
            mainGroup.current.rotation.y,
            x * 0.12,
            0.02,
        );
        mainGroup.current.rotation.x = THREE.MathUtils.lerp(
            mainGroup.current.rotation.x,
            -y * 0.12,
            0.02,
        );
    });

    return (
        <group ref={mainGroup}>
            <BeanField count={150} />

            <Environment preset="studio" environmentIntensity={1} />
        </group>
    );
};
export default Experience;
