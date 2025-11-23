import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function PositionCard({ bet, onSettled }) {
  const [showSettle, setShowSettle] = useState(false)
  const [closingOdds, setClosingOdds] = useState('')
  const [loading, setLoading] = useState(false)

  const settleBet = async (result) => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/bets/${bet.id}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          result: result,
          closing_odds: closingOdds ? parseFloat(closingOdds) : null
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        if (onSettled) onSettled()
        setShowSettle(false)
        
        let message = `✅ Bet marked as ${result}`
        if (data.profit_loss) {
          message += `\nP/L: ${data.profit_loss > 0 ? '+' : ''}${data.profit_loss.toFixed(2)} units`
        }
        if (data.clv) {
          message += `\nCLV: ${data.clv > 0 ? '+' : ''}${data.clv.toFixed(0)} pts`
        }
        alert(message)
      }
    } catch (error) {
      console.error('Error settling bet:', error)
      alert('❌ Error settling bet')
    } finally {
      setLoading(false)
    }
  }

  const placedTime = new Date(bet.placed_at)
  const timeAgo = formatDistanceToNow(placedTime, { addSuffix: true })

  return (
    <div className="card border-l-4 border-blue-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">{bet.sport}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-400">{bet.book}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-400">Placed {timeAgo}</span>
          </div>
          
          <h3 className="text-xl font-bold mb-2">{bet.selection}</h3>
          
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-gray-400">Odds:</span>
              <span className="ml-2 font-semibold">{bet.odds > 0 ? '+' : ''}{bet.odds}</span>
            </div>
            <div>
              <span className="text-gray-400">Stake:</span>
              <span className="ml-2 font-semibold">{bet.stake} units</span>
            </div>
            {bet.clv !== null && bet.clv !== undefined && (
              <div>
                <span className="text-gray-400">CLV:</span>
                <span className={`ml-2 font-semibold ${bet.clv >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {bet.clv > 0 ? '+' : ''}{bet.clv.toFixed(0)}
                </span>
              </div>
            )}
          </div>
          
          {bet.notes && (
            <div className="mt-2 text-sm text-gray-400 italic">
              Note: {bet.notes}
            </div>
          )}
        </div>
        
        <div className="ml-4">
          <span className="badge badge-blue">
            {bet.status}
          </span>
        </div>
      </div>

      {!showSettle ? (
        <div className="flex gap-2">
          <button
            onClick={() => settleBet('WON')}
            className="flex-1 btn-success"
          >
            ✅ Won
          </button>
          <button
            onClick={() => settleBet('LOST')}
            className="flex-1 btn-danger"
          >
            ❌ Lost
          </button>
          <button
            onClick={() => setShowSettle(true)}
            className="btn-secondary"
          >
            ⚙️ Advanced
          </button>
        </div>
      ) : (
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm font-bold mb-3">Settle with closing odds:</div>
          
          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">
              Closing Line (optional, for CLV tracking)
            </label>
            <input
              type="number"
              value={closingOdds}
              onChange={(e) => setClosingOdds(e.target.value)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-white"
              placeholder="e.g. +145"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 mb-2">
            <button
              onClick={() => settleBet('WON')}
              disabled={loading}
              className="btn-success text-sm"
            >
              Won
            </button>
            <button
              onClick={() => settleBet('LOST')}
              disabled={loading}
              className="btn-danger text-sm"
            >
              Lost
            </button>
            <button
              onClick={() => settleBet('VOID')}
              disabled={loading}
              className="btn-secondary text-sm"
            >
              Void
            </button>
          </div>
          
          <button
            onClick={() => setShowSettle(false)}
            className="w-full btn-secondary text-sm"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
