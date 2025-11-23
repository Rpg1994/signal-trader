import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Layout({ children }) {
  const router = useRouter()
  
  const isActive = (path) => router.pathname === path
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent cursor-pointer">
                  🏴 Signal Trader
                </span>
              </Link>
              
              <nav className="hidden md:flex space-x-6">
                <Link href="/">
                  <span className={`cursor-pointer transition-colors ${isActive('/') ? 'text-primary font-semibold' : 'text-gray-300 hover:text-white'}`}>
                    Dashboard
                  </span>
                </Link>
                <Link href="/signals">
                  <span className={`cursor-pointer transition-colors ${isActive('/signals') ? 'text-primary font-semibold' : 'text-gray-300 hover:text-white'}`}>
                    Signals
                  </span>
                </Link>
                <Link href="/positions">
                  <span className={`cursor-pointer transition-colors ${isActive('/positions') ? 'text-primary font-semibold' : 'text-gray-300 hover:text-white'}`}>
                    Positions
                  </span>
                </Link>
                <Link href="/stats">
                  <span className={`cursor-pointer transition-colors ${isActive('/stats') ? 'text-primary font-semibold' : 'text-gray-300 hover:text-white'}`}>
                    Stats
                  </span>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
          
          {/* Mobile Nav */}
          <nav className="md:hidden flex justify-around mt-4 pt-4 border-t border-gray-700">
            <Link href="/">
              <span className={`text-sm cursor-pointer ${isActive('/') ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                Dashboard
              </span>
            </Link>
            <Link href="/signals">
              <span className={`text-sm cursor-pointer ${isActive('/signals') ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                Signals
              </span>
            </Link>
            <Link href="/positions">
              <span className={`text-sm cursor-pointer ${isActive('/positions') ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                Positions
              </span>
            </Link>
            <Link href="/stats">
              <span className={`text-sm cursor-pointer ${isActive('/stats') ? 'text-primary font-semibold' : 'text-gray-400'}`}>
                Stats
              </span>
            </Link>
          </nav>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>Signal Trader v2.0 • UFC + Boxing • Real-time monitoring</p>
        </div>
      </footer>
    </div>
  )
}
