import Layout from '../components/Layout'
import SignalCard from '../components/SignalCard'
import StatsPanel from '../components/StatsPanel'
import useSWR from 'swr'

const API_URL = process.env.NEXT_PUBLIC_API_URL
const fetcher = (url) => fetch(url).then((r) => r.json())

export default function Home() {
  const { data: signals, mutate: mutateSignals } = useSWR(`${API_URL}/api/signals?active_only=true`, fetcher, {
    refreshInterval: 30000
  })
  
  const { data: stats } = useSWR(`${API_URL}/api/stats`, fetcher, {
    refreshInterval: 60000
  })

  const handleBetLogged = () => {
    mutateSignals()
  }

  return (
    <Layout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Real-time UFC & Boxing signals • High conviction picks only</p>
        </div>

        {stats && <StatsPanel stats={stats} />}

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">
              🚨 Active Signals ({signals?.length || 0})
            </h2>
            <div className="text-sm text-gray-400">
              Auto-refresh every 30s
            </div>
          </div>

          {!signals ? (
            <div className="card text-center py-12">
              <div className="text-gray-400">Loading signals...</div>
            </div>
          ) : signals.length === 0 ? (
            <div className="card text-center py-12">
              <div className="text-gray-400">No active signals right now</div>
              <div className="text-sm text-gray-500 mt-2">
                New signals are generated every hour
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {signals.map((signal) => (
                <SignalCard
                  key={signal.id}
                  signal={signal}
                  onBetLogged={handleBetLogged}
                />
              ))}
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card">
            <h3 className="text-lg font-bold mb-2">📊 How It Works</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• Bot scans UFC + Boxing odds every hour</li>
              <li>• Detects steam moves, opening value, sharp action</li>
              <li>• Sends email alerts + updates dashboard</li>
              <li>• Click book → Place bet → Log it here</li>
              <li>• Track CLV, ROI, and performance</li>
            </ul>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-bold mb-2">🎯 Expected Volume</h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li>• UFC: 2-3 signals per month</li>
              <li>• Boxing: 2-4 signals per month</li>
              <li>• <strong className="text-white">Total: 4-7 signals per month</strong></li>
              <li>• High conviction picks only (EV ≥ 0.70)</li>
              <li>• Focus on quality over quantity</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  )
}
