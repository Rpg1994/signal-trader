import Layout from '../components/Layout'
import StatsPanel from '../components/StatsPanel'
import useSWR from 'swr'
import { formatDistanceToNow } from 'date-fns'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const fetcher = (url) => fetch(url).then((r) => r.json())

export default function StatsPage() {
  const { data: stats } = useSWR(`${API_URL}/api/stats`, fetcher, {
    refreshInterval: 60000
  })
  
  const { data: settledBets } = useSWR(`${API_URL}/api/bets`, fetcher)

  const wonBets = settledBets?.filter(b => b.status === 'WON') || []
  const lostBets = settledBets?.filter(b => b.status === 'LOST') || []

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Performance Stats</h1>
          <p className="text-gray-400">Track your edge and profitability</p>
        </div>

        {stats && <StatsPanel stats={stats} />}

        {stats?.by_sport && Object.keys(stats.by_sport).length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">By Sport</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(stats.by_sport).map(([sport, data]) => (
                <div key={sport} className="card">
                  <h3 className="font-bold text-lg mb-2">{sport}</h3>
                  <div className="text-sm text-gray-400">
                    {data.count} bets
                  </div>
                  <div className={`text-2xl font-bold mt-2 ${
                    data.profit >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {data.profit > 0 ? '+' : ''}{data.profit.toFixed(2)} units
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {wonBets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 text-green-400">
              ✅ Recent Wins ({wonBets.length})
            </h2>
            <div className="card">
              <div className="space-y-3">
                {wonBets.slice(0, 5).map((bet) => (
                  <div key={bet.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                    <div>
                      <div className="font-semibold">{bet.selection}</div>
                      <div className="text-sm text-gray-400">
                        {bet.sport} • {bet.book}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-bold">
                        +{bet.profit_loss?.toFixed(2)}u
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(bet.settled_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {lostBets.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              ❌ Recent Losses ({lostBets.length})
            </h2>
            <div className="card">
              <div className="space-y-3">
                {lostBets.slice(0, 5).map((bet) => (
                  <div key={bet.id} className="flex justify-between items-center py-2 border-b border-gray-700 last:border-0">
                    <div>
                      <div className="font-semibold">{bet.selection}</div>
                      <div className="text-sm text-gray-400">
                        {bet.sport} • {bet.book}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-red-400 font-bold">
                        {bet.profit_loss?.toFixed(2)}u
                      </div>
                      <div className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(bet.settled_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
