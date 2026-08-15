import { bgPhotos } from '../content/bgPhotos'
import './CollageBackground.css'

// deterministic pseudo-random rotation per tile, so it stays stable across renders
function rotationFor(index) {
  const pattern = [-6, 4, -3, 7, -8, 2, -4, 6, -2, 5]
  return pattern[index % pattern.length]
}

function CollageBackground() {
  return (
    <div className="collage-bg" aria-hidden="true">
      <div className="collage-bg__grid">
        {bgPhotos.map((src, i) => (
          <div
            className="collage-bg__tile"
            key={src}
            style={{ '--rot': `${rotationFor(i)}deg` }}
          >
            <img src={src} alt="" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="collage-bg__overlay" />
    </div>
  )
}

export default CollageBackground
