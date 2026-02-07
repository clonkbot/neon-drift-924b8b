import { Canvas } from '@react-three/fiber'
import { Suspense, useState, useCallback, useEffect } from 'react'
import Game from './components/Game'
import HUD from './components/HUD'
import StartScreen from './components/StartScreen'

export type GameState = 'start' | 'playing' | 'finished'

export interface GameStats {
  speed: number
  lap: number
  position: number
  totalRacers: number
  lapTime: number
  bestLap: number
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start')
  const [stats, setStats] = useState<GameStats>({
    speed: 0,
    lap: 1,
    position: 1,
    totalRacers: 4,
    lapTime: 0,
    bestLap: 0,
  })

  const handleStart = useCallback(() => {
    setGameState('playing')
    setStats({
      speed: 0,
      lap: 1,
      position: 1,
      totalRacers: 4,
      lapTime: 0,
      bestLap: 0,
    })
  }, [])

  const handleRestart = useCallback(() => {
    setGameState('start')
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes pulse-glow {
        0%, 100% { filter: drop-shadow(0 0 8px currentColor); }
        50% { filter: drop-shadow(0 0 20px currentColor); }
      }
      @keyframes scan-line {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100vh); }
      }
      @keyframes flicker {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
      .neon-text {
        text-shadow: 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor;
      }
      .scanlines::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.1) 2px,
          rgba(0, 0, 0, 0.1) 4px
        );
        pointer-events: none;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative scanlines">
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, #1a0a2e 0%, #0a0014 50%, #000 100%)',
        }}
      />

      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 8, 15], fov: 60 }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <Suspense fallback={null}>
          <Game
            gameState={gameState}
            setStats={setStats}
            onFinish={() => setGameState('finished')}
          />
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {gameState === 'start' && <StartScreen onStart={handleStart} />}
      {gameState === 'playing' && <HUD stats={stats} />}
      {gameState === 'finished' && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
          <div className="text-center">
            <h1
              className="text-4xl md:text-6xl font-bold neon-text mb-8"
              style={{ color: '#ff00ff', fontFamily: 'Orbitron, sans-serif' }}
            >
              RACE COMPLETE
            </h1>
            <p
              className="text-xl md:text-2xl mb-4"
              style={{ color: '#00ffff', fontFamily: 'Orbitron, sans-serif' }}
            >
              Position: {stats.position}/{stats.totalRacers}
            </p>
            <p
              className="text-lg md:text-xl mb-8"
              style={{ color: '#ff6b00', fontFamily: 'Orbitron, sans-serif' }}
            >
              Best Lap: {stats.bestLap.toFixed(2)}s
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-4 text-xl font-bold transition-all duration-300 hover:scale-110"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                background: 'linear-gradient(135deg, #ff00ff 0%, #00ffff 100%)',
                color: '#000',
                border: 'none',
                clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              }}
            >
              RACE AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer
        className="absolute bottom-2 md:bottom-4 left-0 right-0 text-center z-10 pointer-events-none"
        style={{
          fontFamily: 'Orbitron, sans-serif',
          fontSize: '10px',
          color: 'rgba(255, 0, 255, 0.4)',
          letterSpacing: '2px',
        }}
      >
        Requested by @skyneet_ · Built by @clonkbot
      </footer>
    </div>
  )
}

export default App
