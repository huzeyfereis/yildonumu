import { useEffect, useRef, useState } from 'react'
import { musicControls } from '../lib/musicPlayer'
import './BackgroundMusic.css'

const VIDEO_ID = '3Ba_WoSZXvw'
const CONTAINER_ID = 'yt-bg-music-player'
// Song ends around 1:42, right before the artist starts talking — loop before then.
const LOOP_END_SECONDS = 101

function loadYouTubeApi() {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve(window.YT)
      return
    }
    const prevCallback = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prevCallback?.()
      resolve(window.YT)
    }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
}

function BackgroundMusic() {
  const playerRef = useRef(null)
  const wantsUnmuteRef = useRef(false)
  const [isAudible, setIsAudible] = useState(false)

  useEffect(() => {
    let cancelled = false

    loadYouTubeApi().then((YT) => {
      if (cancelled) return
      playerRef.current = new YT.Player(CONTAINER_ID, {
        height: '1',
        width: '1',
        videoId: VIDEO_ID,
        playerVars: {
          playsinline: 1,
          controls: 0,
          disablekb: 1,
          modestbranding: 1,
          rel: 0,
          end: LOOP_END_SECONDS,
        },
        events: {
          onReady: (e) => {
            // Muted autoplay is always allowed with no gesture — start the track
            // running immediately so the only gesture-gated step left is unmuting,
            // which browsers honor far more reliably than starting playback cold.
            e.target.mute()
            e.target.playVideo()
            if (wantsUnmuteRef.current) {
              e.target.unMute()
              setIsAudible(true)
            }
          },
          onStateChange: (e) => {
            if (e.data === YT.PlayerState.ENDED) {
              e.target.seekTo(0)
              e.target.playVideo()
            }
          },
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
    }
  }, [])

  useEffect(() => {
    musicControls.play = () => {
      wantsUnmuteRef.current = true
      const player = playerRef.current
      if (!player) return
      player.unMute()
      player.playVideo()
      setIsAudible(true)
    }
  }, [])

  // Unmute on the very first user interaction anywhere on the page — covers
  // people who scroll straight past the hero instead of tapping the button.
  useEffect(() => {
    const unmuteOnFirstInteraction = () => musicControls.play()
    // 'wheel'/'scroll'/'touchmove' don't count as a user gesture for autoplay —
    // only discrete events like these do, so catch the first one of any kind.
    const events = ['touchend', 'touchstart', 'mousedown', 'click', 'keydown']
    events.forEach((evt) =>
      window.addEventListener(evt, unmuteOnFirstInteraction, { once: true, passive: true })
    )
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, unmuteOnFirstInteraction))
    }
  }, [])

  const handleToggle = () => {
    const player = playerRef.current
    if (!player) return
    if (isAudible) {
      player.mute()
      setIsAudible(false)
    } else {
      wantsUnmuteRef.current = true
      player.unMute()
      player.playVideo()
      setIsAudible(true)
    }
  }

  return (
    <>
      <div id={CONTAINER_ID} className="bg-music-frame" />
      <button
        type="button"
        className="bg-music-toggle"
        onClick={handleToggle}
        aria-label={isAudible ? 'müziği sustur' : 'müziği aç'}
      >
        {isAudible ? '🎵' : '🔇'}
      </button>
    </>
  )
}

export default BackgroundMusic
