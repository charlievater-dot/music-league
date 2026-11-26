const medals = { 1: 'gold', 2: 'silver', 3: 'bronze' }

// Row class for the top three, so the rank badge and score get medal colours
export function medalClass(rank) {
  return medals[rank]
}

export default function Rank({ rank }) {
  return <span className="rank">{rank}</span>
}
