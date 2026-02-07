import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface AICarProps {
  index: number
  aiCars: React.MutableRefObject<{ progress: number; speed: number; lap: number }[]>
  getTrackPosition: (progress: number) => THREE.Vector3
  getTrackTangent: (progress: number) => THREE.Vector3
}

const AI_COLORS = [
  { primary: '#00ff88', secondary: '#00ffff' },
  { primary: '#ff6b00', secondary: '#ffff00' },
  { primary: '#ff0066', secondary: '#ff00ff' },
]

export default function AICar({ index, aiCars, getTrackPosition, getTrackTangent }: AICarProps) {
  const groupRef = useRef<THREE.Group>(null)
  const colors = AI_COLORS[index % AI_COLORS.length]

  useFrame(() => {
    if (groupRef.current && aiCars.current[index]) {
      const progress = aiCars.current[index].progress
      const pos = getTrackPosition(progress)
      const tangent = getTrackTangent(progress)

      groupRef.current.position.copy(pos)
      groupRef.current.lookAt(pos.clone().add(tangent))
    }
  })

  return (
    <group ref={groupRef}>
      {/* Car body */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[1.1, 0.35, 2.6]} />
        <meshStandardMaterial
          color={colors.primary}
          metalness={0.9}
          roughness={0.1}
          emissive={colors.primary}
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.65, -0.2]} castShadow>
        <boxGeometry args={[0.85, 0.35, 1.1]} />
        <meshStandardMaterial
          color="#000000"
          metalness={0.9}
          roughness={0.1}
          opacity={0.6}
          transparent
        />
      </mesh>

      {/* Front accent */}
      <mesh position={[0, 0.2, 1.4]}>
        <boxGeometry args={[1.4, 0.08, 0.25]} />
        <meshStandardMaterial
          color={colors.secondary}
          emissive={colors.secondary}
          emissiveIntensity={1.2}
          toneMapped={false}
        />
      </mesh>

      {/* Rear wing */}
      <mesh position={[0, 0.85, -1.4]} castShadow>
        <boxGeometry args={[1.3, 0.06, 0.35]} />
        <meshStandardMaterial
          color={colors.primary}
          emissive={colors.primary}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* Wheels */}
      <AIWheel position={[-0.65, 0.18, 0.85]} color={colors.secondary} />
      <AIWheel position={[0.65, 0.18, 0.85]} color={colors.secondary} />
      <AIWheel position={[-0.65, 0.18, -0.85]} color={colors.secondary} />
      <AIWheel position={[0.65, 0.18, -0.85]} color={colors.secondary} />

      {/* Headlights */}
      <mesh position={[-0.35, 0.35, 1.35]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.35, 0.35, 1.35]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={2}
          toneMapped={false}
        />
      </mesh>

      {/* Tail lights */}
      <mesh position={[-0.35, 0.35, -1.35]}>
        <boxGeometry args={[0.18, 0.08, 0.04]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[0.35, 0.35, -1.35]}>
        <boxGeometry args={[0.18, 0.08, 0.04]} />
        <meshStandardMaterial
          color="#ff0000"
          emissive="#ff0000"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>

      {/* Underglow */}
      <mesh position={[0, 0.08, 0]}>
        <boxGeometry args={[0.7, 0.03, 1.4]} />
        <meshStandardMaterial
          color={colors.secondary}
          emissive={colors.secondary}
          emissiveIntensity={1}
          toneMapped={false}
        />
      </mesh>
      <pointLight
        position={[0, 0.1, 0]}
        color={colors.secondary}
        intensity={1}
        distance={3}
        decay={2}
      />
    </group>
  )
}

function AIWheel({ position, color }: { position: [number, number, number]; color: string }) {
  const wheelRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (wheelRef.current) {
      wheelRef.current.rotation.x += delta * 12
    }
  })

  return (
    <group ref={wheelRef} position={position} rotation={[0, 0, Math.PI / 2]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.13, 12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.85} metalness={0.15} />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.13, 0.13, 0.14, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>
    </group>
  )
}
