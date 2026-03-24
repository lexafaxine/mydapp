import { createFileRoute } from '@tanstack/react-router'
import { Wallet } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <main className="page-wrap flex min-h-[80vh] flex-col items-center justify-center px-4 py-20">
      <div className="mx-auto max-w-lg text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-[var(--sea-ink)]">
          mydApp
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-[var(--sea-ink-soft)]">
          A decentralized application built with TanStack Start on the Sepolia
          testnet.
        </p>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:opacity-90"
        >
          <Wallet className="h-5 w-5" />
          Connect Wallet
        </button>
      </div>
    </main>
  )
}
