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
  const wantsPlayRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)

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
          onReady: () => {
            if (wantsPlayRef.current) playerRef.current?.playVideo?.()
          },
          onStateChange: (e) => {
            setIsPlaying(e.data === YT.PlayerState.PLAYING)
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
      wantsPlayRef.current = true
      playerRef.current?.playVideo?.()
    }
  }, [])

  // Start music on the very first user interaction anywhere on the page —
  // covers people who scroll straight past the hero instead of tapping the button.
  useEffect(() => {
    const startOnFirstInteraction = () => musicControls.play()
    // 'wheel'/'scroll'/'touchmove' don't count as a user gesture for autoplay —
    // only discrete events like these do, so catch the first one of any kind.
    const events = ['touchend', 'touchstart', 'mousedown', 'click', 'keydown']
    events.forEach((evt) =>
      window.addEventListener(evt, startOnFirstInteraction, { once: true, passive: true })
    )
    return () => {
      events.forEach((evt) => window.removeEventListener(evt, startOnFirstInteraction))
    }
  }, [])

  const handleToggle = () => {
    const player = playerRef.current
    if (!player) return
    if (isPlaying) {
      player.pauseVideo()
    } else {
      player.playVideo()
    }
  }

  return (
    <>
      <div id={CONTAINER_ID} className="bg-music-frame" />
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
