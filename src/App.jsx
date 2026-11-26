import { Route, Routes } from 'react-router-dom'
import People from './pages/People.jsx'
import Round from './pages/Round.jsx'
import Song from './pages/Song.jsx'
import NotFound from './pages/NotFound.jsx'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<People />} />
      <Route path="/:season/:round" element={<Round />} />
      <Route path="/:season/:round/:trackId" element={<Song />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
