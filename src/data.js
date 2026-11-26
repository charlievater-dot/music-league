import Papa from 'papaparse'
import competitorsCsv from '../data/competitors.csv?raw'
import roundsCsv from '../data/rounds.csv?raw'
import submissionsCsv from '../data/submissions.csv?raw'
import votesCsv from '../data/votes.csv?raw'

const parse = (csv) => Papa.parse(csv, { header: true, skipEmptyLines: true }).data

const competitors = parse(competitorsCsv)
const rounds = parse(roundsCsv)
const submissions = parse(submissionsCsv)
const votes = parse(votesCsv)

const names = new Map(competitors.map((c) => [c.ID, c.Name]))

// roundNumber starts at 1 and follows the order of rounds.csv
export function getRound(roundNumber) {
  const round = rounds[roundNumber - 1]

  const totals = new Map()
  for (const vote of votes) {
    if (vote['Round ID'] !== round.ID) continue
    const uri = vote['Spotify URI']
    totals.set(uri, (totals.get(uri) ?? 0) + Number(vote['Points Assigned']))
  }

  const songs = submissions
    .filter((s) => s['Round ID'] === round.ID)
    .map((s) => ({
      uri: s['Spotify URI'],
      title: s.Title,
      album: s.Album,
      artist: s['Artist(s)'],
      submitter: names.get(s['Submitter ID']) ?? 'Unknown',
      votes: totals.get(s['Spotify URI']) ?? 0,
    }))
    .sort((a, b) => b.votes - a.votes)

  // Tied songs share a rank: 18, 17, 15, 15, 14 -> 1, 2, 3, 3, 5
  songs.forEach((song, i) => {
    song.rank = i > 0 && song.votes === songs[i - 1].votes ? songs[i - 1].rank : i + 1
  })

  return { name: round.Name.trim(), songs }
}
