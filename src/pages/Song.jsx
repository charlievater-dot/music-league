import { useParams } from 'react-router-dom'
import { getSong } from '../data.js'
import NotFound from './NotFound.jsx'

export default function Song() {
  const { season, round, trackId } = useParams()
  const song = getSong(season, round, trackId)
  if (!song) return <NotFound />

  return (
    <main>
      <header>
        <p className="eyebrow">
          Season {song.season} · Round {song.round}
        </p>
        <h1>{song.title}</h1>
        <p className="description">
          {song.artist} · {song.album}
        </p>
        <p className="description">
          Submitted by {song.submitter} · {song.votes} votes · Ranked #{song.rank}
        </p>
      </header>
      <div className="table-wrapper">
        <table>
          <colgroup>
            <col className="col-name" />
            <col className="col-votes" />
            <col />
          </colgroup>
          <thead>
            <tr>
              <th>Voter</th>
              <th className="number">Votes</th>
              <th>Comment</th>
            </tr>
          </thead>
          <tbody>
            {song.voters.map((voter, i) => (
              <tr key={i}>
                <td className="title" title={voter.voter}>{voter.voter}</td>
                <td className="number votes">{voter.votes}</td>
                <td className="comment">{voter.comment}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
