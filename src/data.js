// Gives the site the tables made by parsed-data/parse.js.
// Run `npm run parse` first if parsed-data/ is empty.

import people from '../parsed-data/people.json'

// Keys look like "../parsed-data/5/7.json" (Round tables)
// and "../parsed-data/5/7/<track-id>.json" (Song tables)
const roundFiles = import.meta.glob('../parsed-data/*/*.json', { eager: true, import: 'default' })
const songFiles = import.meta.glob('../parsed-data/*/*/*.json', { eager: true, import: 'default' })

const rounds = Object.values(roundFiles).sort((a, b) => a.season - b.season || a.round - b.round)

// Everyone who has played, highest total score first
export function getPeople() {
  return people
}

// Season numbers, oldest first, e.g. [5]
export function getSeasons() {
  return [...new Set(rounds.map((r) => r.season))]
}

// All Round tables for a season, in order
export function getRounds(season) {
  return rounds.filter((r) => r.season === season)
}

// One Round table, e.g. getRound(5, 7)
export function getRound(season, round) {
  return roundFiles[`../parsed-data/${season}/${round}.json`]
}

// One Song table, e.g. getSong(5, 7, '0lhwqtb4BaFnC9ydl0VSKV')
export function getSong(season, round, trackId) {
  return songFiles[`../parsed-data/${season}/${round}/${trackId}.json`]
}
