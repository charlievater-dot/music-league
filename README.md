# Music League Companion Site

A website for presenting Music League data in many formats. Example features
(not an exhaustive list — more will be added over time):

- Round-by-round results
- Single-season standings
- Inter-season / all-time rankings
- History of all played songs
- Player stats (e.g. average placement, most submitted genre/artist)
- Leaderboards (e.g. most first-place votes, biggest upsets)
- Song/artist search across all seasons
- Awards or superlatives per season (e.g. "most controversial pick")

## Data Flow

1. After each round, export the results from Music League.
2. The site reads that data and renders it (results, rankings, song history).

Data is updated manually per round — there is no live database or upload form.

## Parsing

Each season's Music League export goes in its own folder, named after the
season number:

```
data/
  5/
    competitors.csv
    rounds.csv
    submissions.csv
    votes.csv
```

`parsed-data/parse.js` reads these exports and writes the parsed tables to
`parsed-data/`:

| Table | Files | Rows | Built from |
|---|---|---|---|
| People | One, for everyone | Each person who has played, with their score in each season, their total score, and their average score across all seasons | competitors, submissions, votes |
| Round | One per round | Each song submitted, with its artist, album, submitter, and how many votes it got | competitors, submissions, votes, rounds |
| Song | One per song submitted in a round | Each voter, with their name, how many votes they gave, and their comment | competitors, submissions, votes |

The People table sits at the top of `parsed-data/`. Each season has a folder,
named after the season number, holding its Round tables. Each round also has a
folder, named after the round number, holding that round's Song tables:

```
parsed-data/
  parse.js
  people.json           People table
  5/                    Season 5
    1.json              Round table: Round 1
    1/
      <track-id>.json   Song table: one per song in the round
    2.json
    2/
    ...
```

Song tables are named by Spotify track ID. A song submitted in more than one
round gets a separate Song table in each round's folder.

A person's score is the total points their submissions received. Votes link
to songs, not people, so the People table also needs submissions to know who
submitted each song.

## Stack

- Frontend: React, built with Vite
- Routing: React Router with `HashRouter`, so deep links and refreshes work on
  GitHub Pages
- Filter and search state kept in the URL, so filtered views can be shared
- Built as a static site (`npm run build`) — no server required at runtime
- Hosting: GitHub Pages

## Status

Planning stage — no application code has been written yet.
