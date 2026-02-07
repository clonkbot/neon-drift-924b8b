import { GameStats } from '../App'

interface HUDProps {
  stats: GameStats
}

export default function HUD({ stats }: HUDProps) {
  const speedPercent = Math.min((stats.speed / 100) * 100, 100)

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Top bar - Position and Lap */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
        {/* Position */}
        <div
          className="p-3 md:p-4"
          style={{
            background: 'linear-gradient(135deg, rgba(255,0,255,0.2) 0%, rgba(0,0,0,0.6) 100%)',
            border: '1px solid rgba(255,0,255,0.5)',
            clipPath: 'polygon(0 0, 100% 0, 95% 100%, 0 100%)',
          }}
        >
          <div
            className="text-xs md:text-sm uppercase tracking-widest mb-1"
            style={{ color: 'rgba(255,0,255,0.7)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Position
          </div>
          <div
            className="text-3xl md:text-5xl font-bold"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#ff00ff',
              textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff',
            }}
          >
            {stats.position}
            <span className="text-lg md:text-2xl text-cyan-400">/{stats.totalRacers}</span>
          </div>
        </div>

        {/* Lap counter */}
        <div
          className="p-3 md:p-4 text-right"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,255,255,0.2) 100%)',
            border: '1px solid rgba(0,255,255,0.5)',
            clipPath: 'polygon(5% 0, 100% 0, 100% 100%, 0 100%)',
          }}
        >
          <div
            className="text-xs md:text-sm uppercase tracking-widest mb-1"
            style={{ color: 'rgba(0,255,255,0.7)', fontFamily: 'Orbitron, sans-serif' }}
          >
            Lap
          </div>
          <div
            className="text-3xl md:text-5xl font-bold"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              color: '#00ffff',
              textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
            }}
          >
            {stats.lap}
            <span className="text-lg md:text-2xl text-pink-400">/3</span>
          </div>
        </div>
      </div>

      {/* Bottom panel - Speed and Times */}
      <div className="absolute bottom-16 md:bottom-8 left-4 right-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-end">
          {/* Speed gauge */}
          <div
            className="flex-1 max-w-xs p-3 md:p-4"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(255,107,0,0.2) 100%)',
              border: '1px solid rgba(255,107,0,0.5)',
              borderBottom: '3px solid #ff6b00',
            }}
          >
            <div
              className="text-xs uppercase tracking-widest mb-2"
              style={{ color: 'rgba(255,107,0,0.7)', fontFamily: 'Orbitron, sans-serif' }}
            >
              Speed
            </div>
            <div className="flex items-end gap-2">
              <div
                className="text-4xl md:text-6xl font-bold"
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  color: '#ff6b00',
                  textShadow: '0 0 10px #ff6b00',
                }}
              >
                {stats.speed}
              </div>
              <div
                className="text-sm md:text-lg mb-1 md:mb-2"
                style={{ color: 'rgba(255,107,0,0.6)', fontFamily: 'Orbitron, sans-serif' }}
              >
                KM/H
              </div>
            </div>
            {/* Speed bar */}
            <div
              className="h-2 mt-2 overflow-hidden"
              style={{ background: 'rgba(255,107,0,0.2)' }}
            >
              <div
                className="h-full transition-all duration-100"
                style={{
                  width: `${speedPercent}%`,
                  background: 'linear-gradient(90deg, #ff6b00 0%, #ffff00 100%)',
                  boxShadow: '0 0 10px #ff6b00',
                }}
              />
            </div>
          </div>

          {/* Times */}
          <div
            className="flex gap-4 md:gap-6"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {/* Current lap time */}
            <div className="text-center">
              <div
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'rgba(255,255,255,0.5)' }}
              >
                Current
              </div>
              <div
                className="text-xl md:text-3xl font-bold"
                style={{ color: '#ffffff', textShadow: '0 0 5px rgba(255,255,255,0.5)' }}
              >
                {stats.lapTime.toFixed(2)}
                <span className="text-xs md:text-sm ml-1 opacity-60">s</span>
              </div>
            </div>

            {/* Best lap time */}
            <div className="text-center">
              <div
                className="text-xs uppercase tracking-widest mb-1"
                style={{ color: 'rgba(0,255,136,0.7)' }}
              >
                Best
              </div>
              <div
                className="text-xl md:text-3xl font-bold"
                style={{ color: '#00ff88', textShadow: '0 0 10px #00ff88' }}
              >
                {stats.bestLap > 0 ? stats.bestLap.toFixed(2) : '--:--'}
                <span className="text-xs md:text-sm ml-1 opacity-60">s</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls hint - Desktop only */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden md:flex gap-2"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {['W', 'A', 'S', 'D'].map((key) => (
          <div
            key={key}
            className="w-8 h-8 flex items-center justify-center text-sm"
            style={{
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.3)',
              color: 'rgba(255,255,255,0.5)',
            }}
          >
            {key}
          </div>
        ))}
        <span className="text-xs self-center ml-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
          or Arrow Keys
        </span>
      </div>
    </div>
  )
}
