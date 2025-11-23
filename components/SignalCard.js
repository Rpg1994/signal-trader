import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'

const API_URL = process.env.NEXT_PUBLIC_API_URL

export default function SignalCard({ signal, onBetLogged }) {
  const [showBetForm, setShowBetForm] = useState(false)
  const [betBook, setBetBook] = useState('draftkings')
  const [actualOdds, setActualOdds] = useState(signal.odds)
  const [actualStake, setActualStake] = useState(signal.units)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [betLinks, setBetLinks] = useState(null)

  const getConvictionColor = () => {
    if (signal.ev_score >= 0.90) return 'border-red-500'
    if (signal.ev_score >= 0.80) return 'border-orange-500'
    return 'border-yellow-500'
  }

  const getConvictionLabel = () => {
    if (signal.ev_score >= 0.90) return '🚀🚀🚀 EXTREME'
    if (signal.ev_score >= 0.80) return '🚀🚀 VERY HIGH'
    return '🚀 HIGH'
  }

  const loadBetLinks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/signals/${signal.id}/bet-links`)
      const links = await response.json()
      setBetLinks(links)
    } catch (error) {
      console.error('Error loading bet links:', error)
    }
  }

  const openBook = (bookKey) => {
    if (!betLinks) return
    window.open(betLinks[bookKey].url, '_blank')
    setShowBetForm(true)
    setBetBook(bookKey)
  }

  const logBet = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/bets/log`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signal_id: signal.id,
          book: betBook,
          actual_odds: actualOdds,
          actual_stake: actualStake,
          notes: notes
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        setShowBetForm(false)
        if (onBetLogged) onBetLogged()
        
        // Show CLV if available
        if (data.clv) {
          alert(`✅ Bet logged! CLV: ${data.clv > 0 ? '+' : ''}${data.clv.toFixed(0)} pts`)
        } else {
          alert('✅ Bet logged successfully!')
        }
      }
    } catch (error) {
      console.error('Error logging bet:', error)
      alert('❌ Error logging bet')
    } finally {
      setLoading(false)
    }
  }

  const commenceTime = new Date(signal.commence_time)
  const timeUntil = formatDistanceToNow(commenceTime, { addSuffix: true })

  return (
    <div className={`card border-l-4 ${getConvictionColor()}`}>
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm text-gray-400">{signal.sport}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-sm text-gray-400">{timeUntil}</span>
          </div>
          <h3 className="text-xl font-bold mb-1">
            {signal.participant1} vs {signal.participant2}
          </h3>
          <div className="text-lg text-orange-400 font-semibold">
            🎯 BET: {signal.recommended_bet} @ {signal.odds > 0 ? '+' : ''}{signal.odds}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            Stake: {signal.units} UNITS
          </div>
        </div>
        
        <div className="text-right ml-4">
          <div className="text-sm text-gray-400 mb-1">{getConvictionLabel()}</div>
          <div className="text-3xl font-bold text-orange-400">
            {signal.ev_score.toFixed(2)}
          </div>
          <div className="text-xs text-gray-400">EV Score</div>
        </div>
      </div>

      {/* Signals */}
      <div className="flex flex-wrap gap-2 mb-4">
        {signal.signals.map((s, i) => (
          <span key={i} className="badge badge-orange">
            {s}
          </span>
        ))}
      </div>

      {/* Actions */}
      {!showBetForm ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
            <button
              onClick={() => { loadBetLinks(); openBook('draftkings') }}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm"
            >
              DraftKings
            </button>
            <button
              onClick={() => { loadBetLinks(); openBook('fanduel') }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded text-sm"
            >
              FanDuel
            </button>
            <button
              onClick={() => { loadBetLinks(); openBook('betmgm') }}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-3 rounded text-sm"
            >
              BetMGM
            </button>
            <button
              onClick={() => { loadBetLinks(); openBook('stake') }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-3 rounded text-sm"
            >
              Stake.com
            </button>
          </div>
          <button
            onClick={() => setShowBetForm(true)}
            className="w-full btn-secondary text-sm"
          >
            📝 Manual Log
          </button>
        </div>
      ) : (
        <div className="bg-gray-700 rounded p-4">
          <div className="text-sm font-bold mb-3">
            Log bet placed on {betBook}:
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1">Actual Odds</label>
              <input
                type="number"
                value={actualOdds}
                onChange={(e) => setActualOdds(parseFloat(e.target.value))}
                className="w-full bg-gray-600 px-3 py-2 rounded text-white"
                placeholder="+150"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1">Units Staked</label>
              <input
                type="number"
                step="0.5"
                value={actualStake}
                onChange={(e) => setActualStake(parseFloat(e.target.value))}
                className="w-full bg-gray-600 px-3 py-2 rounded text-white"
                placeholder="2"
              />
            </div>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs text-gray-400 mb-1">Notes (optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-gray-600 px-3 py-2 rounded text-white"
              placeholder="Any additional notes..."
            />
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={logBet}
              disabled={loading}
              className="flex-1 btn-success"
            >
              {loading ? '⏳ Logging...' : '✅ Confirm Bet Placed'}
            </button>
            <button
              onClick={() => setShowBetForm(false)}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
