import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TokenData {
  name: string;
  symbol: string;
  contractAddress: string;
  allTimeVolume: number;
  volume24h: number;
  volume7d: number;
  volume30d: number;
  priceUsd: number;
  priceChange24h: number;
  marketCap: number;
  totalSupply: number;
  holders: number;
  transactions: number;
  firstTrade: string;
  lastTrade: string;
  chain: string;
}

// Simulated token database for demo
const mockTokens: Record<string, TokenData> = {
  '0x6982508145454ce325ddbe47a25d4ec3d2311933': {
    name: 'Pepe',
    symbol: 'PEPE',
    contractAddress: '0x6982508145454ce325ddbe47a25d4ec3d2311933',
    allTimeVolume: 48750000000,
    volume24h: 892000000,
    volume7d: 5420000000,
    volume30d: 18900000000,
    priceUsd: 0.00001842,
    priceChange24h: 12.4,
    marketCap: 7750000000,
    totalSupply: 420690000000000,
    holders: 298420,
    transactions: 15892340,
    firstTrade: '2023-04-14',
    lastTrade: '2024-01-15',
    chain: 'Ethereum',
  },
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': {
    name: 'Shiba Inu',
    symbol: 'SHIB',
    contractAddress: '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce',
    allTimeVolume: 156000000000,
    volume24h: 423000000,
    volume7d: 2890000000,
    volume30d: 11200000000,
    priceUsd: 0.00002156,
    priceChange24h: -3.2,
    marketCap: 12700000000,
    totalSupply: 589735030408322,
    holders: 1389420,
    transactions: 89234120,
    firstTrade: '2020-08-01',
    lastTrade: '2024-01-15',
    chain: 'Ethereum',
  },
};

function generateRandomToken(ca: string): TokenData {
  const names = ['MoonCoin', 'RocketFi', 'DiamondHands', 'DegenToken', 'ApeCoin', 'WhaleMaker'];
  const symbols = ['MOON', 'RKT', 'DMD', 'DGEN', 'APE', 'WHL'];
  const chains = ['Ethereum', 'BSC', 'Arbitrum', 'Base', 'Solana'];
  const idx = Math.floor(Math.random() * names.length);

  return {
    name: names[idx],
    symbol: symbols[idx],
    contractAddress: ca,
    allTimeVolume: Math.random() * 10000000000 + 1000000,
    volume24h: Math.random() * 100000000 + 10000,
    volume7d: Math.random() * 500000000 + 50000,
    volume30d: Math.random() * 2000000000 + 100000,
    priceUsd: Math.random() * 0.001,
    priceChange24h: (Math.random() - 0.5) * 50,
    marketCap: Math.random() * 1000000000 + 100000,
    totalSupply: Math.random() * 1000000000000,
    holders: Math.floor(Math.random() * 500000) + 1000,
    transactions: Math.floor(Math.random() * 10000000) + 10000,
    firstTrade: '2023-' + String(Math.floor(Math.random() * 12) + 1).padStart(2, '0') + '-01',
    lastTrade: '2024-01-15',
    chain: chains[Math.floor(Math.random() * chains.length)],
  };
}

function formatNumber(num: number): string {
  if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
  if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
  if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
  return '$' + num.toFixed(2);
}

function formatCount(num: number): string {
  if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
}

function ScanlineOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}

function GlitchText({ text, className }: { text: string; className?: string }) {
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 100);
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`relative inline-block ${className}`}>
      <span className={glitch ? 'opacity-0' : ''}>{text}</span>
      {glitch && (
        <>
          <span className="absolute left-[2px] top-0 text-[#ff3366] opacity-70">{text}</span>
          <span className="absolute left-[-2px] top-0 text-[#00d4ff] opacity-70">{text}</span>
        </>
      )}
    </span>
  );
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i <= text.length) {
          setDisplayed(text.slice(0, i));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 30);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, delay]);

  return <span>{displayed}<span className="animate-pulse">_</span></span>;
}

function DataRow({ label, value, color = 'green', delay = 0 }: { label: string; value: string; color?: string; delay?: number }) {
  const colorClasses: Record<string, string> = {
    green: 'text-[#00ff41]',
    cyan: 'text-[#00d4ff]',
    amber: 'text-[#ffb800]',
    red: 'text-[#ff3366]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: delay * 0.05, duration: 0.3 }}
      className="flex justify-between items-center py-2 border-b border-[#00ff41]/10 hover:bg-[#00ff41]/5 transition-colors px-2 -mx-2"
    >
      <span className="text-[#666] text-xs md:text-sm uppercase tracking-wider">{label}</span>
      <span className={`font-bold text-sm md:text-base ${colorClasses[color]}`}>{value}</span>
    </motion.div>
  );
}

