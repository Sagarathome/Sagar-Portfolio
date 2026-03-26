import React from 'react'
import GameCanvas from './components/GameCanvas'

const App = () => {
  return (
    <main className="app-shell">
      <header className="hero-section">
        <h1>Sagar Prajapati</h1>
        <p className="tagline">
          Welcome to my interactive portfolio. Explore the city to discover my
          projects, skills, and experience.
        </p>
      </header>
      <section
        className="canvas-section"
        aria-label="Interactive portfolio city"
      >
        <GameCanvas />
        
      </section>
    </main>
  )
}

export default App
