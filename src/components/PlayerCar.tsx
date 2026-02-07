import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function PlayerCar() {
  const exhaustRef = useRef<THREE.PointLight>(null)
  const engineGlowRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    // Flickering exhaust
    if (exhaustRef.current) {
      exhaustRef.current.intensity = 2 + Math.sin(state.clock.elapsedTime * 20) * 0.5
    }
    // Pulsing engine glow
    if (engineGlowRef.current) {
      const material = engineGlowRef.current.material as THREE.MeshStandardMaterial
      material.emissiveIntensity = 1.5 + Math.sin(state.clock.elapsedTime * 10) * 0.5
    }
  })

  return (
    <group>
      {/* Car body - main chassis */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.2, 0.4, 2.8]} />
        <meshStandardMaterial
          color="#ff00ff"
          metalness={0.9}
          roughness={0.1}
          emissive="#ff00ff"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.7, -0.2]} castShadow>
        <boxGeometry args={[0.9, 0.4, 1.2]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.9}
          roughness={0.1}
          opacity={0.7}
          transparent
        />
      </mesh>

      {/* Front spoiler */}
      <mesh position={[0, 0.2, 1.5]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.3]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>

      {/* Rear spoiler */}
      <mesh position={[0, 0.9, -1.5]} castShadow>
        <boxGeometry args={[1.4, 0.08, 0.4]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Spoiler stands */}
      <mesh position={[-0.5, 0.7, -1.5]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.5, 0.7, -1.5]} castShadow>
        <boxGeometry args={[0.08, 0.3, 0.08]} />
        <meshStandardMaterial color="#333333" metalness={0.9} roughness={0.2} />
      </mesh>

      {/* Wheels */}
      <Wheel position={[-0.7, 0.2, 0.9]} />
      <Wheel position={[0.7, 0.2, 0.9]} />
      <Wheel position={[-0.7, 0.2, -0.9]} />
      <Wheel position={[0.7, 0.2, -0.9]} />

      {/* Headlights */}
      <mesh position={[-0.4, 0.4, 1.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.4, 0.4, 1.4]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={3}
          toneMapped={false}
        />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.4, 0.4, -1.4]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.4, 0.4, -1.4]}>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Engine glow (underneath) */}
      <mesh ref={engineGlowRef} position={[0, 0.1, 0]}>
        <boxGeometry args={[0.8, 0.05, 1.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Exhaust particles light */}
      <pointLight
        ref={exhaustRef}
        position={[0, 0.3, -1.6]}
        color="#ff6b00"
        intensity={2}
        distance={3}
        decay={2}
      />

      {/* Front light beams */}
      <spotLight
        position={[0, 0.4, 1.5]}
        target-position={[0, 0, 10]}
        angle={0.4}
        penumbra={0.5}
        intensity={5}
        color="#ffffff"
        distance={20}
      />
    </group>
  )
}

function Wheel({ position }: { position: [number, number, number] }) {
  const wheelRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.x += delta * 10
    }
  })

  return (
    <group ref={wheelRef} position={position} rotation={[0, 0, Math.PI / 2]}>
      {/* Tire */}
      <mesh castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.15, 16]} />
        <meshStandardMaterial color="#111111" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Rim */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.16, 8]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
    </group>
  )
}
