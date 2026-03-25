import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import PostMessageForm from '#/components/PostMessageForm'
import SearchBar from '#/components/SearchBar'
import GuestbookEntryList from '#/components/GuestbookEntryList'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <main className="page-wrap min-h-[80vh] px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-[var(--sea-ink)]">
            Guestbook
          </h1>
          <p className="text-[var(--sea-ink-soft)]">
            Leave a message on the Sepolia blockchain.
          </p>
        </div>

        <div className="mb-6">
          <PostMessageForm />
        </div>

        <div className="mb-4">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <GuestbookEntryList searchQuery={searchQuery} />
      </div>
    </main>
  )
}
