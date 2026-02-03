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
    position: targetPosition, // Destructure this out...
    delay = 0,
    ...props // ...so it's not in here
}: ThreeElements['group'] & {
    spinSpeed?: number;
    delay?: number;
}) {
    const instances = React.useContext(InstancesContext);
    const spinRef = useRef<THREE.Group>(null);
    const dropRef = useRef<THREE.Group>(null!); // Use ! to tell TS it will be assigned

    const target = useMemo(
        () => new THREE.Vector3(...(targetPosition as [number, number, number])),
        [targetPosition],
    );

    // Initial position is high up in the sky
    const skyPosition = useMemo(() => target.clone().add(new THREE.Vector3(0, 15, 0)), [target]);
    const currentPos = useRef(skyPosition.clone());

    useFrame((state, delta) => {
        if (spinRef.current) {
            spinRef.current.rotation.y += spinSpeed * delta;
        }

        if (state.clock.elapsedTime > delay) {
            // Smoothly lerp from current (sky) to target (floor)
            const speed = 1 - Math.pow(0.001, delta * 0.2);
            currentPos.current.lerp(target, speed);
            dropRef.current.position.copy(currentPos.current);
        }
    });

    if (!instances) throw new Error('Bean001 must be used inside <Instances>.');

    return (
        /* 1. We manually set the initial position to the skyPosition here */
        /* 2. We use 'props' which now EXCLUDES the target position */
        <group ref={dropRef} position={skyPosition} {...props} dispose={null}>
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
