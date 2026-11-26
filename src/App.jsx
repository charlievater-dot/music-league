import { Route, Routes } from 'react-router-dom'
import { getRound } from './data.js'
import './App.css'

const round = getRound(7)
const medals = { 1: 'gold', 2: 'silver', 3: 'bronze' }

function Home() {
  return (
    <main>
      <header>
        <p className="eyebrow">Round 7</p>
        <h1>{round.name}</h1>
      </header>
      <div className="table-wrapper">
        <table>
          <colgroup>
            <col className="col-rank" />
            <col />
            <col />
            <col />
            <col />
            <col className="col-votes" />
          </colgroup>
          <thead>
            <tr>
              <th className="number">#</th>
              <th>Song</th>
              <th>Artist</th>
              <th>Album</th>
              <th>Submitter</th>
              <th className="number">Votes</th>
            </tr>
          </thead>
          <tbody>
            {round.songs.map((song) => (
              <tr key={song.uri} className={medals[song.rank]}>
                <td className="number">
                  <span className="rank">{song.rank}</span>
                </td>
                <td className="title" title={song.title}>{song.title}</td>
                <td title={song.artist}>{song.artist}</td>
                <td title={song.album}>{song.album}</td>
                <td title={song.submitter}>{song.submitter}</td>
                <td className="number votes">{song.votes}</td>
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
