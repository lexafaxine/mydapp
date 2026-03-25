import { useAccount, useConnect, useDisconnect, useSwitchChain } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { Wallet, LogOut } from 'lucide-react'

function truncateAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export default function ConnectWallet() {
  const { address, isConnected, chain } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { switchChain } = useSwitchChain()

  // 未连接 → 显示连接按钮
  if (!isConnected) {
    return (
      <button
        type="button"
        onClick={() => connect({ connector: connectors[0] })}
        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-semibold text-[var(--sea-ink)] transition hover:opacity-80"
      >
        <Wallet className="h-4 w-4" />
        Connect
      </button>
    )
  }

  // 已连接但不在 Sepolia → 提示切换网络
  if (chain?.id !== sepolia.id) {
    return (
      <button
        type="button"
        onClick={() => switchChain({ chainId: sepolia.id })}
        className="inline-flex items-center gap-1.5 rounded-full border border-amber-400 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-700 transition hover:opacity-80 dark:bg-amber-950 dark:text-amber-300"
      >
        Switch to Sepolia
      </button>
    )
  }

  // 已连接且在 Sepolia → 显示地址 + 断开按钮
  return (
    <div className="inline-flex items-center gap-1.5">
      <span className="rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3 py-1.5 text-sm font-medium text-[var(--sea-ink)]">
        {truncateAddress(address!)}
      </span>
      <button
        type="button"
        onClick={() => disconnect()}
        className="rounded-full p-1.5 text-[var(--sea-ink-soft)] transition hover:text-[var(--sea-ink)]"
        title="Disconnect"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  )
}
