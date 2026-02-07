import { useMemo } from 'react'
import * as THREE from 'three'

interface TrackProps {
  getTrackPosition: (progress: number) => THREE.Vector3
}

export default function Track({ getTrackPosition }: TrackProps) {
  // Generate track geometry
  const trackGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 200

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments
      const pos = getTrackPosition(progress)
      points.push(pos)
    }

    // Create a tube-like track
    const curve = new THREE.CatmullRomCurve3(points, true)
    return new THREE.TubeGeometry(curve, segments, 6, 8, true)
  }, [getTrackPosition])

  // Grid floor
  const gridGeometry = useMemo(() => {
    const positions: number[] = []
    const gridSize = 300
    const gridDivisions = 60

    for (let i = -gridSize / 2; i <= gridSize / 2; i += gridSize / gridDivisions) {
      positions.push(-gridSize / 2, -0.5, i)
      positions.push(gridSize / 2, -0.5, i)
      positions.push(i, -0.5, -gridSize / 2)
      positions.push(i, -0.5, gridSize / 2)
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    return geometry
  }, [])

  // Track edge barriers (neon strips)
  const barrierPoints = useMemo(() => {
    const innerPoints: THREE.Vector3[] = []
    const outerPoints: THREE.Vector3[] = []
    const segments = 100

    for (let i = 0; i <= segments; i++) {
      const progress = i / segments
      const pos = getTrackPosition(progress)
      const nextPos = getTrackPosition((progress + 0.01) % 1)

      const direction = new THREE.Vector3().subVectors(nextPos, pos).normalize()
      const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)

      innerPoints.push(pos.clone().add(perpendicular.clone().multiplyScalar(-5.5)))
      outerPoints.push(pos.clone().add(perpendicular.clone().multiplyScalar(5.5)))
    }

    return { inner: innerPoints, outer: outerPoints }
  }, [getTrackPosition])

  return (
    <group>
      {/* Ground plane with gradient */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial
          color="#0a0014"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Grid lines */}
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial color="#ff00ff" opacity={0.15} transparent />
      </lineSegments>

      {/* Main track surface */}
      <mesh geometry={trackGeometry} receiveShadow>
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.4}
          metalness={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Track center line - glowing */}
      <TrackCenterLine getTrackPosition={getTrackPosition} />

      {/* Inner barrier */}
      <NeonBarrier points={barrierPoints.inner} color="#ff00ff" />

      {/* Outer barrier */}
      <NeonBarrier points={barrierPoints.outer} color="#00ffff" />

      {/* Start/Finish line */}
      <StartFinishLine getTrackPosition={getTrackPosition} />

      {/* Decorative pillars */}
      <Pillars getTrackPosition={getTrackPosition} />
    </group>
  )
}

function TrackCenterLine({ getTrackPosition }: { getTrackPosition: (p: number) => THREE.Vector3 }) {
  const line = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= 200; i++) {
      const pos = getTrackPosition(i / 200)
      pos.y = 0.05
      points.push(pos)
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    const material = new THREE.LineBasicMaterial({ color: '#ff6b00', opacity: 0.6, transparent: true })
    return new THREE.Line(geometry, material)
  }, [getTrackPosition])

  return <primitive object={line} />
}

function NeonBarrier({ points, color }: { points: THREE.Vector3[]; color: string }) {
  const geometry = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(points, true)
    return new THREE.TubeGeometry(curve, 100, 0.15, 8, true)
  }, [points])

  return (
    <mesh geometry={geometry}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  )
}

function StartFinishLine({ getTrackPosition }: { getTrackPosition: (p: number) => THREE.Vector3 }) {
  const startPos = getTrackPosition(0)

  return (
    <group position={[startPos.x, 0.1, startPos.z]}>
      {/* Checkered pattern */}
      {[...Array(8)].map((_, i) => (
        <mesh key={i} position={[(i - 3.5) * 1.2, 0, 0]}>
          <boxGeometry args={[1, 0.05, 8]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#ffffff' : '#000000'}
            emissive={i % 2 === 0 ? '#ffffff' : '#000000'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
      {/* Arch */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[15, 1, 0.5]} />
        <meshStandardMaterial
          color="#ff00ff"
          emissive="#ff00ff"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[-7, 4, 0]}>
        <boxGeometry args={[0.5, 8, 0.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
      <mesh position={[7, 4, 0]}>
        <boxGeometry args={[0.5, 8, 0.5]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  )
}

function Pillars({ getTrackPosition }: { getTrackPosition: (p: number) => THREE.Vector3 }) {
  const pillarPositions = useMemo(() => {
    const positions: THREE.Vector3[] = []
    for (let i = 0; i < 12; i++) {
      const progress = i / 12
      const pos = getTrackPosition(progress)
      const nextPos = getTrackPosition((progress + 0.01) % 1)
      const direction = new THREE.Vector3().subVectors(nextPos, pos).normalize()
      const perpendicular = new THREE.Vector3(-direction.z, 0, direction.x)

      // Place pillars outside the track
      const outerPos = pos.clone().add(perpendicular.clone().multiplyScalar(15))
      outerPos.y = 0
      positions.push(outerPos)
    }
    return positions
  }, [getTrackPosition])

  return (
    <>
      {pillarPositions.map((pos, i) => (
        <group key={i} position={[pos.x, pos.y, pos.z]}>
          {/* Pillar base */}
          <mesh position={[0, 10, 0]}>
            <cylinderGeometry args={[0.3, 0.5, 20, 8]} />
            <meshStandardMaterial
              color="#1a0a2e"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Glowing top */}
          <mesh position={[0, 20, 0]}>
            <sphereGeometry args={[1, 16, 16]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
              emissive={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
          {/* Light cone */}
          <pointLight
            position={[0, 18, 0]}
            color={i % 2 === 0 ? '#ff00ff' : '#00ffff'}
            intensity={2}
            distance={30}
            decay={2}
          />
        </group>
      ))}
    </>
  )
}
