import { useRef, useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Stars } from '@react-three/drei'
import * as THREE from 'three'
import { GameState, GameStats } from '../App'
import Track from './Track'
import PlayerCar from './PlayerCar'
import AICar from './AICar'

interface GameProps {
  gameState: GameState
  setStats: React.Dispatch<React.SetStateAction<GameStats>>
  onFinish: () => void
}

// Track configuration - oval-ish circuit
const TRACK_RADIUS = 50
const TRACK_WIDTH = 12
const TOTAL_LAPS = 3

export default function Game({ gameState, setStats, onFinish }: GameProps) {
  const { camera } = useThree()

  const playerRef = useRef<THREE.Group>(null)
  const playerProgress = useRef(0)
  const playerLap = useRef(1)
  const playerSpeed = useRef(0)
  const lapStartTime = useRef(Date.now())
  const bestLapTime = useRef(Infinity)

  // AI cars refs
  const aiCars = useRef([
    { progress: 0.25, speed: 0.015, lap: 1 },
    { progress: 0.5, speed: 0.014, lap: 1 },
    { progress: 0.75, speed: 0.016, lap: 1 },
  ])

  const keysPressed = useRef<Set<string>>(new Set())

  // Touch controls state
  const touchControls = useRef({
    accelerating: false,
    braking: false,
    turningLeft: false,
    turningRight: false,
  })

  // Get position on track from progress (0-1)
  const getTrackPosition = (progress: number): THREE.Vector3 => {
    const angle = progress * Math.PI * 2
    // Figure-8 inspired track shape
    const x = Math.sin(angle) * TRACK_RADIUS
    const z = Math.sin(angle * 2) * TRACK_RADIUS * 0.3 + Math.cos(angle) * TRACK_RADIUS
    return new THREE.Vector3(x, 0.3, z)
  }

  const getTrackTangent = (progress: number): THREE.Vector3 => {
    const delta = 0.001
    const p1 = getTrackPosition(progress)
    const p2 = getTrackPosition((progress + delta) % 1)
    return p2.clone().sub(p1).normalize()
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key.toLowerCase())
    }
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key.toLowerCase())
    }
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // Reset on game start
  useEffect(() => {
    if (gameState === 'playing') {
      playerProgress.current = 0
      playerLap.current = 1
      playerSpeed.current = 0
      lapStartTime.current = Date.now()
      bestLapTime.current = Infinity
      aiCars.current = [
        { progress: 0.25, speed: 0.015, lap: 1 },
        { progress: 0.5, speed: 0.014, lap: 1 },
        { progress: 0.75, speed: 0.016, lap: 1 },
      ]
    }
  }, [gameState])

  useFrame((_, delta) => {
    if (gameState !== 'playing') return

    const keys = keysPressed.current
    const touch = touchControls.current
    const accelerating = keys.has('w') || keys.has('arrowup') || touch.accelerating
    const braking = keys.has('s') || keys.has('arrowdown') || touch.braking
    const turningLeft = keys.has('a') || keys.has('arrowleft') || touch.turningLeft
    const turningRight = keys.has('d') || keys.has('arrowright') || touch.turningRight

    // Speed control
    const maxSpeed = 0.025
    const acceleration = 0.0008
    const friction = 0.0003
    const brakeForce = 0.001

    if (accelerating) {
      playerSpeed.current = Math.min(maxSpeed, playerSpeed.current + acceleration)
    } else if (braking) {
      playerSpeed.current = Math.max(0, playerSpeed.current - brakeForce)
    } else {
      playerSpeed.current = Math.max(0, playerSpeed.current - friction)
    }

    // Steering affects speed slightly
    const steerPenalty = (turningLeft || turningRight) ? 0.9 : 1
    const effectiveSpeed = playerSpeed.current * steerPenalty

    // Update player progress
    const steerAmount = (turningLeft ? -0.003 : 0) + (turningRight ? 0.003 : 0)
    playerProgress.current += effectiveSpeed + steerAmount

    // Check lap completion
    if (playerProgress.current >= 1) {
      playerProgress.current -= 1
      const lapTime = (Date.now() - lapStartTime.current) / 1000
      if (lapTime < bestLapTime.current) {
        bestLapTime.current = lapTime
      }
      lapStartTime.current = Date.now()
      playerLap.current++

      if (playerLap.current > TOTAL_LAPS) {
        onFinish()
        return
      }
    }

    // Update AI cars
    aiCars.current.forEach((ai, index) => {
      // Add some variance to AI speed
      const variance = Math.sin(Date.now() * 0.001 + index) * 0.002
      ai.progress += ai.speed + variance

      if (ai.progress >= 1) {
        ai.progress -= 1
        ai.lap++
      }
    })

    // Calculate positions
    const positions = [
      { type: 'player', totalProgress: playerLap.current + playerProgress.current },
      ...aiCars.current.map((ai, i) => ({
        type: `ai${i}`,
        totalProgress: ai.lap + ai.progress,
      })),
    ].sort((a, b) => b.totalProgress - a.totalProgress)

    const playerPosition = positions.findIndex((p) => p.type === 'player') + 1

    // Update player car position and rotation
    if (playerRef.current) {
      const pos = getTrackPosition(playerProgress.current)
      const tangent = getTrackTangent(playerProgress.current)

      playerRef.current.position.copy(pos)
      playerRef.current.lookAt(pos.clone().add(tangent))
    }

    // Camera follow
    const camPos = getTrackPosition((playerProgress.current - 0.02 + 1) % 1)
    camPos.y = 5
    const lookAtPos = getTrackPosition(playerProgress.current)

    camera.position.lerp(new THREE.Vector3(camPos.x, camPos.y + 3, camPos.z + 8), 0.05)
    camera.lookAt(lookAtPos)

    // Update stats
    const currentLapTime = (Date.now() - lapStartTime.current) / 1000
    setStats({
      speed: Math.round(playerSpeed.current * 4000),
      lap: Math.min(playerLap.current, TOTAL_LAPS),
      position: playerPosition,
      totalRacers: 4,
      lapTime: currentLapTime,
      bestLap: bestLapTime.current === Infinity ? 0 : bestLapTime.current,
    })
  })

  const aiCarPositions = useMemo(() => {
    return aiCars.current.map((_, i) => i)
  }, [])

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#6b00ff" />
      <directionalLight
        position={[50, 100, 50]}
        intensity={0.5}
        color="#ff00ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[0, 50, 0]} intensity={1} color="#00ffff" distance={200} />

      {/* Environment */}
      <Stars radius={300} depth={100} count={5000} factor={4} saturation={0.5} fade speed={1} />
      <Environment preset="night" />
      <fog attach="fog" args={['#0a0014', 50, 200]} />

      {/* Track */}
      <Track getTrackPosition={getTrackPosition} />

      {/* Player Car */}
      <group ref={playerRef}>
        <PlayerCar />
      </group>

      {/* AI Cars */}
      {aiCarPositions.map((index) => (
        <AICar
          key={index}
          index={index}
          aiCars={aiCars}
          getTrackPosition={getTrackPosition}
          getTrackTangent={getTrackTangent}
        />
      ))}

      {/* Touch Controls */}
      <TouchControls touchControls={touchControls} />
    </>
  )
}

