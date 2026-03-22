import React from 'react'
import GameCanvas from './components/GameCanvas'

const App = () => {
  return (
    <div className="app-shell">
      <header className="hero-section">
        <h1>My portfolio</h1>
        <p className="tagline">
          A small city scene—explore and wander.
        </p>
      </header>
      <section className="canvas-section" aria-label="Interactive demo">
        <GameCanvas />
        <p className="canvas-caption">
          Use arrow keys to move. Walk to a building entrance and press Enter to open. Escape to close.
        </p>
      </section>
    </div>
  )
}

export default App
