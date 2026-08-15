import TimelineItem from './TimelineItem'
import { timelineNotes } from '../content/timelineNotes'
import { years, yearId, CLOSING_ID } from '../content/years'
import './Timeline.css'

function Timeline() {
  return (
    <section className="timeline" id="timeline">
      {years.map(({ year, photos }, i) => (
        <TimelineItem
          key={year}
          id={yearId(year)}
          year={year}
          photos={photos}
          note={timelineNotes[year]}
          prevId={i > 0 ? yearId(years[i - 1].year) : null}
          nextId={i < years.length - 1 ? yearId(years[i + 1].year) : CLOSING_ID}
        />
      ))}
    </section>
  )
}

export default Timeline
