import { Route, Routes } from 'react-router-dom'
import { getRound } from './data.js'
import './App.css'

const round = getRound(7)

function Home() {
  return (
    <main>
      <h1>Music League</h1>
      <h2>Round 7: {round.name}</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Song</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Submitter</th>
              <th className="number">Votes</th>
            </tr>
          </thead>
          <tbody>
            {round.songs.map((song) => (
              <tr key={song.uri}>
                <td>{song.title}</td>
                <td>{song.artist}</td>
                <td>{song.album}</td>
                <td>{song.submitter}</td>
                <td className="number">{song.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
