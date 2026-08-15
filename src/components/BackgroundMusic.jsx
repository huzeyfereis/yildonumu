import { useEffect, useRef, useState } from 'react'
import { musicControls } from '../lib/musicPlayer'
import './BackgroundMusic.css'

// BASE_URL is '/' on Netlify/Cloudflare but '/yildonumu/' on GitHub Pages —
// build it in instead of hardcoding a root-relative path.
const TRACK_SRC = `${import.meta.env.BASE_URL}music/Lv2.mp3`

function BackgroundMusic() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    musicControls.play = () => {
      audioRef.current?.play().catch(() => {})
    }
  }, [])

  // Start on the very first user interaction anywhere on the page — covers
  // people who scroll straight past the hero instead of tapping the button.
  useEffect(() => {
    const playOnFirstInteraction = () => musicControls.play()
    // 'wheel'/'scroll'/'touchmove' don't count as a user gesture for autoplay —
    // only discrete events like these do, so catch the first one of any kind.
    const events = ['touchend', 'touchstart', 'mousedown', 'click', 'keydown']
    events.forEach((evt) =>
      window.addEventListener(evt, playOnFirstInteraction, { once: true, passive: true })
    )
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, playOnFirstInteraction))
    }
  }, [])

  const handleToggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={TRACK_SRC}
        loop
        preload="auto"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      <button
        type="button"
        className="bg-music-toggle"
        onClick={handleToggle}
        aria-label={isPlaying ? 'müziği durdur' : 'müziği çal'}
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
    </>
  )
}

export default BackgroundMusic
