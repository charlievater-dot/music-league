// Turns the Music League CSV exports in data/<season>/ into the JSON tables
// the site reads. Run with `npm run parse` after adding a new export.
//
// Output (see README.md, "Parsing"):
//   parsed-data/people.json                        People table
//   parsed-data/<season>/<round>.json              Round table
//   parsed-data/<season>/<round>/<track-id>.json   Song table

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Papa from 'papaparse'

const outDir = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.join(outDir, '..', 'data')

function readCsv(season, name) {
  const file = path.join(dataDir, season, `${name}.csv`)
  const result = Papa.parse(fs.readFileSync(file, 'utf8'), {
    header: true,
    skipEmptyLines: true,
  })
  if (result.errors.length > 0) {
    throw new Error(`Could not read ${file}: ${result.errors[0].message}`)
  }
  return result.data
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n')
}

// "spotify:track:0lhwqtb4BaFnC9ydl0VSKV" -> "0lhwqtb4BaFnC9ydl0VSKV"
const trackId = (uri) => uri.split(':').pop()

const isNumbered = (name) => /^\d+$/.test(name)

// Season folders are the numbered folders in data/, e.g. data/5
const seasons = fs
  .readdirSync(dataDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && isNumbered(entry.name))
  .map((entry) => entry.name)
  .sort((a, b) => a - b)

// Start fresh, so rounds or songs removed from an export don't linger.
// Only generated output is deleted: people.json and numbered season folders.
for (const entry of fs.readdirSync(outDir, { withFileTypes: true })) {
  if (entry.name === 'people.json' || (entry.isDirectory() && isNumbered(entry.name))) {
    fs.rmSync(path.join(outDir, entry.name), { recursive: true })
  }
}

// Person ID -> { name, seasons: { <season>: score } }
const people = new Map()

for (const season of seasons) {
  const competitors = readCsv(season, 'competitors')
  const rounds = readCsv(season, 'rounds')
  const submissions = readCsv(season, 'submissions')
  const votes = readCsv(season, 'votes')

  const names = new Map(competitors.map((c) => [c.ID, c.Name.trim()]))
  const nameOf = (id) => names.get(id) ?? 'Unknown'

  // Everyone in the season starts on 0, including people who scored nothing
  for (const c of competitors) {
    const person = people.get(c.ID) ?? { seasons: {} }
    person.name = nameOf(c.ID) // the latest season's name wins
    person.seasons[season] = 0
    people.set(c.ID, person)
  }

  // Rounds are numbered in the order they were created
  rounds.sort((a, b) => a.Created.localeCompare(b.Created))

  rounds.forEach((round, i) => {
    const roundNumber = i + 1
    const roundVotes = votes.filter((v) => v['Round ID'] === round.ID)

    const songs = submissions
      .filter((s) => s['Round ID'] === round.ID)
      .map((s) => {
        const songVotes = roundVotes.filter((v) => v['Spotify URI'] === s['Spotify URI'])
        return {
          trackId: trackId(s['Spotify URI']),
          title: s.Title,
          artist: s['Artist(s)'],
          album: s.Album,
          submitterId: s['Submitter ID'],
          submitter: nameOf(s['Submitter ID']),
          votes: songVotes.reduce((sum, v) => sum + Number(v['Points Assigned']), 0),
          voters: songVotes
            .map((v) => ({
              voter: nameOf(v['Voter ID']),
              votes: Number(v['Points Assigned']),
              comment: v.Comment.trim(),
            }))
            .sort((a, b) => b.votes - a.votes),
        }
      })
      .sort((a, b) => b.votes - a.votes)

    // Tied songs share a rank: 18, 17, 15, 15, 14 -> 1, 2, 3, 3, 5
    songs.forEach((song, j) => {
      song.rank = j > 0 && song.votes === songs[j - 1].votes ? songs[j - 1].rank : j + 1
    })

    for (const song of songs) {
      const person = people.get(song.submitterId)
      if (person) person.seasons[season] += song.votes

      // Song table
      writeJson(path.join(outDir, season, String(roundNumber), `${song.trackId}.json`), {
        season: Number(season),
        round: roundNumber,
        trackId: song.trackId,
        title: song.title,
        artist: song.artist,
        album: song.album,
        submitter: song.submitter,
        votes: song.votes,
        rank: song.rank,
        voters: song.voters,
      })
    }

    // Round table
    writeJson(path.join(outDir, season, `${roundNumber}.json`), {
      season: Number(season),
      round: roundNumber,
      name: round.Name.trim(),
      description: round.Description.trim(),
      playlist: round['Playlist URL'],
      songs: songs.map(({ rank, trackId, title, artist, album, submitter, votes }) => ({
        rank,
        trackId,
        title,
        artist,
        album,
        submitter,
        votes,
      })),
    })
  })

  console.log(`Season ${season}: ${rounds.length} rounds, ${submissions.length} songs`)
}

// People table
const peopleTable = [...people.values()]
  .map((person) => {
    const scores = Object.values(person.seasons)
    const total = scores.reduce((sum, score) => sum + score, 0)
    return {
      name: person.name,
      seasons: person.seasons,
      total,
      // Average score per season played, to one decimal place
      average: Math.round((total / scores.length) * 10) / 10,
    }
  })
  .sort((a, b) => b.total - a.total)

writeJson(path.join(outDir, 'people.json'), peopleTable)
console.log(`People: ${peopleTable.length}`)
