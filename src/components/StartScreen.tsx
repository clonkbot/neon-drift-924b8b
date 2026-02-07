import { useState, useEffect } from 'react'

interface StartScreenProps {
  onStart: () => void
}

export default function StartScreen({ onStart }: StartScreenProps) {
  const [showTitle, setShowTitle] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const [glitchText, setGlitchText] = useState('NEON DRIFT')

  useEffect(() => {
    // Staggered reveal animation
    const t1 = setTimeout(() => setShowTitle(true), 200)
    const t2 = setTimeout(() => setShowSubtitle(true), 600)
    const t3 = setTimeout(() => setShowButton(true), 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [])

  // Glitch effect
  useEffect(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%'
    const original = 'NEON DRIFT'
    let interval: ReturnType<typeof setInterval>

    const glitch = () => {
      let iterations = 0
      interval = setInterval(() => {
        setGlitchText(
          original
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' '
              if (index < iterations) return original[index]
              return chars[Math.floor(Math.random() * chars.length)]
            })
            .join('')
        )
        iterations += 0.5
        if (iterations >= original.length) {
          clearInterval(interval)
          setGlitchText(original)
        }
      }, 50)
    }

    if (showTitle) {
      glitch()
      const repeatGlitch = setInterval(glitch, 5000)
      return () => {
        clearInterval(interval)
        clearInterval(repeatGlitch)
      }
    }
  }, [showTitle])

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
      {/* Background overlay with grid effect */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.9) 100%),
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,0,255,0.03) 50px, rgba(255,0,255,0.03) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(0,255,255,0.03) 50px, rgba(0,255,255,0.03) 51px)
          `,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4">
        {/* Main title */}
        <h1
          className={`text-5xl md:text-8xl lg:text-9xl font-bold mb-4 transition-all duration-1000 ${
            showTitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: '#ff00ff',
            textShadow: `
              0 0 10px #ff00ff,
              0 0 20px #ff00ff,
              0 0 40px #ff00ff,
              0 0 80px #ff00ff
            `,
            letterSpacing: '0.1em',
          }}
        >
          {glitchText}
        </h1>

        {/* Subtitle */}
        <p
          className={`text-xl md:text-3xl mb-12 transition-all duration-1000 delay-300 ${
            showSubtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            color: '#00ffff',
            textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff',
            letterSpacing: '0.3em',
          }}
        >
          SYNTHWAVE RACING
        </p>

        {/* Decorative line */}
        <div
          className={`w-48 md:w-64 h-px mx-auto mb-12 transition-all duration-1000 delay-500 ${
            showSubtitle ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
          }`}
          style={{
            background: 'linear-gradient(90deg, transparent, #ff00ff, #00ffff, transparent)',
            boxShadow: '0 0 10px #ff00ff',
          }}
        />

        {/* Start button */}
        <button
          onClick={onStart}
          className={`relative px-8 md:px-12 py-4 md:py-5 text-lg md:text-2xl font-bold uppercase tracking-widest
            transition-all duration-500 hover:scale-110 active:scale-95 pointer-events-auto
            ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          style={{
            fontFamily: 'Orbitron, sans-serif',
            background: 'transparent',
            color: '#ff00ff',
            border: '2px solid #ff00ff',
            boxShadow: '0 0 20px rgba(255,0,255,0.5), inset 0 0 20px rgba(255,0,255,0.1)',
            clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,0,255,0.2)'
            e.currentTarget.style.boxShadow = '0 0 40px rgba(255,0,255,0.8), inset 0 0 30px rgba(255,0,255,0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.boxShadow = '0 0 20px rgba(255,0,255,0.5), inset 0 0 20px rgba(255,0,255,0.1)'
          }}
        >
          <span className="relative z-10">Start Race</span>
          {/* Animated border glow */}
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ff00ff)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 2s linear infinite',
              clipPath: 'polygon(10% 0%, 100% 0%, 90% 100%, 0% 100%)',
              filter: 'blur(8px)',
              zIndex: -1,
            }}
          />
        </button>

        {/* Controls info */}
        <div
          className={`mt-12 transition-all duration-1000 delay-700 ${
            showButton ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <p className="text-xs md:text-sm mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>
            CONTROLS
          </p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 justify-center text-xs md:text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
            <span>
              <span style={{ color: '#00ffff' }}>W/↑</span> Accelerate
            </span>
            <span>
              <span style={{ color: '#00ffff' }}>S/↓</span> Brake
            </span>
            <span>
              <span style={{ color: '#00ffff' }}>A/↑ D/→</span> Steer
            </span>
          </div>
          <p className="text-xs mt-4 md:hidden" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Touch controls available on mobile
          </p>
        </div>
      </div>

      {/* Animated shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  )
}
