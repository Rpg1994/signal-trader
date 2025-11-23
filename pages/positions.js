import Layout from '../components/Layout'
import PositionCard from '../components/PositionCard'
import useSWR from 'swr'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const fetcher = (url) => fetch(url).then((r) => r.json())

export default function PositionsPage() {
  const { data: bets, mutate } = useSWR(`${API_URL}/api/bets?status=PENDING`, fetcher, {
    refreshInterval: 30000
  })

  const handleSettled = () => {
    mutate()
  }

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Active Positions</h1>
          <p className="text-gray-400">Monitor your pending bets</p>
        </div>

        {!bets ? (
          <div className="card text-center py-12">
            <div className="text-gray-400">Loading positions...</div>
          </div>
        ) : bets.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-gray-400">No active positions</div>
            <div className="text-sm text-gray-500 mt-2">
              Place a bet from the dashboard to see it here
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {bets.map((bet) => (
              <PositionCard
                key={bet.id}
                bet={bet}
                onSettled={handleSettled}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