function TouchControls({ touchControls }: { touchControls: React.MutableRefObject<{
  accelerating: boolean
  braking: boolean
  turningLeft: boolean
  turningRight: boolean
}> }) {
  useEffect(() => {
    // Create touch control elements
    const createTouchZone = (
      id: string,
      position: string,
      onStart: () => void,
      onEnd: () => void
    ) => {
      const existing = document.getElementById(id)
      if (existing) return existing

      const zone = document.createElement('div')
      zone.id = id
      zone.style.cssText = `
        position: fixed;
        ${position}
        width: 80px;
        height: 80px;
        background: rgba(255, 0, 255, 0.2);
        border: 2px solid rgba(255, 0, 255, 0.5);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: Orbitron, sans-serif;
        font-size: 24px;
        color: rgba(255, 0, 255, 0.8);
        z-index: 100;
        user-select: none;
        touch-action: none;
      `
      zone.addEventListener('touchstart', (e) => {
        e.preventDefault()
        onStart()
        zone.style.background = 'rgba(255, 0, 255, 0.4)'
      })
      zone.addEventListener('touchend', () => {
        onEnd()
        zone.style.background = 'rgba(255, 0, 255, 0.2)'
      })
      zone.addEventListener('touchcancel', () => {
        onEnd()
        zone.style.background = 'rgba(255, 0, 255, 0.2)'
      })
      return zone
    }

    // Check if mobile
    const isMobile = 'ontouchstart' in window

    if (isMobile) {
      const leftZone = createTouchZone(
        'touch-left',
        'bottom: 20px; left: 20px;',
        () => (touchControls.current.turningLeft = true),
        () => (touchControls.current.turningLeft = false)
      )
      leftZone.innerHTML = '◀'
      document.body.appendChild(leftZone)

      const rightZone = createTouchZone(
        'touch-right',
        'bottom: 20px; left: 120px;',
        () => (touchControls.current.turningRight = true),
        () => (touchControls.current.turningRight = false)
      )
      rightZone.innerHTML = '▶'
      document.body.appendChild(rightZone)

      const accelZone = createTouchZone(
        'touch-accel',
        'bottom: 20px; right: 20px;',
        () => (touchControls.current.accelerating = true),
        () => (touchControls.current.accelerating = false)
      )
      accelZone.innerHTML = '▲'
      document.body.appendChild(accelZone)

      const brakeZone = createTouchZone(
        'touch-brake',
        'bottom: 20px; right: 120px;',
        () => (touchControls.current.braking = true),
        () => (touchControls.current.braking = false)
      )
      brakeZone.innerHTML = '▼'
      document.body.appendChild(brakeZone)

      return () => {
        document.getElementById('touch-left')?.remove()
        document.getElementById('touch-right')?.remove()
        document.getElementById('touch-accel')?.remove()
        document.getElementById('touch-brake')?.remove()
      }
    }
  }, [touchControls])

  return null
}
