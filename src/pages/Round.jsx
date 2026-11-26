import { Link, useParams } from 'react-router-dom'
import { getRound } from '../data.js'
import Rank, { medalClass } from '../Rank.jsx'
import NotFound from './NotFound.jsx'

export default function Round() {
  const { season, round: roundNumber } = useParams()
  const round = getRound(season, roundNumber)
  if (!round) return <NotFound />

  return (
    <main>
      <header>
        <p className="eyebrow">
          Season {round.season} · Round {round.round}
        </p>
        <h1>{round.name}</h1>
        {round.description && <p className="description">{round.description}</p>}
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
              <tr key={song.trackId} className={medalClass(song.rank)}>
                <td className="number">
                  <Rank rank={song.rank} />
                </td>
                <td className="title" title={song.title}>
                  <Link to={`/${round.season}/${round.round}/${song.trackId}`}>{song.title}</Link>
                </td>
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
