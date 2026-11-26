import { getPeople, getSeasons } from '../data.js'
import Rank, { medalClass } from '../Rank.jsx'

export default function People() {
  const people = getPeople()
  const seasons = getSeasons()

  return (
    <main>
      <header>
        <p className="eyebrow">All seasons</p>
        <h1>People</h1>
      </header>
      <div className="table-wrapper">
        <table style={{ minWidth: `calc(16rem + ${seasons.length + 2} * 6rem)` }}>
          <colgroup>
            <col className="col-rank" />
            <col />
            {seasons.map((season) => (
              <col key={season} className="col-season" />
            ))}
            <col className="col-season" />
            <col className="col-season" />
          </colgroup>
          <thead>
            <tr>
              <th className="number">#</th>
              <th>Name</th>
              {seasons.map((season) => (
                <th key={season} className="number">
                  Season {season}
                </th>
              ))}
              <th className="number">Total</th>
              <th className="number">Avg</th>
            </tr>
          </thead>
          <tbody>
            {people.map((person, i) => (
              <tr key={i} className={medalClass(person.rank)}>
                <td className="number">
                  <Rank rank={person.rank} />
                </td>
                <td className="title" title={person.name}>{person.name}</td>
                {seasons.map((season) => (
                  <td key={season} className="number">
                    {/* "–" means they didn't play that season */}
                    {person.seasons[season] ?? '–'}
                  </td>
                ))}
                <td className="number votes">{person.total}</td>
                <td className="number">{person.average}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
