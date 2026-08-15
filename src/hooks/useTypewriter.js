import { useEffect, useState } from 'react'

export function useTypewriter(text, { active, startDelay = 400, speed = 70 } = {}) {
  const [typed, setTyped] = useState('')

  useEffect(() => {
    if (!active || !text) return

    let charIndex = 0
    let intervalId
    const startId = setTimeout(() => {
      intervalId = setInterval(() => {
        charIndex += 1
        setTyped(text.slice(0, charIndex))
        if (charIndex >= text.length) clearInterval(intervalId)
      }, speed)
    }, startDelay)

    return () => {
      clearTimeout(startId)
      clearInterval(intervalId)
    }
  }, [active, text, startDelay, speed])

  return typed
}
