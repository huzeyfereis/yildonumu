import './Confetti.css'

const COLORS = ['#e8b45c', '#fbf6ee', '#e9e4dc', '#c99a4a']
const PIECES = Array.from({ length: 36 }, (_, i) => i)

function Confetti() {
  return (
    <div className="confetti" aria-hidden="true">
      {PIECES.map((i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 1.2
        const duration = 2.6 + Math.random() * 1.8
        const size = 6 + Math.random() * 6
        return (
          <span
            key={i}
            className="confetti__piece"
            style={{
              left: `${left}%`,
              width: `${size}px`,
              height: `${size * 0.4}px`,
              background: COLORS[i % COLORS.length],
              animationDelay: `${delay}s`,
              animationDuration: `${duration}s`,
            }}
          />
        )
      })}
    </div>
  )
}

export default Confetti
