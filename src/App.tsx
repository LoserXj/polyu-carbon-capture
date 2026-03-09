import { useState, useEffect } from 'react'
import './App.css'
import MapView from './components/map/MapView'
import TopBar from './components/layout/TopBar'
import Loading from './components/layout/Loading'

function App() {
  const [loading, setLoading] = useState(true)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
      setTimeout(() => setLoading(false), 600)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-container">
      {loading && <Loading fadeOut={fadeOut} />}
      <MapView />
      <TopBar />
    </div>
  )
}

export default App
