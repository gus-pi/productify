import * as THREE from 'three';
import { Merged, useGLTF, type InstanceProps } from '@react-three/drei';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useFrame, type ThreeElements } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';

type GLTFAction = THREE.AnimationClip;

type GLTFResult = GLTF & {
    nodes: { bean_06: THREE.Mesh };
    materials: { LP: THREE.MeshStandardMaterial };
    animations: GLTFAction[];
};

type MergedContext = Record<string, React.FC<InstanceProps>>;
type InstanceNames = { Bean: React.FC<InstanceProps> };

const InstancesContext = React.createContext<InstanceNames | null>(null);

type InstancesProps = React.PropsWithChildren<Omit<ThreeElements['group'], 'ref'>>;

export function Instances({ children, ...groupProps }: InstancesProps) {
    const { nodes } = useGLTF('models/bean1.glb') as unknown as GLTFResult;

    const meshes = React.useMemo(() => ({ Bean: nodes.bean_06 }), [nodes]);

    return (
        <Merged meshes={meshes} {...groupProps}>
            {(instances: MergedContext) => (
                <InstancesContext.Provider value={instances as InstanceNames}>
                    {children}
                </InstancesContext.Provider>
            )}
        </Merged>
    );
}

export function Bean001({
    spinSpeed = 1,
    rotation: initialRotation,
    position: targetPosition,
    delay = 0, // Optional: stagger drops (seconds)
    ...props
}: ThreeElements['group'] & {
    spinSpeed?: number;
    delay?: number;
}) {
    const instances = React.useContext(InstancesContext);
    const spinRef = useRef<THREE.Group>(null);
    const dropRef = useRef<THREE.Group>(null);

    // Target position (where it should end up)
    const target = useMemo(
        () => new THREE.Vector3(...(targetPosition as [number, number, number])),
        [targetPosition],
    );
    // Start position (20 units above target)
    const current = useRef(target.clone().add(new THREE.Vector3(0, 20, 0)));

    useFrame((state, delta) => {
        // Spinning
        if (spinRef.current) {
            spinRef.current.rotation.y += spinSpeed * delta;
        }

        // Dropping (wait for delay, then fall)
        if (dropRef.current && state.clock.elapsedTime > delay) {
            // Exponential ease-out for that "slotting in" feel (adjust 4 for speed)
            const speed = 1 - Math.pow(0.001, delta * 0.2);
            current.current.lerp(target, speed);
            dropRef.current.position.copy(current.current);
        }
    });

    if (!instances) throw new Error('Bean001 must be used inside <Instances>.');

    return (
        <group ref={dropRef} {...props} dispose={null}>
            <group rotation={initialRotation}>
                <group ref={spinRef}>
                    <instances.Bean
                        position={[0, 0, 0]}
                        rotation={[Math.PI / 2, Math.PI / 2, 0]}
                        scale={16.836}
                    />
                </group>
            </group>
        </group>
    );
}

useGLTF.preload('models/bean1.glb');