function VolumeBar({ label, value, maxValue, delay = 0 }: { label: string; value: number; maxValue: number; delay?: number }) {
  const percentage = (value / maxValue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: delay * 0.1 }}
      className="mb-4"
    >
      <div className="flex justify-between text-xs md:text-sm mb-1">
        <span className="text-[#666] uppercase tracking-wider">{label}</span>
        <span className="text-[#00ff41] font-mono">{formatNumber(value)}</span>
      </div>
      <div className="h-2 bg-[#1a1a1a] rounded overflow-hidden border border-[#00ff41]/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ delay: delay * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-[#00ff41] to-[#00d4ff] relative"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function App() {
  const [contractAddress, setContractAddress] = useState('');
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState<string[]>([]);

  const handleTrack = useCallback(async () => {
    if (!contractAddress.trim()) {
      setError('ERROR: Contract address required');
      return;
    }

    const ca = contractAddress.trim().toLowerCase();

    // Basic validation
    if (!/^0x[a-f0-9]{40}$/i.test(ca) && !/^[a-zA-Z0-9]{32,44}$/.test(ca)) {
      setError('ERROR: Invalid contract address format');
      return;
    }

    setError('');
    setLoading(true);
    setTokenData(null);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));

    const data = mockTokens[ca] || generateRandomToken(ca);
    setTokenData(data);
    setLoading(false);

    if (!history.includes(ca)) {
      setHistory(prev => [ca, ...prev].slice(0, 5));
    }
  }, [contractAddress, history]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleTrack();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-mono selection:bg-[#00ff41] selection:text-black">
      <ScanlineOverlay />

      {/* Animated background grid */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b border-[#00ff41]/20 p-4 md:p-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="font-orbitron text-xl md:text-2xl lg:text-3xl font-bold tracking-wider">
                <GlitchText text="VOLUME" className="text-[#00ff41]" />
                <span className="text-[#00d4ff]">::</span>
                <span className="text-white">TRACKER</span>
              </h1>
              <p className="text-[#666] text-xs mt-1 tracking-widest uppercase">
                All-Time Token Volume Intelligence
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4 text-xs text-[#666]">
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[#00ff41] rounded-full animate-pulse" />
                SYSTEM ONLINE
              </span>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">

            {/* Input Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="border border-[#00ff41]/30 bg-[#0a0a0a]/80 backdrop-blur p-4 md:p-6 rounded-lg">
                <label className="block text-[#00ff41] text-xs uppercase tracking-widest mb-3">
                  {'>'} Enter Contract Address
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    type="text"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="0x... or Solana address"
                    className="flex-1 bg-[#1a1a1a] border border-[#00ff41]/30 rounded px-4 py-3 text-[#00ff41] placeholder-[#444] focus:outline-none focus:border-[#00ff41] focus:ring-1 focus:ring-[#00ff41]/50 transition-all font-mono text-sm md:text-base"
                    spellCheck={false}
                  />
                  <button
                    onClick={handleTrack}
                    disabled={loading}
                    className="px-6 py-3 bg-[#00ff41] text-black font-bold uppercase tracking-wider hover:bg-[#00d4ff] transition-all disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm md:text-base min-h-[48px]"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        SCANNING...
                      </span>
                    ) : (
                      'TRACK VOLUME'
                    )}
                  </button>
                </div>

                {error && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[#ff3366] text-sm mt-3 font-mono"
                  >
                    {error}
                  </motion.p>
                )}

                {/* Quick History */}
                {history.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#00ff41]/10">
                    <p className="text-[#666] text-xs mb-2 uppercase tracking-wider">Recent:</p>
                    <div className="flex flex-wrap gap-2">
                      {history.map((ca) => (
                        <button
                          key={ca}
                          onClick={() => setContractAddress(ca)}
                          className="text-xs bg-[#1a1a1a] text-[#00d4ff] px-2 py-1 rounded hover:bg-[#00d4ff]/10 transition-colors truncate max-w-[150px] md:max-w-[200px]"
                        >
                          {ca.slice(0, 6)}...{ca.slice(-4)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Loading State */}
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border border-[#00ff41]/30 bg-[#0a0a0a]/80 backdrop-blur p-8 rounded-lg text-center"
                >
                  <div className="text-[#00ff41] font-mono text-sm">
                    <TypewriterText text="ACCESSING BLOCKCHAIN DATA..." />
                  </div>
                  <div className="mt-4 flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 h-8 bg-[#00ff41]"
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results */}
            <AnimatePresence>
              {tokenData && !loading && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Token Header */}
                  <div className="border border-[#00ff41]/30 bg-[#0a0a0a]/80 backdrop-blur p-4 md:p-6 rounded-lg">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl md:text-3xl lg:text-4xl font-orbitron font-bold text-[#00ff41]">
                            {tokenData.symbol}
                          </span>
                          <span className="text-[#666] text-lg md:text-xl">{tokenData.name}</span>
                          <span className="px-2 py-1 bg-[#00d4ff]/10 text-[#00d4ff] text-xs rounded uppercase">
                            {tokenData.chain}
                          </span>
                        </div>
                        <p className="text-[#444] text-xs md:text-sm font-mono break-all">
                          {tokenData.contractAddress}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-[#666] text-xs uppercase tracking-wider mb-1">Current Price</p>
                        <p className="text-xl md:text-2xl font-bold text-white">
                          ${tokenData.priceUsd < 0.00001
                            ? tokenData.priceUsd.toExponential(4)
                            : tokenData.priceUsd.toFixed(8)
                          }
                        </p>
                        <p className={`text-sm ${tokenData.priceChange24h >= 0 ? 'text-[#00ff41]' : 'text-[#ff3366]'}`}>
                          {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h.toFixed(2)}% (24h)
                        </p>
                      </div>
                    </div>

                    {/* All-Time Volume Hero */}
                    <div className="bg-gradient-to-r from-[#00ff41]/10 via-[#00d4ff]/10 to-[#00ff41]/10 border border-[#00ff41]/30 rounded-lg p-4 md:p-6 text-center">
                      <p className="text-[#666] text-xs uppercase tracking-widest mb-2">All-Time Trading Volume</p>
                      <p className="text-3xl md:text-4xl lg:text-5xl font-orbitron font-bold text-[#00ff41] tracking-wider">
                        {formatNumber(tokenData.allTimeVolume)}
                      </p>
                      <p className="text-[#444] text-xs mt-2">
                        Since {tokenData.firstTrade} • {formatCount(tokenData.transactions)} total transactions
                      </p>
                    </div>
                  </div>

                  {/* Volume Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="border border-[#00ff41]/30 bg-[#0a0a0a]/80 backdrop-blur p-4 md:p-6 rounded-lg">
                      <h3 className="text-[#00d4ff] text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#00d4ff] rounded-full" />
                        Volume Breakdown
                      </h3>
                      <VolumeBar label="All-Time" value={tokenData.allTimeVolume} maxValue={tokenData.allTimeVolume} delay={0} />
                      <VolumeBar label="30 Days" value={tokenData.volume30d} maxValue={tokenData.allTimeVolume} delay={1} />
                      <VolumeBar label="7 Days" value={tokenData.volume7d} maxValue={tokenData.allTimeVolume} delay={2} />
                      <VolumeBar label="24 Hours" value={tokenData.volume24h} maxValue={tokenData.allTimeVolume} delay={3} />
                    </div>

                    <div className="border border-[#00ff41]/30 bg-[#0a0a0a]/80 backdrop-blur p-4 md:p-6 rounded-lg">
                      <h3 className="text-[#ffb800] text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#ffb800] rounded-full" />
                        Token Metrics
                      </h3>
                      <DataRow label="Market Cap" value={formatNumber(tokenData.marketCap)} color="green" delay={0} />
                      <DataRow label="Total Supply" value={formatCount(tokenData.totalSupply)} color="cyan" delay={1} />
                      <DataRow label="Holders" value={formatCount(tokenData.holders)} color="amber" delay={2} />
                      <DataRow label="Transactions" value={formatCount(tokenData.transactions)} color="green" delay={3} />
                      <DataRow label="First Trade" value={tokenData.firstTrade} color="cyan" delay={4} />
                      <DataRow label="Last Trade" value={tokenData.lastTrade} color="green" delay={5} />
                    </div>
                  </div>

                  {/* ASCII Art Decoration */}
                  <div className="text-center text-[#00ff41]/20 text-xs font-mono hidden md:block overflow-hidden">
                    <pre className="inline-block">
{`
╔═══════════════════════════════════════════════════════════════╗
║  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄  ║
║  █ VOLUME::TRACKER • BLOCKCHAIN INTELLIGENCE SYSTEM v2.0 █  ║
║  ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀  ║
╚═══════════════════════════════════════════════════════════════╝
`}
                    </pre>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Empty State */}
            {!tokenData && !loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border border-[#00ff41]/20 border-dashed bg-[#0a0a0a]/40 p-8 md:p-12 rounded-lg text-center"
              >
                <div className="text-[#00ff41]/30 text-4xl md:text-6xl mb-4 font-orbitron">{'{ }'}</div>
                <p className="text-[#666] text-sm md:text-base">Paste a contract address above to track token volume</p>
                <p className="text-[#444] text-xs mt-2">Supports ETH, BSC, Arbitrum, Base, and Solana addresses</p>

                {/* Demo tokens */}
                <div className="mt-6 pt-6 border-t border-[#00ff41]/10">
                  <p className="text-[#666] text-xs mb-3 uppercase tracking-wider">Try a demo:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <button
                      onClick={() => setContractAddress('0x6982508145454ce325ddbe47a25d4ec3d2311933')}
                      className="px-3 py-2 bg-[#1a1a1a] text-[#00ff41] text-xs rounded hover:bg-[#00ff41]/10 transition-colors"
                    >
                      $PEPE
                    </button>
                    <button
                      onClick={() => setContractAddress('0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce')}
                      className="px-3 py-2 bg-[#1a1a1a] text-[#00d4ff] text-xs rounded hover:bg-[#00d4ff]/10 transition-colors"
                    >
                      $SHIB
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-[#00ff41]/10 p-4 text-center">
          <p className="text-[#444] text-[10px] md:text-xs tracking-wider">
            Requested by <span className="text-[#666]">@souleiorigin</span> · Built by <span className="text-[#666]">@clonkbot</span>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        .font-orbitron {
          font-family: 'Orbitron', monospace;
        }
      `}</style>
    </div>
  );
}

export default App;
