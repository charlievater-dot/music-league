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
2. A script parses the export and converts it into the site's data format.
3. The site reads that data and renders it (results, rankings, song history).

Data is updated manually per round — there is no live database or upload form.

## Stack

- Frontend: React
- Built as a static export (`npm run build`) — no server required at runtime
- Hosting: free static host (e.g. GitHub Pages or Netlify), TBD

## Status

Planning stage — no application code has been written yet.
