import { useElapsedTime } from '../hooks/useElapsedTime'
import './LiveCounter.css'

const WEDDING_DATE = new Date(2015, 7, 15, 0, 0, 0)

const UNITS = [
  ['years', 'yıl'],
  ['months', 'ay'],
  ['days', 'gün'],
  ['hours', 'saat'],
  ['minutes', 'dakika'],
  ['seconds', 'saniye'],
]

function LiveCounter({ size = 'normal' }) {
  const elapsed = useElapsedTime(WEDDING_DATE)

  return (
    <div className={`live-counter${size === 'small' ? ' live-counter--small' : ''}`}>
      {UNITS.map(([key, label]) => (
        <div className="live-counter__unit" key={key}>
          <span className="live-counter__value">{elapsed[key]}</span>
          <span className="live-counter__label">{label}</span>
        </div>
      ))}
    </div>
  )
}

export default LiveCounter
