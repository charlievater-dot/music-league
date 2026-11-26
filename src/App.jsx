import { Route, Routes } from 'react-router-dom'

// Test data, to be replaced with real Music League results
const songs = [
  { title: 'Dreams', artist: 'Fleetwood Mac' },
  { title: 'Hey Ya!', artist: 'Outkast' },
  { title: 'Mr. Brightside', artist: 'The Killers' },
  { title: 'Karma Police', artist: 'Radiohead' },
  { title: 'Superstition', artist: 'Stevie Wonder' },
]

function Home() {
  return (
    <>
      <h1>Music League</h1>
      <ul>
        {songs.map((song) => (
          <li key={song.title}>
            {song.title} by {song.artist}
          </li>
        ))}
      </ul>
    </>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
