import BackgroundMusic from './components/BackgroundMusic'
import Closing from './components/Closing'
import CollageBackground from './components/CollageBackground'
import Hero from './components/Hero'
import Timeline from './components/Timeline'
import './App.css'

function App() {
  return (
    <div id="app">
      <CollageBackground />
      <BackgroundMusic />
      <main className="content">
        <Hero />
        <Timeline />
        <Closing />
      </main>
    </div>
  )
}

export default App
