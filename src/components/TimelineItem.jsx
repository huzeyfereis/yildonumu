import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useTypewriter } from '../hooks/useTypewriter'
import './TimelineItem.css'

const FLIP_MS = 260

function TimelineItem({ id, year, photos, note, prevId, nextId }) {
  const [ref, inView] = useInView()
  const [photoIndex, setPhotoIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const typedNote = useTypewriter(note, { active: inView })

  const hasMultiple = photos.length > 1

  // Preload every photo for this year as soon as the card is in view, so the
  // flip arrow never has to wait on a network fetch mid-animation.
  useEffect(() => {
    if (!inView) return
    photos.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [inView, photos])

  const showNextPhoto = () => {
    if (!hasMultiple || isFlipping) return
    setIsFlipping(true)
    setTimeout(() => {
      setPhotoIndex((i) => (i + 1) % photos.length)
      setIsFlipping(false)
    }, FLIP_MS)
  }

  const scrollToYear = (targetId) => {
    if (!targetId) return
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div id={id} ref={ref} className={`year-card${inView ? ' is-visible' : ''}`}>
      {prevId && (
        <button
          type="button"
          className="year-card__prev-year"
          onClick={() => scrollToYear(prevId)}
          aria-label="önceki yıl"
        >
          <div className="year-card__prev-year-arrow" />
        </button>
      )}

      <div className="year-card__frame">
        <span className="year-card__year">{year}</span>

        <div className="year-card__photo-stage">
          <div className={`year-card__photo${isFlipping ? ' is-flipping' : ''}`}>
            <img src={photos[photoIndex]} alt={`${year} anısı`} />
          </div>

          {hasMultiple && (
            <button
              type="button"
              className="year-card__photo-next"
              onClick={showNextPhoto}
              aria-label="sonraki fotoğraf"
            >
              <span className="year-card__photo-next-arrow" />
            </button>
          )}

          {hasMultiple && (
            <div className="year-card__dots">
              {photos.map((_, i) => (
                <span
                  key={i}
                  className={`year-card__dot${i === photoIndex ? ' is-active' : ''}`}
                />
              ))}
            </div>
          )}
        </div>

        {note ? (
          <p className="year-card__note">
            {typedNote}
            <span
              className={`year-card__note-cursor${
                typedNote.length >= note.length ? ' is-done' : ''
              }`}
            />
          </p>
        ) : null}
      </div>

      {nextId && (
        <button
          type="button"
          className="year-card__next-year"
          onClick={() => scrollToYear(nextId)}
          aria-label="sonraki yıl"
        >
          <div className="year-card__next-year-arrow" />
        </button>
      )}
    </div>
  )
}

export default TimelineItem
