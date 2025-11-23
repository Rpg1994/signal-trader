export default function StatsPanel({ stats }) {
  if (!stats) return null

  const formatCurrency = (value) => {
    return value > 0 ? `+${value.toFixed(2)}` : value.toFixed(2)
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="stat-card">
        <div className="stat-label">Total Bets</div>
        <div className="stat-value">{stats.total_bets}</div>
        <div className="text-sm text-gray-400 mt-1">
          {stats.wins}W - {stats.losses}L - {stats.pending}P
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Win Rate</div>
        <div className={`stat-value ${stats.win_rate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
          {stats.win_rate.toFixed(1)}%
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {stats.wins} / {stats.wins + stats.losses} settled
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">Net Profit</div>
        <div className={`stat-value ${stats.net_profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(stats.net_profit)} u
        </div>
        <div className="text-sm text-gray-400 mt-1">
          {stats.total_risked.toFixed(2)}u risked
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-label">ROI</div>
        <div className={`stat-value ${stats.roi >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {formatCurrency(stats.roi)}%
        </div>
        <div className="text-sm text-gray-400 mt-1">
          CLV: {formatCurrency(stats.avg_clv)}
        </div>
      </div>
    </div>
  )
}
