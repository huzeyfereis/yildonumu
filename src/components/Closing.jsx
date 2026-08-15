import { useEffect, useState } from 'react'
import { useInView } from '../hooks/useInView'
import { useTypewriter } from '../hooks/useTypewriter'
import Confetti from './Confetti'
import LiveCounter from './LiveCounter'
import { closingMessage } from '../content/closingMessage'
import { years, yearId, CLOSING_ID } from '../content/years'
import { bgPhotos } from '../content/bgPhotos'
import './Closing.css'

const FLIP_MS = 260

function Closing() {
  const [ref, inView] = useInView({ threshold: 0.4 })
  const typed = useTypewriter(closingMessage, { active: inView, startDelay: 500, speed: 55 })

  const [showGallery, setShowGallery] = useState(false)
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)
  const [flipDirection, setFlipDirection] = useState('next')

  // Warm the browser cache for the whole gallery while they're reading the
  // letter, so flipping through photos never has to wait on a fetch.
  useEffect(() => {
    if (!inView) return
    bgPhotos.forEach((src) => {
      const img = new Image()
      img.src = src
    })
  }, [inView])

  const scrollToLastYear = () => {
    const lastYear = years[years.length - 1]
    document
      .getElementById(yearId(lastYear.year))
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToStart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const changeGalleryPhoto = (direction) => {
    if (isFlipping) return
    setFlipDirection(direction)
    setIsFlipping(true)
    setTimeout(() => {
      setGalleryIndex((i) => {
        const len = bgPhotos.length
        return direction === 'next' ? (i + 1) % len : (i - 1 + len) % len
      })
      setIsFlipping(false)
    }, FLIP_MS)
  }

  return (
    <section id={CLOSING_ID} ref={ref} className={`closing${inView ? ' is-visible' : ''}`}>
      <button
        type="button"
        className="closing__prev-year"
        onClick={scrollToLastYear}
        aria-label="önceki yıl"
      >
        <div className="closing__prev-year-arrow" />
      </button>

      {inView && <Confetti />}

      {inView && (
        <button
          type="button"
          className="closing__restart"
          onClick={scrollToStart}
          aria-label="başa dön"
        >
          🔝
        </button>
      )}

      <div className="closing__frame">
        <span className="closing__label">11 yıl… ve daha nicesine</span>

        {showGallery ? (
          <div className="closing__gallery-stage">
            <div
              className={`closing__gallery-photo${
                isFlipping ? ` is-flipping is-flipping-${flipDirection}` : ''
              }`}
            >
              <img src={bgPhotos[galleryIndex]} alt="anılarımızdan bir kare" />
            </div>
            <span className="closing__gallery-count">
              {galleryIndex + 1} / {bgPhotos.length}
            </span>
            <button
              type="button"
              className="closing__gallery-prev"
              onClick={() => changeGalleryPhoto('prev')}
              aria-label="önceki fotoğraf"
            >
              <span className="closing__gallery-prev-arrow" />
            </button>
            <button
              type="button"
              className="closing__gallery-next"
              onClick={() => changeGalleryPhoto('next')}
              aria-label="sonraki fotoğraf"
            >
              <span className="closing__gallery-next-arrow" />
            </button>
          </div>
        ) : (
          <>
            <p className="closing__message">
              {typed}
              <span
                className={`closing__cursor${
                  typed.length >= closingMessage.length ? ' is-done' : ''
                }`}
              />
            </p>

            <div className="closing__counter">
              <LiveCounter size="small" />
            </div>
          </>
        )}

        <button
          type="button"
          className="closing__gallery-toggle"
          onClick={() => setShowGallery((v) => !v)}
        >
          {showGallery ? 'mektuba dön' : 'arkadaki fotoğrafları görmek için tıkla'}
        </button>
      </div>
    </section>
  )
}

export default Closing
