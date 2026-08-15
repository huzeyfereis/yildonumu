import { useEffect, useState } from 'react'

function diff(start, now) {
  let years = now.getFullYear() - start.getFullYear()
  let months = now.getMonth() - start.getMonth()
  let days = now.getDate() - start.getDate()
  let hours = now.getHours() - start.getHours()
  let minutes = now.getMinutes() - start.getMinutes()
  let seconds = now.getSeconds() - start.getSeconds()

  if (seconds < 0) {
    seconds += 60
    minutes -= 1
  }
  if (minutes < 0) {
    minutes += 60
    hours -= 1
  }
  if (hours < 0) {
    hours += 24
    days -= 1
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    days += prevMonth.getDate()
    months -= 1
  }
  if (months < 0) {
    months += 12
    years -= 1
  }

  return { years, months, days, hours, minutes, seconds }
}

export function useElapsedTime(startDate) {
  const [elapsed, setElapsed] = useState(() => diff(startDate, new Date()))

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(diff(startDate, new Date()))
    }, 1000)
    return () => clearInterval(id)
  }, [startDate])

  return elapsed
}
