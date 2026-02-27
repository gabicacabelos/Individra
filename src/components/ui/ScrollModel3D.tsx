'use client'

import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, Center, Float } from '@react-three/drei'
import * as THREE from 'three'

interface ModelProps {
    scrollProgress: number
}

function Model({ scrollProgress }: ModelProps) {
    const groupRef = useRef<THREE.Group>(null)
    const { scene } = useGLTF('/robot-hands.glb')

    const clonedScene = useMemo(() => {
        const clone = scene.clone()
        clone.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh
                if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial
                    mat.metalness = 0.9
                    mat.roughness = 0.1
                    mat.envMapIntensity = 1.5
                }
            }
        })
        return clone
    }, [scene])

    useFrame(() => {
        if (!groupRef.current) return

        // Smooth rotation based on scroll
        const targetRotationY = scrollProgress * Math.PI * 2

        groupRef.current.rotation.y = THREE.MathUtils.lerp(
            groupRef.current.rotation.y,
            targetRotationY,
            0.08
        )

        // Subtle tilt
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            Math.sin(scrollProgress * Math.PI) * 0.2,
            0.08
        )
    })

    return (
        <Float speed={1.5} rotationIntensity={0.03} floatIntensity={0.15}>
            <group ref={groupRef}>
                <Center>
                    <primitive object={clonedScene} scale={0.35} />
                </Center>
            </group>
        </Float>
    )
}

function LoadingFallback() {
    const meshRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.elapsedTime
        }
    })

    return (
        <mesh ref={meshRef}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color="#8b5cf6" wireframe />
        </mesh>
    )
}

interface ScrollModel3DProps {
    scrollProgress: number
    className?: string
}

export function ScrollModel3D({ scrollProgress, className = '' }: ScrollModel3DProps) {
    return (
        <div className={`w-full h-full pointer-events-none ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 10], fov: 40 }}
                dpr={[1, 2]}
                gl={{ antialias: true, alpha: true }}
                style={{ background: 'transparent' }}
            >
                {/* Lighting */}
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
                <spotLight
                    position={[5, 10, 7]}
                    angle={0.3}
                    penumbra={1}
                    intensity={2}
                    color="#8b5cf6"
                    castShadow
                />
                <spotLight
                    position={[-5, 5, 7]}
                    angle={0.3}
                    penumbra={1}
                    intensity={1.5}
                    color="#3b82f6"
                />
                <pointLight position={[0, -5, 5]} intensity={0.5} color="#06b6d4" />

                <Suspense fallback={<LoadingFallback />}>
                    <Model scrollProgress={scrollProgress} />
                    <Environment preset="city" />
                </Suspense>
            </Canvas>
        </div>
    )
}

useGLTF.preload('/robot-hands.glb')
