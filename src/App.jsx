import { Route, Routes } from 'react-router-dom'

function Home() {
  return <h1>Music League</h1>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}
